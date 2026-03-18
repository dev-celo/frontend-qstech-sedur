/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { LogIn, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '@/services/api';

interface LoginButtonProps {
  onLoginSuccess?: () => void;
}

export function LoginButton({ onLoginSuccess }: LoginButtonProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setStatus('processing');
    setMessage('Abrindo navegador para login...');
    
    const loginWindow = window.open('', '_blank', 'width=500,height=400');
    
    if (loginWindow) {
      loginWindow.document.write(`
        <html>
          <head>
            <title>Login SEDUR - Gov.br</title>
            <style>
              body { font-family: Arial; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; margin: 0; padding: 40px; text-align: center; }
              .spinner { width: 50px; height: 50px; border: 4px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: white; animation: spin 1s ease-in-out infinite; margin: 20px auto; }
              @keyframes spin { to { transform: rotate(360deg); } }
            </style>
          </head>
          <body>
            <h1>🔐 Login Gov.br</h1>
            <div class="spinner"></div>
            <p>Aguardando autenticação...</p>
            <p style="font-size: 12px; margin-top: 30px;">⏳ Esta janela fechará automaticamente</p>
          </body>
        </html>
      `);
    }
    
    try {
      const result = await api.login();
      
      if (result.success) {
        setStatus('success');
        setMessage('Login realizado com sucesso!');
        
        if (loginWindow) {
          loginWindow.document.write(`
            <html>
              <head><title>Sucesso!</title></head>
              <body style="background: #10b981; color: white; text-align: center; padding: 40px;">
                <h1>✅ Login realizado!</h1>
                <p>Você já pode fechar esta janela.</p>
                <script>setTimeout(() => window.close(), 3000);</script>
              </body>
            </html>
          `);
        }
        
        onLoginSuccess?.();
        
        // Limpa a mensagem após 5 segundos
        setTimeout(() => {
          setStatus('idle');
        }, 5000);
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Erro no login');
      
      if (loginWindow) {
        loginWindow.document.write(`
          <html>
            <head><title>Erro</title></head>
            <body style="background: #ef4444; color: white; text-align: center; padding: 40px;">
              <h1>❌ Erro no login</h1>
              <p>${err.message}</p>
              <button onclick="window.close()">Fechar</button>
            </body>
          </html>
        `);
      }
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
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
        <span>{loading ? 'Aguardando...' : 'Login Gov.br'}</span>
      </button>
      
      {status === 'processing' && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-blue-50 p-3 rounded-lg shadow-lg border border-blue-200 z-50">
          <p className="text-sm text-blue-700">{message}</p>
        </div>
      )}
      
      {status === 'success' && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-green-50 p-3 rounded-lg shadow-lg border border-green-200 z-50">
          <p className="text-sm text-green-700 flex items-center gap-1">
            <CheckCircle className="w-4 h-4" /> {message}
          </p>
        </div>
      )}
      
      {status === 'error' && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-red-50 p-3 rounded-lg shadow-lg border border-red-200 z-50">
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" /> {message}
          </p>
        </div>
      )}
    </div>
  );
}