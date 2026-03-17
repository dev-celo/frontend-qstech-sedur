export function parseBRDate(dateStr: string): Date | null {
  if (!dateStr) return null;

  const [datePart] = dateStr.split(" ");
  const partes = datePart.split("/");

  if (partes.length !== 3) return null;

  const dia = Number(partes[0]);
  const mes = Number(partes[1]) - 1;
  const ano = Number(partes[2]);

  const date = new Date(ano, mes, dia);

  return isNaN(date.getTime()) ? null : date;
}

export function isWithinLastDays(date: Date | null, days: number): boolean {
  if (!date) return false;

  const hoje = new Date();
  hoje.setHours(23, 59, 59, 999);

  const limite = new Date();
  limite.setDate(hoje.getDate() - days);
  limite.setHours(0, 0, 0, 0);

  return date >= limite && date <= hoje;
}