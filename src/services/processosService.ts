import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { Processo } from "@/types";
import { isWithinLastDays, parseBRDate } from "@/utils/date";

const CACHE_KEY = "processos_cache_v2";
const META_KEY = "processos_meta_v2";
const CACHE_VERSION = "3.0";
const DIAS_RECENTES = 7;

// 🔥 Interface para o documento resumo
interface ResumoDocumento {
  ultima_atualizacao: string;
  total: number;
  processos: Array<{
    id: string;
    protocolo: string;
    estagio: string;
    data: string;
    servico: string;
    empresa: string;
    telefone: string;
    cnpj_cpf: string;
    aba: string;
    extraido_em: string;
    ultima_tramitacao_data?: string;
    ultima_tramitacao_estagio?: string;
    ultima_tramitacao_destino?: string;
  }>;
}

function isDataRecente(dataStr: string): boolean {
  const parsed = parseBRDate(dataStr);
  return isWithinLastDays(parsed, DIAS_RECENTES);
}

/**
 * 🔥 VERSÃO DEFINITIVA: APENAS 1 LEITURA!
 * Busca o documento resumo que contém todos os dados já processados
 */
export async function getProcessos(): Promise<Processo[]> {
  console.log("🚀 Buscando processos (modo otimizado - 1 leitura)...");

  const cache = localStorage.getItem(CACHE_KEY);
  const meta = localStorage.getItem(META_KEY);

  try {
    // 🔥 ÚNICA LEITURA NO FIRESTORE
    const resumoDoc = await getDoc(doc(db, "resumo", "dashboard"));
    
    if (!resumoDoc.exists()) {
      console.warn("⚠️ Documento resumo não encontrado. Execute uma extração primeiro.");
      return [];
    }
    
    const resumoData = resumoDoc.data() as ResumoDocumento;
    
    // Verifica cache local
    if (cache && meta) {
      const parsedMeta = JSON.parse(meta);
      if (parsedMeta.ultima_atualizacao === resumoData.ultima_atualizacao) {
        console.log("✅ Cache local válido");
        return JSON.parse(cache);
      }
    }
    
    // 🔥 Processa os dados do resumo com tipagem correta
    const processos: Processo[] = resumoData.processos.map((p) => ({
      id: p.id,
      protocolo: p.protocolo,
      estagio: p.estagio,
      data: p.data,
      servico: p.servico,
      empresa: p.empresa,
      telefone: p.telefone,
      cnpj_cpf: p.cnpj_cpf,
      aba: p.aba as "andamento" | "convite" | "finalizado",
      extraido_em: p.extraido_em,
      ultima_tramitacao: p.ultima_tramitacao_data ? {
        data: p.ultima_tramitacao_data,
        estagio: p.ultima_tramitacao_estagio || "",
        destino: p.ultima_tramitacao_destino || ""
      } : undefined,
      isRecente: isDataRecente(p.ultima_tramitacao_data || p.data),
    }));
    
    const recentes = processos.filter(p => p.isRecente);
    
    console.log(`📊 Total: ${processos.length} | Recentes: ${recentes.length} (1 leitura!)`);
    
    // Salva cache
    localStorage.setItem(CACHE_KEY, JSON.stringify(recentes));
    localStorage.setItem(META_KEY, JSON.stringify({
      ultima_atualizacao: resumoData.ultima_atualizacao,
      version: CACHE_VERSION
    }));
    
    return recentes;
    
  } catch (error) {
    console.error("❌ Erro ao buscar documento resumo:", error);
    return [];
  }
}

/**
 * 🔥 Busca apenas a última atualização
 */
export async function getUltimaAtualizacaoReal(): Promise<string> {
  try {
    const resumoDoc = await getDoc(doc(db, "resumo", "dashboard"));
    const data = resumoDoc.data() as ResumoDocumento | undefined;
    return data?.ultima_atualizacao || "";
  } catch (error) {
    console.error("Erro ao buscar última atualização:", error);
    return "";
  }
}

/**
 * 🔥 Força recarga (limpa cache)
 */
export async function forceRefreshProcessos(): Promise<Processo[]> {
  console.log("🔄 Forçando atualização do cache...");
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(META_KEY);
  return await getProcessos();
}

export function limparCache() {
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(META_KEY);
  console.log("🧹 Cache limpo");
}