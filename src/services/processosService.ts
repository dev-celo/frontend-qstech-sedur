/* eslint-disable @typescript-eslint/no-explicit-any */
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { Processo, Tramitacao } from "@/types";
import { isWithinLastDays, parseBRDate } from "@/utils/date";

const CACHE_KEY = "processos_cache_v2";
const META_KEY = "processos_meta_v2";
const CACHE_VERSION = "3.0"; // Versão atualizada
const DIAS_RECENTES = 7;

// 🔥 Variável de debug - mude para false em produção
const DEBUG = false;

// 🔥 CACHE DE TRAMITAÇÕES (para evitar múltiplas leituras)
// eslint-disable-next-line prefer-const
let tramitacoesCache: Map<string, Tramitacao[]> = new Map();

/**
 * 🔥 OTIMIZAÇÃO CRÍTICA: Busca APENAS a ÚLTIMA tramitação (não todas)
 * Reduz de 3 leituras por processo para 1
 */
async function getUltimaTramitacao(processoId: string): Promise<Tramitacao | null> {
  // Verifica cache em memória primeiro
  if (tramitacoesCache.has(processoId)) {
    const cached = tramitacoesCache.get(processoId);
    return cached && cached.length > 0 ? cached[0] : null;
  }
  
  try {
    const ref = collection(db, "processos", processoId, "tramitacoes");
    const snapshot = await getDocs(ref);

    if (snapshot.empty) return null;

    const tramitacoes = snapshot.docs.map((doc) => doc.data() as Tramitacao);
    
    // Ordena e pega a mais recente
    const ordenadas = tramitacoes.sort((a, b) => {
      const da = parseBRDate(a.data);
      const db = parseBRDate(b.data);
      return (db?.getTime() || 0) - (da?.getTime() || 0);
    });
    
    const maisRecente = ordenadas[0] || null;
    
    // Salva no cache em memória
    tramitacoesCache.set(processoId, ordenadas);
    
    return maisRecente;
    
  } catch (error) {
    console.error("Erro ao buscar tramitação:", error);
    return null;
  }
}

/**
 * 🔥 OTIMIZAÇÃO: Limpa o cache de tramitações quando necessário
 */
export function limparCacheTramitacoes() {
  tramitacoesCache.clear();
  console.log("🧹 Cache de tramitações limpo");
}

function isDataRecente(dataStr: string): boolean {
  const parsed = parseBRDate(dataStr);
  const isRecente = isWithinLastDays(parsed, DIAS_RECENTES);
  
  if (parsed && DEBUG) {
    console.log(`🔍 Data: ${dataStr} → ${parsed.toLocaleDateString('pt-BR')} → Recente: ${isRecente}`);
  }
  
  return isRecente;
}

/**
 * 🔥 VERSÃO ULTRA OTIMIZADA: Busca documento resumo (1 leitura!)
 */
