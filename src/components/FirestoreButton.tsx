/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Database, Loader2, CheckCircle } from 'lucide-react';
import { firestoreService } from '@/services/firestoreService';

interface FirestoreButtonProps {
  extractionId: string;
  onSuccess?: () => void;
}

export function FirestoreButton({ extractionId, onSuccess }: FirestoreButtonProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSalvar = async () => {
    setLoading(true);
    setStatus('saving');
    setMessage('Salvando...');
    
    try {
      await firestoreService.salvarExtracao(extractionId);
      setStatus('success');
      setMessage('Salvo com sucesso!');
      onSuccess?.();
      
      setTimeout(() => setStatus('idle'), 3000);
      
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message);
      setTimeout(() => setStatus('idle'), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleSalvar}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg 
                   hover:bg-purple-700 transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 
         status === 'success' ? <CheckCircle className="w-4 h-4" /> : 
         <Database className="w-4 h-4" />}
        <span>Salvar no Firestore</span>
      </button>

      {(status === 'saving' || status === 'success' || status === 'error') && (
        <div className={`absolute top-full mt-2 right-0 w-64 p-2 rounded-lg shadow-lg z-50 ${
          status === 'saving' ? 'bg-blue-50' :
          status === 'success' ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <p className={`text-sm ${
            status === 'saving' ? 'text-blue-600' :
            status === 'success' ? 'text-green-600' : 'text-red-600'
          }`}>{message}</p>
        </div>
      )}
    </div>
  );
}