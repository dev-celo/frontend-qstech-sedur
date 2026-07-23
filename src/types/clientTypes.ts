// Types do client
export type clientPayload = {
  cnpj_cpf: string;
  senha: string;
};

// Resposta do login
export type LoginResponse = {
  token?: string;
  cliente?: {
    cnpj_cpf: string;
    nome: string;
    email: string;
  };
};

// Resposta do registro

// Types do gerar codigo
export type gerarCodigoPayload = { cnpj_cpf: string, proposito: string }

// Types do validar codigo
export type validarCodigoPayload = {
  cnpj_cpf: string,
  codigo: string,
  proposito: string
}

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
  parecer: string;
}

export type ProcessoTramitacoes = Tramitacao[];

// Pacote de dados usado pelo DetalhesProcessoClient (Andamento + Tramitações
// já resolvidos, buscados de forma eager assim que um processo é selecionado)
export interface ProcessoDetalhes {
  andamento: ProcessoAndamento;
  tramitacoes: ProcessoTramitacoes;
}

export type redefinirSenhaPayload = {
  cnpj_cpf: string;
  novaSenha: string;
}
