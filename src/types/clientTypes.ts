// Dados da empresa exibidos no HeaderClient
export interface EmpresaInfo {
  empresa: string;
  cnpj_cpf: string;
  email: string;
  telefone: string;
}

// Item resumido exibido em cada CardClient (lista "Meus processos")
export interface ProcessoResumo {
  id: string;
  protocolo: string;
  qtde_tramitacoes: number;
  estagio: string;
  ultima_tramitacao_data: string;
  ultima_tramitacao_destino: string;
}

// Resposta paginada do endpoint de listagem de processos
export interface ProcessosPaginados {
  processos: ProcessoResumo[];
  paginaAtual: number;
  totalPaginas: number;
  totalProcessos: number;
}

// Modelo completo da aba "Andamento"
export interface ProcessoAndamento {
  id: string;
  protocolo: string;
  cnpj_cpf: string;
  empresa: string;
  email: string;
  telefone: string;
  servico: string;
  estagio: string;
  qtde_tramitacoes: number;
  data: string;
  ultima_tramitacao_data: string;
  ultima_tramitacao_destino: string;
  ultima_tramitacao_estagio: string;
  extraido_em: string;
  erro_captura: string | null;
}

// Item individual do histórico de tramitações
export interface Tramitacao {
  ordem: number;
  data: string;
  destino: string;
  estagio: string;
}

// Modelo completo da aba "Tramitações"
export interface ProcessoTramitacoes {
  processo_id: string;
  protocolo: string;
  cnpj_cpf: string;
  empresa: string;
  tramitacoes: Tramitacao[];
  ultima_atualizacao: string;
}

// Pacote de dados usado pelo DetalhesProcessoClient (Andamento + Tramitações
// já resolvidos, buscados de forma eager assim que um processo é selecionado)
export interface ProcessoDetalhes {
  andamento: ProcessoAndamento;
  tramitacoes: ProcessoTramitacoes;
}
