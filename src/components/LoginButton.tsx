/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react';
import { LogIn, Loader2, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { api } from '@/services/api';

interface LoginButtonProps {
  onLoginSuccess?: () => void;
}

export function LoginButton({ onLoginSuccess }: LoginButtonProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error' | 'info'>('idle');
  const [message, setMessage] = useState('');
  const [sessaoInfo, setSessaoInfo] = useState<any>(null);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Garante que nenhum polling continua rodando se o componente desmontar
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  // Auto-limpar mensagens após 3 segundos
  useEffect(() => {
    if (status !== 'idle' && status !== 'processing') {
      const timer = setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Verificar status da sessão ao montar
  useEffect(() => {
    verificarSessao();
  }, []);

  const verificarSessao = async () => {
    try {
      const info = await api.sessaoStatus();
      setSessaoInfo(info);

      if (info.valida) {
        setStatus('success');
        setMessage('✅ Sessão válida');
      } else if (info.existe && info.expirada) {
        setStatus('info');
        setMessage('⚠️ Sessão expirada. Faça login novamente.');
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
    }
  };

  const handleLogin = async () => {
    // Cancela qualquer polling anterior antes de iniciar um novo
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }

    setLoading(true);
    setStatus('processing');
    setMessage('Iniciando login...');

    const API_URL_LOGIN = import.meta.env.VITE_API_URL_LOGIN?.replace(/\/$/, '');
    const VITE_API_URL_LOGIN_TESTE = import.meta.env.VITE_API_URL_LOGIN_TESTE?.replace(/\/$/, '');
    const loginWindow = window.open('', '_blank', 'width=500,height=800');

    try {
      console.log('📤 Chamando api.login()...');
      const result = await api.login();
      console.log('📥 Resultado:', result);

      if (result.success && result.vncToken) {
        setStatus('processing');
        setMessage('Complete o login na janela que abriu...');

        let loginUrl = API_URL_LOGIN;

        if (API_URL_LOGIN) {
          console.log('🔍 Verificando servidor principal...');
          const health = await api.healthCheck();

          if (health) {
            console.log('✅ Servidor principal está online.')
          } else {
            console.warn('⚠️ Servidor principal indisponível. Usando servidor de teste.');
            loginUrl = VITE_API_URL_LOGIN_TESTE;
          }
        }

        if (!loginUrl) throw new Error('Nenhuma URL de servidor foi configurada.');
        if (loginWindow) { loginWindow.location.href = `${loginUrl}/vnc-assets/vnc.html?autoconnect=true&quality=2&compression=9&path=/vnc-ws?token=${result.vncToken}`; }

        aguardarLoginConcluir(loginWindow);
      } else { throw new Error(result.error || 'Login não retornou token'); }

    } catch (err: any) {
      console.error('❌ Erro:', err);
      setStatus('error');
      setMessage(err.message);
      loginWindow?.close();
    } finally {
      setLoading(false);
    }
  };

  const aguardarLoginConcluir = (loginWindow: Window | null) => {
    const INTERVALO_MS = 4000;
    const TIMEOUT_MS = 10 * 60 * 1000;
    const inicio = Date.now();
    const inicioLoginTimestamp = inicio;

    const pararPolling = () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };

    pollingRef.current = setInterval(async () => {
      if (Date.now() - inicio > TIMEOUT_MS) {
        pararPolling();
        setStatus('error');
        setMessage('Tempo esgotado aguardando o login.');
        return;
      }

      try {
        const info = await api.atualizarStatusSessaoLocal();
        setSessaoInfo(info);

        const atualizadaAgora = info.atualizado_em
          ? new Date(info.atualizado_em).getTime() > inicioLoginTimestamp
          : false;

        if (info.valida && atualizadaAgora) {
          pararPolling();
          setStatus('success');
          setMessage('✅ Login concluído! A extração rodará automaticamente em até 20min.');
          loginWindow?.close();
          onLoginSuccess?.();
        }
      } catch (err) {
        console.error('Erro no polling de sessão:', err);
      }
    }, INTERVALO_MS);
  };

  return (
    <div className="relative">
      <button
        onClick={handleLogin}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg 
                   hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : sessaoInfo?.valida ? (
          <CheckCircle className="w-4 h-4" />
        ) : (
          <LogIn className="w-4 h-4" />
        )}
        <span>
          {loading ? 'Aguardando...' :
            sessaoInfo?.valida ? 'Sessão Ativa' :
              'Login Gov.br'}
        </span>
      </button>

      {status === 'processing' && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-blue-50 p-3 rounded-lg shadow-lg border border-blue-200 z-50 animate-fade-in">
          <p className="text-sm text-blue-700 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            {message}
          </p>
        </div>
      )}

      {status === 'success' && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-green-50 p-3 rounded-lg shadow-lg border border-green-200 z-50 animate-fade-in">
          <p className="text-sm text-green-700 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {message}
          </p>
        </div>
      )}

      {status === 'error' && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-red-50 p-3 rounded-lg shadow-lg border border-red-200 z-50 animate-fade-in">
          <p className="text-sm text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {message}
          </p>
        </div>
      )}

      {status === 'info' && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-yellow-50 p-3 rounded-lg shadow-lg border border-yellow-200 z-50 animate-fade-in">
          <p className="text-sm text-yellow-700 flex items-center gap-2">
            <Info className="w-4 h-4" />
            {message}
          </p>
        </div>
      )}
    </div>
  );
}
