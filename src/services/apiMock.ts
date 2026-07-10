import type {
  EmpresaInfo,
  ProcessosPaginados,
  ProcessoAndamento,
  ProcessoTramitacoes,
} from "../types/clientTypes.ts";
import {
  MOCK_EMPRESA,
  MOCK_PROCESSOS,
  MOCK_ANDAMENTOS,
  MOCK_TRAMITACOES,
} from "./mockData";

const ITENS_POR_PAGINA = 4;

function delay<T>(valor: T, ms = 500): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(valor), ms));
}

// Mesma assinatura de fetchEmpresaInfo em api.ts, só que com dados falsos
export async function fetchEmpresaInfo(cnpj: string): Promise<EmpresaInfo> {
  console.log(cnpj);

  return delay(MOCK_EMPRESA);
}

// Mesma assinatura de fetchProcessos em api.ts, com paginação real sobre o mock
export async function fetchProcessos(
  cnpj: string,
  page: number
): Promise<ProcessosPaginados> {
  console.log(cnpj);
  const inicio = (page - 1) * ITENS_POR_PAGINA;
  const fim = inicio + ITENS_POR_PAGINA;

  return delay({
    processos: MOCK_PROCESSOS.slice(inicio, fim),
    paginaAtual: page,
    totalPaginas: Math.ceil(MOCK_PROCESSOS.length / ITENS_POR_PAGINA),
    totalProcessos: MOCK_PROCESSOS.length,
  });
}

// Mesma assinatura de fetchProcessoAndamento em api.ts
export async function fetchProcessoAndamento(
  processoId: string
): Promise<ProcessoAndamento> {
  const andamento = MOCK_ANDAMENTOS[processoId];

  if (!andamento) {
    throw new Error(`Andamento mock não encontrado para id ${processoId}`);
  }

  return delay(andamento);
}

// Mesma assinatura de fetchProcessoTramitacoes em api.ts
export async function fetchProcessoTramitacoes(
  processoId: string
): Promise<ProcessoTramitacoes> {
  const tramitacoes = MOCK_TRAMITACOES[processoId];

  if (!tramitacoes) {
    throw new Error(`Tramitações mock não encontradas para id ${processoId}`);
  }

  return delay(tramitacoes);
}
