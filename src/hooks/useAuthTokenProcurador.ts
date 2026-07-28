import { useSyncExternalStore } from "react";
import { getToken } from "../services/procuradorApi.ts";

const EVENTO_TOKEN = "auth-token-procurador-changed";

function subscribe(callback: () => void) {
  window.addEventListener(EVENTO_TOKEN, callback);
  return () => window.removeEventListener(EVENTO_TOKEN, callback);
}

export function useAuthTokenProcurador() {
  return useSyncExternalStore(subscribe, getToken);
}
