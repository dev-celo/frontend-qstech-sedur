/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { 
  Download, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Clock,
  FileText,
  Hash,
  RefreshCw
} from 'lucide-react';
import { api } from '@/services/api';

interface ExtracaoButtonProps {
  onExtracaoComplete?: (data: any, extractionId: string) => void;
}

export function ExtracaoButton({ onExtracaoComplete }: ExtracaoButtonProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed' | 'failed' | 'cancelled'>('idle');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [extractionId, setExtractionId] = useState<string | null>(null);
  const [andamentoCount, setAndamentoCount] = useState(0);
  const [conviteCount, setConviteCount] = useState(0);
  const [finalizadoCount, setFinalizadoCount] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [eta, setEta] = useState<string>('calculando...');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // 🔥 REMOVIDO: currentAba e showDetails (não estão sendo usados no JSX)

  // ✅ Timer para tempo decorrido
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    
    if (status === 'processing' && startTime) {
      timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setElapsedTime(elapsed);
        
        if (progress > 0) {
          const totalEstimated = (elapsed / progress) * 100;
          const remaining = totalEstimated - elapsed;
          const remainingMinutes = Math.floor(remaining / 60);
          const remainingSeconds = Math.floor(remaining % 60);
          setEta(`${remainingMinutes}m ${remainingSeconds}s`);
        }
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [status, startTime, progress]);

  // ✅ Polling para verificar progresso
  useEffect(() => {
    if (status !== 'processing' || !extractionId) return;

    let isMounted = true;
    let pollingTimer: ReturnType<typeof setTimeout>;

    const checkProgress = async () => {
      try {
        const result = await api.statusExtracao(extractionId);
        
        if (!isMounted) return;

        if (result.status === 'completed') {
          setStatus('completed');
          setProgress(100);
          setMessage('Extração concluída com sucesso!');
          
          const dados = await api.ultimaExtracao();
          if (dados?.data && onExtracaoComplete) {
            onExtracaoComplete(dados.data, extractionId);
          }
          return;
        }
        
        if (result.status === 'failed') {
          setStatus('failed');
          setMessage(result.message || 'Erro na extração');
          return;
        }

        // 🔥 Agora o método dadosParciais existe no api!
        const parciais = await api.dadosParciais(extractionId).catch(() => null);
        if (parciais?.resumo && isMounted) {
          const andamento = parciais.resumo.andamento || 0;
          const convite = parciais.resumo.convite || 0;
          const finalizado = parciais.resumo.finalizado || 0;
          
          setAndamentoCount(andamento);
          setConviteCount(convite);
          setFinalizadoCount(finalizado);
          
          // 🔥 Atualiza aba atual baseada nos dados (usado internamente)
          // if (finalizado > 0 && convite > 0 && andamento > 0) {
          //   setCurrentAba('finalizados');
          // } else if (convite > 0 && andamento > 0) {
          //   setCurrentAba('convite');
          // } else if (andamento > 0) {
          //   setCurrentAba('andamento');
          // }
        }

        const totalAtual = andamentoCount + conviteCount + finalizadoCount;
        const progresso = Math.min(Math.floor((totalAtual / 600) * 100), 95);
        if (isMounted) setProgress(progresso);
        
        if (totalAtual > 0) {
          setCurrentPage(Math.floor(totalAtual / 50) + 1);
          setTotalPages(Math.ceil(600 / 50));
        }
        
      } catch (error) {
        console.error('Erro ao verificar progresso:', error);
      }
    };

    checkProgress();
    // eslint-disable-next-line prefer-const
    pollingTimer = setInterval(checkProgress, 3000);

    return () => {
      isMounted = false;
      if (pollingTimer) clearInterval(pollingTimer);
    };
  }, [status, extractionId, andamentoCount, conviteCount, finalizadoCount, onExtracaoComplete]);

  const handleExtracao = async () => {
    setLoading(true);
    setStatus('processing');
    setProgress(0);
    setMessage('Iniciando extração...');
    setAndamentoCount(0);
    setConviteCount(0);
    setFinalizadoCount(0);
    setStartTime(Date.now());
    setElapsedTime(0);
    setEta('calculando...');
    setCurrentPage(1);
    setTotalPages(1);
    
    try {
      const response = await api.iniciarExtracao(true);
      setExtractionId(response.extractionId);
    } catch (err: any) {
      setStatus('failed');
      setMessage(err.message || 'Erro ao iniciar extração');
      setStartTime(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelExtracao = () => {
    if (window.confirm('Deseja realmente cancelar a extração em andamento?')) {
      setStatus('cancelled');
      setMessage('Extração cancelada pelo usuário');
      setStartTime(null);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative">
      <button
        onClick={handleExtracao}
        disabled={loading || status === 'processing'}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          status === 'processing' 
            ? 'bg-blue-600 hover:bg-blue-700' 
            : status === 'completed'
            ? 'bg-green-600 hover:bg-green-700'
            : status === 'failed' || status === 'cancelled'
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-green-600 hover:bg-green-700'
        } text-white disabled:opacity-50`}
      >
        {status === 'processing' ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : status === 'completed' ? (
          <CheckCircle className="w-4 h-4" />
        ) : status === 'failed' || status === 'cancelled' ? (
          <AlertCircle className="w-4 h-4" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        <span>
          {status === 'processing' ? 'Extraindo...' : 
           status === 'completed' ? 'Extraído!' : 
           status === 'failed' ? 'Erro' :
           status === 'cancelled' ? 'Cancelado' :
           'Extrair dados'}
        </span>
      </button>

      {/* Modal de progresso */}
      {status === 'processing' && (
        <div className="absolute top-full mt-2 right-0 w-[480px] bg-white p-5 rounded-xl shadow-2xl border border-blue-100 z-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Extraindo dados do SEDUR</h3>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  ID: {extractionId?.slice(0, 8)}...{extractionId?.slice(-4)}
                </p>
              </div>
            </div>
            <button
              onClick={handleCancelExtracao}
              className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
              title="Cancelar extração"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progresso geral</span>
              <span className="font-semibold text-blue-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-gray-50 p-2 rounded-lg text-center">
              <p className="text-xs text-gray-500">Tempo decorrido</p>
              <p className="text-sm font-mono font-semibold text-gray-700">
                {formatTime(elapsedTime)}
              </p>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg text-center">
              <p className="text-xs text-gray-500">Tempo restante</p>
              <p className="text-sm font-mono font-semibold text-gray-700">
                {eta}
              </p>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg text-center">
              <p className="text-xs text-gray-500">Página</p>
              <p className="text-sm font-mono font-semibold text-gray-700">
                {currentPage}/{totalPages}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-600 mb-1 flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Andamento
              </p>
              <p className="text-2xl font-bold text-blue-700">{andamentoCount}</p>
            </div>
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
              <p className="text-xs text-amber-600 mb-1 flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Convite
              </p>
              <p className="text-2xl font-bold text-amber-700">{conviteCount}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg border border-green-100">
              <p className="text-xs text-green-600 mb-1 flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Finalizados
              </p>
              <p className="text-2xl font-bold text-green-700">{finalizadoCount}</p>
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
            <Clock className="w-3 h-3" />
            {message}
          </p>
        </div>
      )}

      {status === 'completed' && (
        <div className="absolute top-full mt-2 right-0 w-96 bg-green-50 p-4 rounded-lg shadow-lg border border-green-200 z-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-800">Extração concluída!</p>
              <p className="text-sm text-green-600">
                {andamentoCount + conviteCount + finalizadoCount} processos capturados
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ID: {extractionId?.slice(0, 8)}...{extractionId?.slice(-4)}
              </p>
            </div>
          </div>
        </div>
      )}

      {(status === 'failed' || status === 'cancelled') && (
        <div className="absolute top-full mt-2 right-0 w-96 bg-red-50 p-4 rounded-lg shadow-lg border border-red-200 z-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="font-medium text-red-800">
                {status === 'cancelled' ? 'Extração cancelada' : 'Erro na extração'}
              </p>
              <p className="text-sm text-red-600">{message}</p>
              {extractionId && (
                <p className="text-xs text-gray-500 mt-1">
                  ID: {extractionId.slice(0, 8)}...{extractionId.slice(-4)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}