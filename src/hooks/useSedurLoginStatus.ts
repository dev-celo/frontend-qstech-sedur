import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api.ts';
import { dentroDoHorarioPermitido } from '../lib/horario.ts';
import { jaFezLoginAlgumaVez } from '../lib/loginFlag';

import type { LoginStatus } from './useExtracaoWatcher.ts';

const POLL_INTERVAL_MS = 60 * 60 * 1000;

export function useSedurLoginStatus() {
  return useQuery<LoginStatus>({
    queryKey: ['sedur-login-status'],
    queryFn: () => api.verificarLoginSedur(),

    enabled: jaFezLoginAlgumaVez(),
    retry: false,

    refetchInterval: () => dentroDoHorarioPermitido() ? POLL_INTERVAL_MS : false,

    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
}
