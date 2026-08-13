import { useEffect, useRef, useCallback, useState } from "react";
import { api } from "@/services/api";

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
    try {
      console.log("📡 [useExtracaoWatcher] consultando api.verificarLoginSedur()...");

      const data: LoginStatus = await api.verificarLoginSedur();

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
      console.error("❌ [useExtracaoWatcher] Falha ao consultar api.verificarLoginSedur():", error);
    }
  }, []);

  useEffect(() => {
    console.log(`🚀 [useExtracaoWatcher] montado. intervalo=${intervaloMs}ms`);

    verificarStatus();
    const interval = setInterval(verificarStatus, intervaloMs);

    return () => {
      console.log("🛑 [useExtracaoWatcher] desmontado, parando polling.");
      clearInterval(interval);
    };
  }, [verificarStatus, intervaloMs]);

  return status;
}
