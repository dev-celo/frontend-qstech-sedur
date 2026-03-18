import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { Processo, Tramitacao } from "@/types";
import { isWithinLastDays, parseBRDate } from "@/utils/date";

const CACHE_KEY = "processos_cache_v2";
const META_KEY = "processos_meta_v2";
const CACHE_VERSION = "2.0";
const DIAS_RECENTES = 7;

// 🔥 Variável de debug - mude para false em produção
const DEBUG = false;

async function getUltimasTramitacoes(
  processoId: string,
  limite: number = 3
): Promise<Tramitacao[]> {
  try {
    const ref = collection(db, "processos", processoId, "tramitacoes");
    const snapshot = await getDocs(ref);

    if (snapshot.empty) return [];

    const tramitacoes = snapshot.docs.map((doc) => doc.data() as Tramitacao);

    return tramitacoes
      .sort((a, b) => {
        const da = parseBRDate(a.data);
        const db = parseBRDate(b.data);
        return (db?.getTime() || 0) - (da?.getTime() || 0);
      })
      .slice(0, limite);
  } catch (error) {
    console.error("Erro ao buscar tramitações:", error);
    return [];
  }
}

function isDataRecente(dataStr: string): boolean {
  const parsed = parseBRDate(dataStr);
  const isRecente = isWithinLastDays(parsed, DIAS_RECENTES);
  
  // Log para debug (controlado pela variável DEBUG)
  if (parsed && DEBUG) {
    console.log(`🔍 Data: ${dataStr} → ${parsed.toLocaleDateString('pt-BR')} → Recente: ${isRecente}`);
  }
  
  return isRecente;
}

export async function getProcessos(): Promise<Processo[]> {
  console.log("🚀 Buscando processos...");

  const cache = localStorage.getItem(CACHE_KEY);
  const meta = localStorage.getItem(META_KEY);

  const metaDoc = await getDoc(doc(db, "controle", "sedur"));
  const ultimaAtualizacao = metaDoc.data()?.ultima_atualizacao;

  // ✅ USA CACHE SE VÁLIDO
  if (cache && meta) {
    const parsedMeta = JSON.parse(meta);

    if (
      parsedMeta.ultima_atualizacao === ultimaAtualizacao &&
      parsedMeta.version === CACHE_VERSION
    ) {
      console.log("✅ Cache válido usado");
      const cachedData = JSON.parse(cache) as Processo[];
      
      console.log(`📊 Total processos (cache): ${cachedData.length}`);
      console.log(`📊 Processos recentes (cache): ${cachedData.filter(p => p.isRecente).length}`);
      
      return cachedData;
    }
  }

  console.log("🔥 Buscando do Firestore...");

  const snapshot = await getDocs(collection(db, "processos"));

  const processos = await Promise.all(
    snapshot.docs.map(async (docSnap) => {
      const data = docSnap.data() as Omit<
        Processo,
        "id" | "ultima_tramitacao" | "ultimas_tramitacoes" | "isRecente"
      >;

      const tramitacoes = await getUltimasTramitacoes(docSnap.id, 3);

      const ultima = tramitacoes[0];
      const isRecente = ultima ? isDataRecente(ultima.data) : false;

      return {
        id: docSnap.id,
        ...data,
        ultimas_tramitacoes: tramitacoes,
        ultima_tramitacao: ultima,
        isRecente,
      } as Processo;
    })
  );

  // ✅ FILTRO FINAL
  const recentes = processos
    .filter((p) => p.isRecente)
    .sort((a, b) => {
      const da = parseBRDate(a.ultima_tramitacao?.data || "");
      const db = parseBRDate(b.ultima_tramitacao?.data || "");
      return (db?.getTime() || 0) - (da?.getTime() || 0);
    });

  console.log(`📊 Total processos (Firestore): ${processos.length}`);
  console.log(`📊 Processos recentes: ${recentes.length}`);
  
  // Debug com a variável DEBUG
  if (DEBUG) {
    console.log("📅 Amostra de datas recentes:");
    recentes.slice(0, 5).forEach(p => {
      console.log(`   ${p.protocolo}: ${p.ultima_tramitacao?.data || 'sem data'}`);
    });
  }

  // ✅ SALVA CACHE
  localStorage.setItem(CACHE_KEY, JSON.stringify(recentes));
  localStorage.setItem(
    META_KEY,
    JSON.stringify({
      ultima_atualizacao: ultimaAtualizacao,
      version: CACHE_VERSION,
    })
  );

  return recentes;
}

export function limparCache() {
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(META_KEY);
  console.log("🧹 Cache limpo manualmente");
}

export async function getUltimaAtualizacaoReal(): Promise<string> {
  try {
    const metaDoc = await getDoc(doc(db, "metadados", "ultima_extracao"));
    const data = metaDoc.data();
    
    if (data) {
      // 🔥 CORREÇÃO: Os campos corretos são 'fim' dentro de 'metadados'
      const fimExtracao = data.metadados?.fim || data.fim || data.timestamp;
      console.log("📅 Data encontrada no Firestore:", fimExtracao);
      return fimExtracao || "";
    }
    
    return "";
  } catch (error) {
    console.error("Erro ao buscar última atualização:", error);
    
    // Fallback para o cache
    const meta = localStorage.getItem(META_KEY);
    if (meta) {
      const parsed = JSON.parse(meta);
      return parsed.ultima_atualizacao || "";
    }
    
    return "";
  }
}

// Adicione esta função
export async function forceRefreshProcessos(): Promise<Processo[]> {
  console.log("🔄 Forçando atualização do cache...");
  
  // 🔥 Limpa o cache manualmente
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(META_KEY);
  
  // 🔥 Busca diretamente do Firestore
  return await getProcessos();
}