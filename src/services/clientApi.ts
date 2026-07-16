import type {
  clientPayload,
  LoginResponse,

  gerarCodigoPayload,
  validarCodigoPayload,

  EmpresaInfo,
  ProcessosPaginados,
  ProcessoAndamento,
  ProcessoTramitacoes,
} from "../types/clientTypes.ts";

export class requestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request(
  path: string,
  body: clientPayload | gerarCodigoPayload | validarCodigoPayload,
  errorMessage: string
) {
  const response = await fetch(path, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    credentials: 'include',
    body: JSON.stringify(body)
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) throw new requestError(data?.message || errorMessage, response.status);

  return data
}

// API LOGIN
export async function loginClient(cnpj_cpf: string, senha: string): Promise<LoginResponse> {
  const path = '/api/cliente/login'
  const errorMessage = "CNPJ/CPF ou senha inválidos"
  return request(path, { cnpj_cpf, senha }, errorMessage)
}

// API REGISTRO
export async function registroClient(cnpj_cpf: string, senha: string) {
  const path = "/api/cliente/registrar"
  const errorMessage = "Ocorreu um erro. Tente novamente."
  return request(path, { cnpj_cpf, senha }, errorMessage)
}

// API GERAR CÓDIGO
export async function gerarCodigoClient(cnpj_cpf: string) {
  console.log(cnpj_cpf);

  const path = "/api/verificacao/enviar"
  const errorMessage = "Não foi possível gerar o código."
  return request(path, { cnpj_cpf, proposito: 'registro' }, errorMessage)
}

// API VALIDAR CÓDIGO
export async function validarCodigoClient(cnpj_cpf: string, codigo: string, proposito: string) {
  const path = "/api/verificacao/confirmar"
  const errorMessage = "Código inválido."
  return request(path, { cnpj_cpf, codigo, proposito }, errorMessage)
}

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
 * const res = await fetch(`/api/processos/${processoId}`);
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
