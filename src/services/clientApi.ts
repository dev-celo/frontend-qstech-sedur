import type {
  clientPayload,
  LoginResponse,

  gerarCodigoPayload,
  validarCodigoPayload,
  redefinirSenhaPayload,
} from "../types/clientTypes.ts";

const API_URL = import.meta.env.VITE_API_CLIENT_URL;

// ERROR HANDLER
export class requestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// TOKEN 
const TOKEN_KEY = "client_token";
const EVENTO_TOKEN = "auth-token-changed";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event(EVENTO_TOKEN));
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event(EVENTO_TOKEN));
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ROTA POST
async function post(
  path: string,
  body: clientPayload | gerarCodigoPayload | validarCodigoPayload,
  errorMessage: string
) {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
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
  const data = await post(path, { cnpj_cpf, senha }, errorMessage)
  if (data?.token) setToken(data.token);
  return data
}

// API REGISTRO
export async function registroClient(cnpj_cpf: string, senha: string) {
  const path = "/api/cliente/registrar"
  const errorMessage = "Ocorreu um erro. Tente novamente."
  return post(path, { cnpj_cpf, senha }, errorMessage)
}

// API GERAR CÓDIGO
export async function gerarCodigoClient(cnpj_cpf: string, proposito: string) {
  const path = "/api/verificacao/enviar"
  const errorMessage = "Não foi possível gerar o código."
  return post(path, { cnpj_cpf, proposito }, errorMessage)
}

// API VALIDAR CÓDIGO
export async function validarCodigoClient(cnpj_cpf: string, codigo: string, proposito: string) {
  const path = "/api/verificacao/confirmar"
  const errorMessage = "Código inválido."
  return post(path, { cnpj_cpf, codigo, proposito }, errorMessage)
}

// ROTA GET
async function get(path: string, errorMessage: string) {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    credentials: 'include',
  })
  const data = await response.json().catch(() => null)
  if (!response.ok) throw new requestError(data?.message || errorMessage, response.status);
  return data
}

// API CLIENTE (PERFIL)
export async function fetchMeClient() {
  return get('/api/cliente/me', 'Não foi possível carregar os dados do cliente.')
}

// API PROCESSOS
export async function fetchProcessosClient() {
  return get('/api/cliente/processos', 'Não foi possível carregar os processos.')
}

// API PROCESSOS ID
export async function fetchProcessoClient(id: string) {
  return get(`/api/cliente/processo/${id}`, 'Não foi possível carregar o processo.')
}

// API PROCESSOS ID TRAMITAÇÕES
export async function fetchTramitacoesClient(id: string) {
  return get(`/api/cliente/processo/${id}/tramitacoes`, 'Não foi possível carregar as tramitações.')
}

// ROTA PATCH
async function patch(
  path: string,
  body: clientPayload | gerarCodigoPayload | validarCodigoPayload | redefinirSenhaPayload,
  errorMessage: string
) {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    credentials: 'include',
    body: JSON.stringify(body)
  })
  const data = await response.json().catch(() => null)
  if (!response.ok) throw new requestError(data?.message || errorMessage, response.status);
  return data
}

// API REDEFINIR SENHA
export async function redefinirSenhaClient(cnpj_cpf: string, novaSenha: string): Promise<{ message: string }> {
  const path = '/api/cliente/redefinir-senha'
  const errorMessage = "Não foi possível redefinir a senha"
  const data = await patch(path, { cnpj_cpf, novaSenha }, errorMessage)
  return data
}
