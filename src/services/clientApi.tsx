import type {
  EmpresaInfo,
  ProcessosPaginados,
  ProcessoAndamento,
  ProcessoTramitacoes,
} from "../types/clientTypes.ts";

/**
 * TODO: substituir por chamada real, ex:
 * const res = await fetch(`/api/empresa/${cnpj}`);
 * if (!res.ok) throw new Error("Falha ao buscar dados da empresa");
 * return res.json();
 */
export async function fetchEmpresaInfo(cnpj: string): Promise<EmpresaInfo> {
  console.log(cnpj);

  throw new Error("fetchEmpresaInfo não implementado");
}

/**
 * TODO: substituir por chamada real, ex:
 * const res = await fetch(`/api/processos?cnpj=${cnpj}&page=${page}`);
 * if (!res.ok) throw new Error("Falha ao buscar processos");
 * return res.json();
 */
export async function fetchProcessos(
  cnpj: string,
  page: number
): Promise<ProcessosPaginados> {
  console.log(cnpj);
  console.log(page);
  throw new Error("fetchProcessos não implementado");
}

/**
 * TODO: substituir por chamada real, ex:
 * const res = await fetch(`/api/processos/${processoId}/andamento`);
 * if (!res.ok) throw new Error("Falha ao buscar andamento");
 * return res.json();
 */
export async function fetchProcessoAndamento(
  processoId: string
): Promise<ProcessoAndamento> {
  console.log(processoId);
  throw new Error("fetchProcessoAndamento não implementado");
}

/**
 * TODO: substituir por chamada real, ex:
 * const res = await fetch(`/api/processos/${processoId}/tramitacoes`);
 * if (!res.ok) throw new Error("Falha ao buscar tramitações");
 * return res.json();
 */
export async function fetchProcessoTramitacoes(
  processoId: string
): Promise<ProcessoTramitacoes> {
  console.log(processoId);
  throw new Error("fetchProcessoTramitacoes não implementado");
}
