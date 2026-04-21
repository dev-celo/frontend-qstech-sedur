/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAuthToken, logout } from '../lib/auth';

// ============================================
// CONFIGURAÇÕES
// ============================================
const API_URL = (import.meta.env.VITE_API_URL || 'https://backend-qstech-sedur.onrender.com').replace(/\/$/, '');
const API_URL_LOCAL = (import.meta.env.VITE_API_URL_LOCAL || 'http://localhost:3001').replace(/\/$/, '');
const SESSION_STORAGE_KEY = 'sedur_sessao_info';
const EXTRACTION_ID_KEY = 'extractionId';

console.log('🌐 API Remota (consulta):', API_URL);
console.log('🏠 API Local (extração):', API_URL_LOCAL);

// ============================================
// FUNÇÕES AUXILIARES
// ============================================
const buildUrl = (base: string, path: string) => {
  const normalizedBase = base.replace(/\/$/, '');
  const normalizedPath = path.replace(/^\//, '');
  return `${normalizedBase}/${normalizedPath}`;
};

/**
 * Valida se um extractionId é válido (timestamp razoável)
 */
function isValidExtractionId(id: string): boolean {
  const timestamp = parseInt(id);
  // Timestamp deve ser depois de 2024 (1700000000000) e antes do futuro próximo
  return !isNaN(timestamp) && timestamp > 1700000000000 && timestamp < 2000000000000;
}

// ============================================
// AUTENTICAÇÃO PARA REQUISIÇÕES
// ============================================
async function authFetch(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (response.status === 401) {
    logout();
    throw new Error('Sessão expirada. Faça login novamente.');
  }
  
  return response;
}

// ============================================
// TIPOS/INTERFACES
// ============================================
export interface ExtracaoStatus {
  status: 'processing' | 'completed' | 'failed';
  message?: string;
  data?: any;
  extractionId?: string;
}

export interface SessaoInfo {
  existe: boolean;
  valida: boolean;
  expirada: boolean;
  criado_em?: string;
  expira_em?: string;
}

// ============================================
// API CLIENT PRINCIPAL
// ============================================
class ApiClient {
  private extractionId: string | null = null;
  private sessaoInfo: SessaoInfo | null = null;

  constructor() {
    this.carregarSessaoStorage();
    this.carregarExtractionId();
    this.limparExtractionIdAntigo();
  }

  // ============================================
  // GERENCIAMENTO DE SESSÃO LOCAL
  // ============================================
  private carregarSessaoStorage() {
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        this.sessaoInfo = JSON.parse(stored);
        console.log('📦 Sessão carregada do storage:', this.sessaoInfo);
      }
    } catch (error) {
      console.error('Erro ao carregar sessão do storage:', error);
    }
  }

  private salvarSessaoStorage(info: SessaoInfo) {
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(info));
      this.sessaoInfo = info;
      console.log('💾 Sessão salva no storage:', info);
    } catch (error) {
      console.error('Erro ao salvar sessão no storage:', error);
    }
  }

  private carregarExtractionId() {
    try {
      const savedId = localStorage.getItem(EXTRACTION_ID_KEY);
      if (savedId && isValidExtractionId(savedId)) {
        this.extractionId = savedId;
        console.log('📦 ExtractionId carregado:', this.extractionId);
      } else if (savedId) {
        console.warn('⚠️ ExtractionId inválido removido:', savedId);
        localStorage.removeItem(EXTRACTION_ID_KEY);
      }
    } catch (error) {
      console.error('Erro ao carregar extractionId:', error);
    }
  }

  private limparExtractionIdAntigo() {
    const savedId = localStorage.getItem(EXTRACTION_ID_KEY);
    if (savedId) {
      const timestamp = parseInt(savedId);
      // Remove IDs mais antigos que 1 dia (86400000 ms)
      const umDiaAtras = Date.now() - 86400000;
      if (timestamp < umDiaAtras) {
        console.warn('🧹 ExtractionId muito antigo removido:', savedId);
        localStorage.removeItem(EXTRACTION_ID_KEY);
        this.extractionId = null;
      }
    }
  }

  private salvarExtractionId(id: string) {
    if (isValidExtractionId(id)) {
      this.extractionId = id;
      localStorage.setItem(EXTRACTION_ID_KEY, id);
      console.log('💾 ExtractionId salvo:', id);
    } else {
      console.warn('⚠️ Tentativa de salvar extractionId inválido:', id);
    }
  }

  getSessaoInfo(): SessaoInfo | null {
    return this.sessaoInfo;
  }

  // ============================================
  // AUTENTICAÇÃO GOV.BR (LOCAL)
  // ============================================
  async login(): Promise<{ success: boolean; message: string; session?: any }> {
    const url = buildUrl(API_URL_LOCAL, 'api/login');
    console.log('🔐 Tentando login em:', url);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      console.log('📥 Status da resposta:', response.status);
      const text = await response.text();
      console.log('📥 Resposta bruta:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.log('❌ Resposta não é JSON, retornando texto');
        return text as any;
      }

      if (!response.ok) {
        throw new Error(data.error || `Erro ${response.status}`);
      }

      console.log('✅ Login resposta:', data);

      await this.atualizarStatusSessaoLocal();

      return data;
    } catch (error: any) {
      console.error('❌ Erro no login:', error);
      throw error;
    }
  }

  // ============================================
  // EXTRAÇÃO DE PROCESSOS (LOCAL)
  // ============================================
  async iniciarExtracao(headless = true): Promise<{ extractionId: string }> {
    const url = buildUrl(API_URL_LOCAL, 'api/extrair');
    console.log('🚀 Iniciando extração em:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ headless })
    });

    const data = await response.json();
    if (data.extractionId && isValidExtractionId(data.extractionId)) {
      this.salvarExtractionId(data.extractionId);
    }
    return data;
  }

  async statusExtracao(extractionId?: string): Promise<ExtracaoStatus> {
    const id = extractionId || this.extractionId;
    if (!id) throw new Error('Nenhuma extração em andamento');

    const url = buildUrl(API_URL_LOCAL, `api/extracao/${id}`);
    const response = await fetch(url);
    return response.json();
  }

  async ultimaExtracao() {
    const url = buildUrl(API_URL_LOCAL, 'api/ultima-extracao');
    const response = await fetch(url);
    if (!response.ok) return null;
    return response.json();
  }

  async dadosParciais(extractionId?: string) {
    const id = extractionId || this.extractionId;
    if (!id) return null;

    // 🔥 VALIDAÇÃO DO ID
    if (!isValidExtractionId(id)) {
      console.warn('⚠️ Extraction ID inválido, ignorando:', id);
      this.extractionId = null;
      localStorage.removeItem(EXTRACTION_ID_KEY);
      return null;
    }

    // 🔥 Verifica se o ID é recente (menos de 1 hora)
    const timestamp = parseInt(id);
    const umaHoraAtras = Date.now() - 3600000;
    if (timestamp < umaHoraAtras) {
      console.warn('⚠️ Extraction ID muito antigo, ignorando:', id);
      return null;
    }

    try {
      const url = buildUrl(API_URL_LOCAL, `data/extracao-${id}.json`);
      console.log(`📁 Buscando dados parciais em: ${url}`);
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`⚠️ Arquivo de extração ${id} não encontrado`);
        }
        return null;
      }
      return response.json();
    } catch (error) {
      console.error('Erro ao buscar dados parciais:', error);
      return null;
    }
  }

  // ============================================
  // STATUS DA SESSÃO GOV.BR
  // ============================================
  async atualizarStatusSessaoLocal(): Promise<SessaoInfo> {
    try {
      const url = buildUrl(API_URL_LOCAL, 'api/sessao-status');
      console.log(`📊 Verificando sessão LOCAL em: ${url}`);

      const response = await fetch(url);
      const data = await response.json();

      const info = data.data;
      this.salvarSessaoStorage(info);

      return info;
    } catch (error) {
      console.error('Erro ao atualizar status da sessão local:', error);

      const infoInvalida = {
        existe: false,
        valida: false,
        expirada: true
      };
      this.salvarSessaoStorage(infoInvalida);
      return infoInvalida;
    }
  }

  async sessaoStatus(): Promise<SessaoInfo> {
    if (this.sessaoInfo) {
      console.log('📦 Retornando sessão do cache:', this.sessaoInfo);
      return this.sessaoInfo;
    }

    return this.atualizarStatusSessaoLocal();
  }

  // ============================================
  // UTILITÁRIOS
  // ============================================
  async healthCheck() {
    const url = buildUrl(API_URL_LOCAL, 'api/health');
    const response = await fetch(url);
    return response.json();
  }

  async criarResumo() {
    const url = buildUrl(API_URL_LOCAL, 'api/criar-resumo');
    console.log('📊 Criando resumo em:', url);

    const response = await fetch(url, {
      method: 'POST',
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error('Resposta inválida do servidor');
    }

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao criar resumo');
    }

    return data;
  }

  // ============================================
  // MÉTODOS DE UTILIDADE PÚBLICA
  // ============================================
  
  /**
   * Limpa o extractionId armazenado
   */
  limparExtractionId() {
    this.extractionId = null;
    localStorage.removeItem(EXTRACTION_ID_KEY);
    console.log('🧹 ExtractionId limpo manualmente');
  }

  /**
   * Verifica se há um extractionId válido
   */
  hasValidExtractionId(): boolean {
    return this.extractionId !== null && isValidExtractionId(this.extractionId);
  }

  /**
   * Obtém o extractionId atual
   */
  getExtractionId(): string | null {
    return this.extractionId;
  }
}

// ============================================
// FUNÇÕES EXPORTADAS (API PÚBLICA)
// ============================================

/**
 * Função para extrair processos (mantendo compatibilidade)
 */
export async function extrairProcessos(onProgress?: (step: string) => void): Promise<any> {
  onProgress?.('Iniciando extração...');
  const response = await authFetch('/api/extrair', { method: 'POST' });
  return response.json();
}

/**
 * Instância única do cliente API
 */
export const api = new ApiClient();

/**
 * Função de fetch autenticado
 */
export { authFetch };