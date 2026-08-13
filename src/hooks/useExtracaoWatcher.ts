import { useEffect, useRef, useCallback, useState } from "react";

const API_URL = (
  import.meta.env.VITE_API_URL || 'https://backend-qstech-sedur.onrender.com'
).replace(/\/$/, '');

if (!API_URL) {
  console.warn(
    "⚠️ [useExtracaoWatcher] Nenhuma URL de API disponível (nem VITE_API_URL nem fallback)! " +
    "As requisições vão falhar. Confira o .env do frontend."
  );
}

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

  const onExtracaoConcluidaRef = useRef(onExtracaoConcluida);
  const onLoginInativoRef = useRef(onLoginInativo);

  useEffect(() => {
    onExtracaoConcluidaRef.current = onExtracaoConcluida;
    onLoginInativoRef.current = onLoginInativo;
  }, [onExtracaoConcluida, onLoginInativo]);

  const verificarStatus = useCallback(async () => {
    const url = `${API_URL}/api/login/status`;

    try {
      console.log(`📡 [useExtracaoWatcher] GET ${url}`);

      const res = await fetch(url);

      console.log(`📥 [useExtracaoWatcher] resposta HTTP ${res.status} ${res.statusText}`);

      if (!res.ok) {
        console.error(
          `❌ [useExtracaoWatcher] status HTTP não-OK (${res.status}). ` +
          `Confira se a rota existe no backend e se a URL está correta: ${url}`
        );
        return;
      }

      const data: LoginStatus = await res.json();
      console.log("📦 [useExtracaoWatcher] dados recebidos:", data);
      setStatus(data);

      console.log(
        `🔎 [useExtracaoWatcher] extracaoExecutando: anterior=${extracaoAnteriorRef.current} atual=${data.extracaoExecutando}`
      );

      if (extracaoAnteriorRef.current && !data.extracaoExecutando) {
        console.log("✅ [useExtracaoWatcher] Extração concluída detectada! Chamando onExtracaoConcluida()...");
        onExtracaoConcluidaRef.current();
      }
      extracaoAnteriorRef.current = data.extracaoExecutando;

      if (loginAnteriorRef.current && !data.loginAtivo) {
        console.log("🔴 [useExtracaoWatcher] Login SEDUR ficou inativo (sessão expirada ou cron parado)");
        onLoginInativoRef.current?.();
      }
      loginAnteriorRef.current = data.loginAtivo;
    } catch (error) {
      console.error(`❌ [useExtracaoWatcher] Falha na requisição para ${url}:`, error);
      console.error(
        "   Causas comuns: VITE_API_URL não definida/errada, CORS bloqueando, backend fora do ar."
      );
    }
  }, []);

  useEffect(() => {
    console.log(`🚀 [useExtracaoWatcher] montado. API_URL="${API_URL}" intervalo=${intervaloMs}ms`);

    verificarStatus();
    const interval = setInterval(verificarStatus, intervaloMs);

    return () => {
      console.log("🛑 [useExtracaoWatcher] desmontado, parando polling.");
      clearInterval(interval);
    };
  }, [verificarStatus, intervaloMs]);

  return status;
}
