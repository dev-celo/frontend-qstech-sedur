/* eslint-disable @typescript-eslint/no-explicit-any */
const API_URL = 'http://localhost:3001';

export interface ExtracaoStatus {
  status: 'processing' | 'completed' | 'failed';
  message?: string;
  data?: any;
  extractionId?: string;
}

class ApiClient {
  private extractionId: string | null = null;
  private pollingInterval: ReturnType<typeof setTimeout> | null = null;

  async login(): Promise<{ success: boolean; message: string }> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro no login');
      }
      
      return response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Tempo limite excedido. O login pode estar demorando muito.');
      }
      throw error;
    }
  }

  async sessaoStatus(): Promise<{
    existe: boolean;
    valida: boolean;
    expirada: boolean;
  }> {
    const response = await fetch(`${API_URL}/api/sessao-status`);
    const data = await response.json();
    return data.data;
  }

  async iniciarExtracao(headless = true): Promise<{ extractionId: string }> {
    const response = await fetch(`${API_URL}/api/extrair`, {
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
    
    const response = await fetch(`${API_URL}/api/extracao/${id}`);
    return response.json();
  }

  async ultimaExtracao() {
    const response = await fetch(`${API_URL}/api/ultima-extracao`);
    if (!response.ok) return null;
    return response.json();
  }

  async dadosParciais(extractionId?: string) {
    const id = extractionId || this.extractionId;
    if (!id) return null;
    
    try {
      const response = await fetch(`${API_URL}/data/extracao-${id}.json`);
      if (!response.ok) return null;
      return response.json();
    } catch {
      return null;
    }
  }

  async healthCheck() {
    const response = await fetch(`${API_URL}/api/health`);
    return response.json();
  }

  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }
}

export const api = new ApiClient();