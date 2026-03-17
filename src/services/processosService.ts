import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { Processo, Tramitacao } from "@/types";
import { isWithinLastDays, parseBRDate } from "@/utils/date";

const CACHE_KEY = "processos_cache_v2";
const META_KEY = "processos_meta_v2";
const CACHE_VERSION = "2.0"; // 🔥 muda isso se alterar regra
const DIAS_RECENTES = 7;

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
  } catch {
    return [];
  }
}

function isDataRecente(dataStr: string): boolean {
  const parsed = parseBRDate(dataStr);
  return isWithinLastDays(parsed, DIAS_RECENTES);
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
      return JSON.parse(cache);
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

  console.log(`📊 Recentes: ${recentes.length}`);

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
}

export async function getUltimaAtualizacaoReal(): Promise<string> {
  try {
    const metaDoc = await getDoc(doc(db, "metadados", "ultima_extracao"));
    return metaDoc.data()?.fim_extracao || "";
  } catch {
    return "";
  }
}