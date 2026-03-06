export interface Processo {
  protocolo: string;
  estagio: string;
  data: string;
  servico: string;
  aba: 'andamento' | 'convite' | 'finalizado';
  extraido_em: string;
}

export interface Resumo {
  andamento: number;
  convite: number;
  finalizado: number;
}

export interface SedurData {
  atualizado_em: string;
  total: number;
  resumo: Resumo;
  processos: Processo[];
  erros: string[];
}

export interface FilterState {
  search: string;
  dateFrom: string;
  dateTo: string;
  status: string;
}
