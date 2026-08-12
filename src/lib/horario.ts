export function horaAtualBrasilia(): number {
  const agora = new Date();
  const horaBrasilia = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    hour12: false,
  }).format(agora);

  return parseInt(horaBrasilia, 10);
}

export function dentroDoHorarioPermitido(): boolean {
  return horaAtualBrasilia() < 20;
}