export async function getProcessos(): Promise<Processo[]> {
  console.log("🚀 Buscando processos (modo ultra otimizado)...");

  const cache = localStorage.getItem(CACHE_KEY);
  const meta = localStorage.getItem(META_KEY);

  // 🔥 Tenta buscar do documento resumo (1 leitura!)
  try {
    const resumoDoc = await getDoc(doc(db, "resumo", "dashboard"));
    const resumoData = resumoDoc.data();
    
    if (resumoData && resumoData.processos) {
      console.log("📦 Usando documento resumo (1 leitura!)");
      
      // Verifica se o cache local está atualizado
      if (cache && meta) {
        const parsedMeta = JSON.parse(meta);
        if (parsedMeta.ultima_atualizacao === resumoData.ultima_atualizacao) {
          console.log("✅ Cache local válido");
          return JSON.parse(cache);
        }
      }
      
      // Processa os dados do resumo
      const processos = resumoData.processos.map((p: any) => ({
        id: p.id,
        protocolo: p.protocolo,
        estagio: p.estagio,
        data: p.data,
        servico: p.servico,
        empresa: p.empresa,
        telefone: p.telefone,
        cnpj_cpf: p.cnpj_cpf,
        aba: p.aba,
        extraido_em: p.extraido_em,
        ultima_tramitacao: p.ultima_tramitacao_data ? {
          data: p.ultima_tramitacao_data,
          estagio: p.ultima_tramitacao_estagio,
          destino: p.ultima_tramitacao_destino
        } : null,
        isRecente: isDataRecente(p.ultima_tramitacao_data || p.data),
      } as Processo));
      
      // Filtra apenas os recentes
      const recentes = processos.filter((p: { isRecente: any; }) => p.isRecente);
      
      console.log(`📊 Total processos: ${processos.length}, Recentes: ${recentes.length}`);
      
      // Salva cache
      localStorage.setItem(CACHE_KEY, JSON.stringify(recentes));
      localStorage.setItem(META_KEY, JSON.stringify({
        ultima_atualizacao: resumoData.ultima_atualizacao,
        version: CACHE_VERSION
      }));
      
      return recentes;
    }
  } catch (error) {
    console.log(`⚠️ Documento resumo não encontrado, usando método tradicional: ${error}`);
  }

  // 🔥 FALLBACK: Método tradicional (se não houver documento resumo)
  console.log("🔥 Buscando do Firestore (método tradicional)...");

  const metaDoc = await getDoc(doc(db, "controle", "sedur"));
  const ultimaAtualizacao = metaDoc.data()?.ultima_atualizacao;

  // Usa cache se válido
  if (cache && meta) {
    const parsedMeta = JSON.parse(meta);
    if (parsedMeta.ultima_atualizacao === ultimaAtualizacao && parsedMeta.version === CACHE_VERSION) {
      console.log("✅ Cache válido usado");
      return JSON.parse(cache);
    }
  }

  const snapshot = await getDocs(collection(db, "processos"));
  console.log(`📦 Buscando ${snapshot.docs.length} processos...`);

  // 🔥 Processa em lotes para não sobrecarregar
  const processos: Processo[] = [];
  const BATCH_SIZE = 20;
  const docsArray = snapshot.docs;
  
  for (let i = 0; i < docsArray.length; i += BATCH_SIZE) {
    const batch = docsArray.slice(i, i + BATCH_SIZE);
    
    const batchProcessos = await Promise.all(
      batch.map(async (docSnap) => {
        const data = docSnap.data() as Omit<Processo, "id" | "ultima_tramitacao" | "isRecente">;
        
        // 🔥 Busca apenas a última tramitação (não todas)
        const ultimaTramitacao = await getUltimaTramitacao(docSnap.id);
        const isRecente = ultimaTramitacao ? isDataRecente(ultimaTramitacao.data) : false;

        return {
          id: docSnap.id,
          ...data,
          ultima_tramitacao: ultimaTramitacao,
          isRecente,
        } as Processo;
      })
    );
    
    processos.push(...batchProcessos);
    
    // Pequena pausa para não sobrecarregar
    if (i + BATCH_SIZE < docsArray.length) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  // Filtra apenas recentes
  const recentes = processos
    .filter((p) => p.isRecente)
    .sort((a, b) => {
      const da = parseBRDate(a.ultima_tramitacao?.data || "");
      const db = parseBRDate(b.ultima_tramitacao?.data || "");
      return (db?.getTime() || 0) - (da?.getTime() || 0);
    });

  console.log(`📊 Processos recentes: ${recentes.length}`);

  // Salva cache
  localStorage.setItem(CACHE_KEY, JSON.stringify(recentes));
  localStorage.setItem(META_KEY, JSON.stringify({
    ultima_atualizacao: ultimaAtualizacao,
    version: CACHE_VERSION,
  }));

  return recentes;
}

/**
 * 🔥 Busca apenas a última atualização (1 leitura)
 */
export async function getUltimaAtualizacaoReal(): Promise<string> {
  try {
    // Tenta documento resumo primeiro
    const resumoDoc = await getDoc(doc(db, "resumo", "dashboard"));
    if (resumoDoc.exists()) {
      return resumoDoc.data()?.ultima_atualizacao || "";
    }
    
    // Fallback para metadados
    const metaDoc = await getDoc(doc(db, "metadados", "ultima_extracao"));
    const data = metaDoc.data();
    
    if (data) {
      return data.metadados?.fim || data.fim || data.timestamp || "";
    }
    
    return "";
  } catch (error) {
    console.error("Erro ao buscar última atualização:", error);
    return "";
  }
}

/**
 * 🔥 Força atualização do cache
 */
export async function forceRefreshProcessos(): Promise<Processo[]> {
  console.log("🔄 Forçando atualização do cache...");
  
  limparCacheTramitacoes();
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(META_KEY);
  
  return await getProcessos();
}

/**
 * 🔥 Limpa todo o cache
 */
export function limparCache() {
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(META_KEY);
  limparCacheTramitacoes();
  console.log("🧹 Cache completo limpo");
}