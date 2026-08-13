import { useEffect, useRef, useCallback, useState } from "react";

const API_URL = (import.meta.env.VITE_API_URL || 'https://backend-qstech-sedur.onrender.com').replace(/\/$/, '');

interface LoginStatus {
  success: boolean;
  loginAtivo: boolean;
  extracaoExecutando: boolean;
}

interface UseExtracaoWatcherOptions {
  intervaloMs?: number;
  onExtracaoConcluida: () => void;
  onLoginInativo?: () => void;
}

export function useExtracaoWatcher({
  intervaloMs = 5000,
  onExtracaoConcluida,
  onLoginInativo,
}: UseExtracaoWatcherOptions) {
  const [status, setStatus] = useState<LoginStatus | null>(null);

  const extracaoAnteriorRef = useRef<boolean>(false);
  const loginAnteriorRef = useRef<boolean>(true);

  const verificarStatus = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/login/status`);
      const data: LoginStatus = await res.json();
      setStatus(data);

      if (extracaoAnteriorRef.current && !data.extracaoExecutando) {
        console.log("✅ Extração automática concluída (detectado via polling)");
        onExtracaoConcluida();
      }
      extracaoAnteriorRef.current = data.extracaoExecutando;

      if (loginAnteriorRef.current && !data.loginAtivo) {
        console.log("🔴 Login SEDUR ficou inativo (sessão expirada ou cron parado)");
        onLoginInativo?.();
      }
      loginAnteriorRef.current = data.loginAtivo;
    } catch (error) {
      console.error("Erro ao consultar /api/login/status:", error);
    }
  }, [onExtracaoConcluida, onLoginInativo]);

  useEffect(() => {
    verificarStatus();
    const interval = setInterval(verificarStatus, intervaloMs);
    return () => clearInterval(interval);
  }, [verificarStatus, intervaloMs]);

  return status;
}
