import { useQuery } from '@tanstack/react-query';
// import { api } from '../services/api.ts';
import { dentroDoHorarioPermitido } from '../lib/horario.ts';
import { jaFezLoginAlgumaVez } from '../lib/loginFlag';

const POLL_INTERVAL_MS = 30 * 60 * 1000;

export function useSedurLoginStatus() {
  return useQuery({
    queryKey: ['sedur-login-status'],
    queryFn: () => {

      return { success: true, loginAtivo: false, extracaoExecutando: false };

      // return api.verificarLoginSedur(),
    },

    enabled: jaFezLoginAlgumaVez(),
    retry: false,

    refetchInterval: () => {
      return dentroDoHorarioPermitido() ? POLL_INTERVAL_MS : false;
    },

    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
}
