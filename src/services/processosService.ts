/* eslint-disable @typescript-eslint/no-explicit-any */
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { Processo } from "@/types";
import { isWithinLastDays, parseBRDate } from "@/utils/date";

const CACHE_KEY = "processos_completo_v3";
const META_KEY = "processos_meta_v3";
const CACHE_VERSION = "3.0";
const DIAS_RECENTES = 7;

let cacheCarregado = false;

function isDataRecente(dataStr: string): boolean {
  const parsed = parseBRDate(dataStr);
  return isWithinLastDays(parsed, DIAS_RECENTES);
}

export async function getProcessos(forceRefresh = false): Promise<Processo[]> {
  console.log("🚀 Buscando processos...");

  if (!forceRefresh && cacheCarregado) {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      console.log("📦 Usando cache em memória (0 leituras!)");
      return JSON.parse(cached);
    }
  }

  const cache = localStorage.getItem(CACHE_KEY);
  const meta = localStorage.getItem(META_KEY);

  if (!forceRefresh && cache && meta) {
    try {
      const parsedMeta = JSON.parse(meta);
      const resumoDoc = await getDoc(doc(db, "resumo", "dashboard"));
      const resumoData = resumoDoc.data();
      
      if (resumoData && parsedMeta.ultima_atualizacao === resumoData.ultima_atualizacao) {
        console.log("✅ Cache válido - 0 leituras!");
        cacheCarregado = true;
        return JSON.parse(cache);
      }
    } catch (error) {
      console.warn("Erro ao validar cache:", error);
    }
  }

  console.log("📦 Buscando documento resumo (1 leitura)...");
  
  try {
    const resumoDoc = await getDoc(doc(db, "resumo", "dashboard"));
    
    if (!resumoDoc.exists()) {
      console.warn("⚠️ Documento resumo não encontrado.");
      return [];
    }
    
    const resumoData = resumoDoc.data() as any;
    
    const processos: Processo[] = (resumoData.processos || []).map((p: any) => ({
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
    
    localStorage.setItem(CACHE_KEY, JSON.stringify(processos));
    localStorage.setItem(META_KEY, JSON.stringify({
      ultima_atualizacao: resumoData.ultima_atualizacao,
      version: CACHE_VERSION
    }));
    
    cacheCarregado = true;
    
    console.log(`📊 ${processos.length} processos carregados (1 leitura!)`);
    
    const recentes = processos.filter(p => p.isRecente);
    console.log(`📊 Recentes: ${recentes.length} | Total no cache: ${processos.length}`);
    
    return recentes;
    
  } catch (error) {
    console.error("❌ Erro ao buscar documento resumo:", error);
    return [];
  }
}

export function getTodosProcessosCache(): Processo[] {
  const cache = localStorage.getItem(CACHE_KEY);
  if (cache) {
    try {
      return JSON.parse(cache);
    } catch {
      return [];
    }
  }
  return [];
}

export async function getUltimaAtualizacaoReal(): Promise<string> {
  try {
    const resumoDoc = await getDoc(doc(db, "resumo", "dashboard"));
    return resumoDoc.data()?.ultima_atualizacao || "";
  } catch (error) {
    console.error("Erro ao buscar última atualização:", error);
    return "";
  }
}

export async function forceRefreshProcessos(): Promise<Processo[]> {
  console.log("🔄 Forçando atualização do cache...");
  cacheCarregado = false;
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(META_KEY);
  return await getProcessos(true);
}

export function limparCache() {
  cacheCarregado = false;
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(META_KEY);
  console.log("🧹 Cache limpo");
}