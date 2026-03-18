// services/firestoreService.ts

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface FirestoreResult {
  sucesso: boolean;
  stats?: {
    total: number;
    com_detalhes: number;
    sem_detalhes: number;
    total_tramitacoes: number;
  };
  tempo?: number;
  error?: string;
}

class FirestoreService {
  async salvarExtracao(extractionId: string): Promise<FirestoreResult> {
    const response = await fetch(`${API_URL}/api/salvar-firestore`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ extractionId })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Erro ao salvar no Firestore');
    }
    
    return {
      sucesso: true,
      stats: data.stats,
      tempo: data.tempo
    };
  }

  async salvarUltimaExtracao(): Promise<FirestoreResult> {
    const response = await fetch(`${API_URL}/api/salvar-ultima-extracao`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Erro ao salvar última extração');
    }
    
    return {
      sucesso: true,
      stats: data.stats
    };
  }
}

export const firestoreService = new FirestoreService();