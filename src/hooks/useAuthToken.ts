import { useSyncExternalStore } from "react";
import { getToken } from "../services/clientApi";

const EVENTO_TOKEN = "auth-token-changed";

function subscribe(callback: () => void) {
  window.addEventListener(EVENTO_TOKEN, callback);
  return () => window.removeEventListener(EVENTO_TOKEN, callback);
}

export function useAuthToken() {
  return useSyncExternalStore(subscribe, getToken);
}
