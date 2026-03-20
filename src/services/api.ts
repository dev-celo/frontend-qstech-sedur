/* eslint-disable @typescript-eslint/no-explicit-any */
const API_URL = (import.meta.env.VITE_API_URL || 'https://backend-qstech-sedur.onrender.com').replace(/\/$/, '');
const API_URL_LOCAL = (import.meta.env.VITE_API_URL_LOCAL || 'http://localhost:3001').replace(/\/$/, '');

console.log('🌐 API Remota (consulta):', API_URL);
console.log('🏠 API Local (extração):', API_URL_LOCAL);

const SESSION_STORAGE_KEY = 'sedur_sessao_info';

const buildUrl = (base: string, path: string) => {
  const normalizedBase = base.replace(/\/$/, '');
  const normalizedPath = path.replace(/^\//, '');
  return `${normalizedBase}/${normalizedPath}`;
};

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

class ApiClient {
  private extractionId: string | null = null;
  private sessaoInfo: SessaoInfo | null = null;

  
  constructor() {
    this.carregarSessaoStorage();
  }

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

  getSessaoInfo(): SessaoInfo | null {
    return this.sessaoInfo;
  }

  // 🔥 LOGIN - sempre local
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

      // Após login, atualiza status LOCAL
      await this.atualizarStatusSessaoLocal();

      return data;

    } catch (error: any) {
      console.error('❌ Erro no login:', error);
      throw error;
    }
  }

  // 🔥 EXTRAÇÃO - sempre local
  async iniciarExtracao(headless = true): Promise<{ extractionId: string }> {
    const url = buildUrl(API_URL_LOCAL, 'api/extrair');
    console.log('🚀 Iniciando extração em:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ headless })
    });

    const data = await response.json();
    this.extractionId = data.extractionId;
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

    try {
      const url = buildUrl(API_URL_LOCAL, `data/extracao-${id}.json`);
      const response = await fetch(url);
      if (!response.ok) return null;
      return response.json();
    } catch {
      return null;
    }
  }

  // 🔥 CONSULTA DE SESSÃO - usa REMOTO para verificar status (opcional)
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

  // 🔥 HEALTH CHECK - sempre local
  async healthCheck() {
    const url = buildUrl(API_URL_LOCAL, 'api/health');
    const response = await fetch(url);
    return response.json();
  }
}

export const api = new ApiClient();