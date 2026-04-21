// utils/date.ts
const DEBUG_DATES = false; // 🔥 Desative em produção - true apenas para debug

export function parseBRDate(dateStr: string): Date | null {
  if (!dateStr) return null;

  // Pega apenas a data (ignora hora)
  const [datePart] = dateStr.split(" ");
  const partes = datePart.split("/");

  if (partes.length !== 3) return null;

  const dia = Number(partes[0]);
  const mes = Number(partes[1]) - 1;
  const ano = Number(partes[2]);

  const date = new Date(ano, mes, dia);
  
  // 🔥 Log apenas se DEBUG_DATES for true
  if (DEBUG_DATES) {
    console.log(`📅 Parse: ${dateStr} → ${date.toLocaleDateString('pt-BR')}`);
  }

  return isNaN(date.getTime()) ? null : date;
}

export function isWithinLastDays(date: Date | null, days: number): boolean {
  if (!date) return false;

  const hoje = new Date();
  const hojeSemHora = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  
  const limite = new Date(hojeSemHora);
  limite.setDate(limite.getDate() - days);

  const dataSemHora = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const isRecente = dataSemHora >= limite && dataSemHora <= hojeSemHora;
  
  // 🔥 Log apenas se DEBUG_DATES for true
  if (DEBUG_DATES) {
    console.log(`📊 Comparação: ${dataSemHora.toLocaleDateString('pt-BR')} >= ${limite.toLocaleDateString('pt-BR')} = ${isRecente}`);
  }

  return isRecente;
}

export function formatDate(date: Date | null): string {
  if (!date) return '';
  return date.toLocaleDateString('pt-BR');
}