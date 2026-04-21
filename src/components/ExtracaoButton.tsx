/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { 
  Download, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  RefreshCw,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { api } from '@/services/api';

interface ExtracaoButtonProps {
  onExtracaoComplete?: (data: any, extractionId: string) => void;
}

export function ExtracaoButton({ onExtracaoComplete }: ExtracaoButtonProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed' | 'failed' | 'cancelled'>('idle');
  const [message, setMessage] = useState('');
  const [extractionId, setExtractionId] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  // ✅ Verificar se há extração em andamento ao montar o componente
  useEffect(() => {
    const checkActiveExtraction = async () => {
      const savedId = localStorage.getItem('extractionId');
      if (savedId) {
        try {
          const statusResult = await api.statusExtracao(savedId);
          if (statusResult.status === 'processing') {
            setExtractionId(savedId);
            setStatus('processing');
            setMessage('Extraindo dados do SEDUR...');
          } else if (statusResult.status === 'completed') {
            setStatus('completed');
            setMessage('Extração concluída!');
            if (onExtracaoComplete) {
              const dados = await api.ultimaExtracao();
              if (dados?.data) onExtracaoComplete(dados.data, savedId);
            }
          } else if (statusResult.status === 'failed') {
            setStatus('failed');
            setMessage('Erro na extração');
          }
        } catch (error) {
          console.error('Erro ao verificar extração ativa:', error);
        }
      }
    };
    
    checkActiveExtraction();
  }, [onExtracaoComplete]);

  // ✅ Polling apenas para verificar conclusão (sem dados parciais)
  useEffect(() => {
    if (status !== 'processing' || !extractionId) return;

    let isMounted = true;
    let pollingTimer: ReturnType<typeof setTimeout>;

    const checkStatus = async () => {
      try {
        const result = await api.statusExtracao(extractionId);
        
        if (!isMounted) return;

        if (result.status === 'completed') {
          setStatus('completed');
          setMessage('Extração concluída com sucesso!');
          
          const dados = await api.ultimaExtracao();
          if (dados?.data && onExtracaoComplete) {
            onExtracaoComplete(dados.data, extractionId);
          }
          // Limpa o extractionId após 5 segundos
          setTimeout(() => {
            api.limparExtractionId?.();
          }, 5000);
          return;
        }
        
        if (result.status === 'failed') {
          setStatus('failed');
          setMessage(result.message || 'Erro na extração');
          return;
        }
      } catch (error) {
        console.error('Erro ao verificar status:', error);
      }
    };

    checkStatus();
    // eslint-disable-next-line prefer-const
    pollingTimer = setInterval(checkStatus, 5000);

    return () => {
      isMounted = false;
      if (pollingTimer) clearInterval(pollingTimer);
    };
  }, [status, extractionId, onExtracaoComplete]);

  const handleExtracao = async () => {
    // Se já há extração em andamento, apenas expande o modal
    if (status === 'processing') {
      setIsMinimized(false);
      return;
    }

    setLoading(true);
    setStatus('processing');
    setMessage('Iniciando extração...');
    setIsMinimized(false);
    
    try {
      const response = await api.iniciarExtracao(true);
      setExtractionId(response.extractionId);
      setMessage('Extraindo dados do SEDUR...');
    } catch (err: any) {
      setStatus('failed');
      setMessage(err.message || 'Erro ao iniciar extração');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelExtracao = () => {
    if (window.confirm('Deseja realmente cancelar a extração em andamento?')) {
      setStatus('cancelled');
      setMessage('Extração cancelada pelo usuário');
      api.limparExtractionId?.();
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Determina o texto e ícone do botão principal
  const hasActiveExtraction = status === 'processing';
  const buttonText = hasActiveExtraction ? 'Ver extração' : 
                     status === 'completed' ? 'Extraído!' : 
                     status === 'failed' ? 'Erro' :
                     status === 'cancelled' ? 'Cancelado' :
                     'Extrair dados';

  const buttonIcon = hasActiveExtraction ? (
    <RefreshCw className="w-4 h-4 animate-spin" />
  ) : status === 'completed' ? (
    <CheckCircle className="w-4 h-4" />
  ) : status === 'failed' || status === 'cancelled' ? (
    <AlertCircle className="w-4 h-4" />
  ) : (
    <Download className="w-4 h-4" />
  );

  const buttonColor = hasActiveExtraction
    ? 'bg-blue-600 hover:bg-blue-700'
    : status === 'completed'
    ? 'bg-green-600 hover:bg-green-700'
    : status === 'failed' || status === 'cancelled'
    ? 'bg-red-600 hover:bg-red-700'
    : 'bg-green-600 hover:bg-green-700';

  return (
    <div className="relative">
      {/* Botão principal */}
      <button
        onClick={handleExtracao}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${buttonColor} text-white disabled:opacity-50`}
      >
        {buttonIcon}
        <span>{buttonText}</span>
      </button>

      {/* Modal de status (apenas quando não está minimizado) */}
      {(status === 'processing' || status === 'completed' || status === 'failed' || status === 'cancelled') && !isMinimized && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-white rounded-xl shadow-2xl border overflow-hidden z-50">
          {/* Cabeçalho */}
          <div className={`px-4 py-3 flex items-center justify-between ${
            status === 'processing' ? 'bg-blue-50 border-b border-blue-100' :
            status === 'completed' ? 'bg-green-50 border-b border-green-100' :
            'bg-red-50 border-b border-red-100'
          }`}>
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${
                status === 'processing' ? 'bg-blue-100' :
                status === 'completed' ? 'bg-green-100' :
                'bg-red-100'
              }`}>
                {status === 'processing' ? (
                  <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                ) : status === 'completed' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
              </div>
              <span className={`font-medium text-sm ${
                status === 'processing' ? 'text-blue-800' :
                status === 'completed' ? 'text-green-800' :
                'text-red-800'
              }`}>
                {status === 'processing' ? 'Extraindo dados' :
                 status === 'completed' ? 'Extração concluída' :
                 status === 'cancelled' ? 'Extração cancelada' :
                 'Erro na extração'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {/* Botão minimizar */}
              <button
                onClick={toggleMinimize}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                title="Minimizar"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              {/* Botão cancelar (apenas em processamento) */}
              {status === 'processing' && (
                <button
                  onClick={handleCancelExtracao}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                  title="Cancelar extração"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Corpo */}
          <div className="px-4 py-3">
            <p className="text-sm text-gray-600">{message}</p>
            {extractionId && status === 'processing' && (
              <p className="text-xs text-gray-400 mt-2 font-mono">
                ID: {extractionId.slice(0, 8)}...{extractionId.slice(-4)}
              </p>
            )}
            {status === 'completed' && (
              <button
                onClick={() => {
                  setStatus('idle');
                  setExtractionId(null);
                  setIsMinimized(false);
                }}
                className="mt-3 text-xs text-green-600 hover:text-green-700 font-medium"
              >
                Fechar
              </button>
            )}
            {(status === 'failed' || status === 'cancelled') && (
              <button
                onClick={() => {
                  setStatus('idle');
                  setExtractionId(null);
                  setIsMinimized(false);
                }}
                className="mt-3 text-xs text-red-600 hover:text-red-700 font-medium"
              >
                Tentar novamente
              </button>
            )}
          </div>
        </div>
      )}

      {/* Indicador minimizado (apenas quando está minimizado e em processamento) */}
      {status === 'processing' && isMinimized && (
        <div 
          onClick={toggleMinimize}
          className="absolute top-full mt-2 right-0 cursor-pointer bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-all z-50 flex items-center gap-2"
          title="Expandir extração"
        >
          <RefreshCw className="w-3 h-3 animate-spin" />
          <span className="text-xs font-medium">Extraindo...</span>
          <Maximize2 className="w-3 h-3" />
        </div>
      )}
    </div>
  );
}