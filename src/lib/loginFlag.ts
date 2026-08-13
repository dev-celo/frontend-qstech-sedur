const JA_LOGOU_KEY = 'sedur_monitoramento_ativo';

export function jaFezLoginAlgumaVez(): boolean {
  return localStorage.getItem(JA_LOGOU_KEY) === 'true';
}

export function marcarLoginRealizado(): void {
  localStorage.setItem(JA_LOGOU_KEY, 'true');
}

export function resetarFlagLogin(): void {
  localStorage.removeItem(JA_LOGOU_KEY);
}
