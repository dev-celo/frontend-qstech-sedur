/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
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
  setLoading(true);
  setStatus('processing');
  setMessage('Iniciando login...');
  
  // Abre janela de instruções (opcional)
  const loginWindow = window.open('', '_blank', 'width=500,height=400');
  
  try {
    console.log('📤 Chamando api.login()...');
    const result = await api.login();
    console.log('📥 Resultado:', result);
    
    if (result.success) {
      setStatus('success');
      setMessage('Login realizado!');
      
      if (loginWindow) {
        loginWindow.close();
      }
      
      onLoginSuccess?.();
      await verificarSessao();
    }
  } catch (err: any) {
    console.error('❌ Erro:', err);
    setStatus('error');
    setMessage(err.message);
  } finally {
    setLoading(false);
  }
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
      
      {/* Mensagens flutuantes - somem após 3s */}
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