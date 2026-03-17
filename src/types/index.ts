export interface Tramitacao {
  data: string;
  estagio: string;
  destino: string;
  ordem?: number;
  criado_em?: string;
}

export interface Processo {
  id: string;
  protocolo: string;
  estagio: string;
  data: string;
  servico: string;
  empresa: string;
  telefone: string;
  cnpj_cpf?: string;
  aba: "andamento" | "convite" | "finalizado";
  extraido_em: string;

  ultima_tramitacao?: Tramitacao;
  ultimas_tramitacoes?: Tramitacao[];

  isRecente?: boolean;
}

export interface Resumo {
  andamento: number;
  convite: number;
  finalizado: number;
  total_recentes: number;
}

export interface FilterState {
  search: string;
  dateFrom: string;
  dateTo: string;
  status: string;
}