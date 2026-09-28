import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { dentroDoHorarioPermitido } from "@/lib/horario";
import { jaFezLoginAlgumaVez } from "@/lib/loginFlag";

export interface LoginStatus {
  success: boolean;
  loginAtivo: boolean;
  extracaoExecutando: boolean;
}

interface UseExtracaoWatcherOptions {
  onExtracaoConcluida: () => void;
  onLoginInativo?: () => void;
}

const POLL_INTERVAL_MS = 60 * 60 * 1000;

export function useExtracaoWatcher({
  onExtracaoConcluida,
  onLoginInativo,
}: UseExtracaoWatcherOptions) {
  const { data: status } = useQuery<LoginStatus>({
    queryKey: ['sedur-login-status'],
    queryFn: () => api.verificarLoginSedur(),
    enabled: jaFezLoginAlgumaVez(),
    retry: false,
    refetchInterval: () => dentroDoHorarioPermitido() ? POLL_INTERVAL_MS : false,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const extracaoAnteriorRef = useRef<boolean>(false);
  const loginAnteriorRef = useRef<boolean>(true);

  const onExtracaoConcluidaRef = useRef(onExtracaoConcluida);
  const onLoginInativoRef = useRef(onLoginInativo);

  useEffect(() => {
    onExtracaoConcluidaRef.current = onExtracaoConcluida;
    onLoginInativoRef.current = onLoginInativo;
  }, [onExtracaoConcluida, onLoginInativo]);

  useEffect(() => {
    if (!status) return;

    if (extracaoAnteriorRef.current && !status.extracaoExecutando) {
      console.log("✅ [useExtracaoWatcher] Extração concluída detectada!");
      onExtracaoConcluidaRef.current();
    }
    extracaoAnteriorRef.current = status.extracaoExecutando;

    if (loginAnteriorRef.current && !status.loginAtivo) {
      console.log("🔴 [useExtracaoWatcher] Login SEDUR ficou inativo");
      onLoginInativoRef.current?.();
    }
    loginAnteriorRef.current = status.loginAtivo;
  }, [status]);

  return status ?? null;
}
