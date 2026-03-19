/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Activity, Database, RefreshCw, Server, AlertTriangle, Trash2 } from 'lucide-react';
import { api } from '@/services/api';
import { forceRefreshProcessos, limparCache as limparCacheService } from '@/services/processosService';

interface DiagnosticButtonsProps {
  onRefreshComplete?: () => void;
}

export function DiagnosticButtons({ onRefreshComplete }: DiagnosticButtonsProps) {
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [sessaoInfo, setSessaoInfo] = useState<any>(null);
  const [ultimaExtracao, setUltimaExtracao] = useState<any>(null);
  const [serverStatus, setServerStatus] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);

  useEffect(() => {
    carregarSessaoInicial();
  }, []);

  const carregarSessaoInicial = async () => {
    try {
      const info = await api.sessaoStatus();
      setSessaoInfo(info);
    } catch (error) {
      console.error('Erro ao carregar sessão inicial:', error);
    }
  };

  const checkSessao = async () => {
    setLoading('sessao');
    try {
      const info = await api.atualizarStatusSessaoLocal();
      setSessaoInfo(info);
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
    }
    setLoading(null);
  };

  const checkUltimaExtracao = async () => {
    setLoading('ultima');
    try {
      const data = await api.ultimaExtracao();
      setUltimaExtracao(data);
    } catch (error) {
      console.error('Erro ao buscar última extração:', error);
    }
    setLoading(null);
  };

  const checkServer = async () => {
    setLoading('server');
    try {
      const data = await api.healthCheck();
      setServerStatus(data);
    } catch (error) {
      setServerStatus({ error });
    }
    setLoading(null);
  };

  const handleForceRefresh = async () => {
    setLoading('refresh');
    setRefreshMessage('Forçando atualização dos dados...');
    
    try {
      const processos = await forceRefreshProcessos();
      setRefreshMessage(`✅ Cache atualizado! ${processos.length} processos carregados.`);
      
      if (onRefreshComplete) {
        onRefreshComplete();
      }
      
      setTimeout(() => setRefreshMessage(null), 3000);
    } catch (error) {
      console.error('Erro ao forçar refresh:', error);
      setRefreshMessage('❌ Erro ao atualizar dados');
      setTimeout(() => setRefreshMessage(null), 3000);
    } finally {
      setLoading(null);
    }
  };

  const handleLimparCache = () => {
    limparCacheService();
    setRefreshMessage('🧹 Cache local limpo! Recarregando...');
    
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const verErros = () => {
    const cache = localStorage.getItem('processos_cache_v2');
    if (cache) {
      try {
        const dados = JSON.parse(cache);
        const erros = dados.filter((p: any) => p.erro_captura);
        alert(`📊 Total de processos: ${dados.length}\n❌ Com erros: ${erros.length}`);
      } catch {
        alert('Erro ao ler cache');
      }
    } else {
      alert('Nenhum cache encontrado');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDiagnostic(!showDiagnostic)}
        className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg 
                   hover:bg-gray-200 transition-colors text-sm"
      >
        <Activity className="w-4 h-4" />
        Diagnóstico
        {sessaoInfo?.valida === false && (
          <span className="ml-1 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
            !
          </span>
        )}
      </button>

      {refreshMessage && (
        <div className="absolute top-full mt-2 left-0 w-64 bg-blue-50 p-2 rounded-lg shadow-lg border border-blue-200 z-50 text-sm">
          {refreshMessage}
        </div>
      )}

      {showDiagnostic && (
        <div className="absolute top-full mt-2 right-0 w-96 bg-white p-4 rounded-xl shadow-xl border border-gray-200 z-30 max-h-[80vh] overflow-y-auto">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Server className="w-4 h-4" />
            Diagnóstico da API
          </h3>
          
          <div className="space-y-3">
            {/* Server Status */}
            <button
              onClick={checkServer}
              disabled={loading === 'server'}
              className="w-full flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <span className="text-sm flex items-center gap-2">
                <Server className="w-4 h-4" />
                Status do servidor
              </span>
              {loading === 'server' ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3" />
              )}
            </button>
            
            {serverStatus && (
              <div className="text-xs p-2 bg-blue-50 rounded">
                <p>Status: {serverStatus.status || 'online'}</p>
                <p>Timestamp: {serverStatus.timestamp ? new Date(serverStatus.timestamp).toLocaleString('pt-BR') : 'N/A'}</p>
              </div>
            )}

            {/* Sessão Status */}
            <button
              onClick={checkSessao}
              disabled={loading === 'sessao'}
              className="w-full flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <span className="text-sm flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Status da sessão
              </span>
              {loading === 'sessao' ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3" />
              )}
            </button>
            
            {sessaoInfo && (
              <div className="text-xs p-2 bg-blue-50 rounded space-y-1">
                <p className="flex justify-between">
                  <span>Existe:</span>
                  <span className={sessaoInfo.existe ? 'text-green-600' : 'text-red-600'}>
                    {sessaoInfo.existe ? '✅' : '❌'}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span>Válida:</span>
                  <span className={sessaoInfo.valida ? 'text-green-600' : 'text-red-600'}>
                    {sessaoInfo.valida ? '✅' : '❌'}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span>Expirada:</span>
                  <span className={sessaoInfo.expirada ? 'text-red-600' : 'text-green-600'}>
                    {sessaoInfo.expirada ? '✅' : '❌'}
                  </span>
                </p>
                {sessaoInfo.expira_em && (
                  <p className="text-xs text-gray-500 mt-1">
                    Expira em: {new Date(sessaoInfo.expira_em).toLocaleString('pt-BR')}
                  </p>
                )}
              </div>
            )}

            {/* Última extração */}
            <button
              onClick={checkUltimaExtracao}
              disabled={loading === 'ultima'}
              className="w-full flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <span className="text-sm flex items-center gap-2">
                <Database className="w-4 h-4" />
                Última extração
              </span>
              {loading === 'ultima' ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3" />
              )}
            </button>

            {ultimaExtracao?.data && (
              <div className="text-xs p-2 bg-green-50 rounded">
                <p><strong>Total:</strong> {ultimaExtracao.data.total || ultimaExtracao.data.resumo?.total} processos</p>
                <p><strong>Andamento:</strong> {ultimaExtracao.data.resumo?.andamento}</p>
                <p><strong>Convite:</strong> {ultimaExtracao.data.resumo?.convite}</p>
                <p><strong>Finalizado:</strong> {ultimaExtracao.data.resumo?.finalizado}</p>
                <p className="text-gray-500 mt-1">
                  {new Date(ultimaExtracao.data.atualizado_em).toLocaleString('pt-BR')}
                </p>
              </div>
            )}

            {/* Ações de cache e dados */}
            <div className="border-t pt-2 mt-2 space-y-2">
              <button
                onClick={handleForceRefresh}
                disabled={loading === 'refresh'}
                className="w-full text-left p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm flex items-center gap-2"
              >
                {loading === 'refresh' ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Forçar atualização dos dados
              </button>

              <button
                onClick={handleLimparCache}
                className="w-full text-left p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 text-sm flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Limpar cache e recarregar
              </button>
              
              <button
                onClick={verErros}
                className="w-full text-left p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                Ver processos com erro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}