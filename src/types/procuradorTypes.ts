// Types do procurador
export type procuradorPayload = {
  cnpj_cpf: string;
  senha: string;
};

// Resposta do login
export type LoginResponseProcurador = {
  token?: string;
  procurador?: {
    cnpj_cpf: string;
    nome: string;
    email: string;
  };
};

// Types do gerar codigo
export type gerarCodigoPayload = { cnpj_cpf: string; proposito: string };

// Types do validar codigo
export type validarCodigoPayload = {
  cnpj_cpf: string;
  codigo: string;
  proposito: string;
};

export type redefinirSenhaPayload = {
  cnpj_cpf: string;
  novaSenha: string;
};

// Perfil completo retornado por /procurador/me
export interface ProcuradorPerfil {
  cnpj_cpf: string;
  nome: string;
  email: string;
  telefone: string | null;
  status: string;
  verificado: boolean;
  createdAt: string;
  updatedAt: string;
  ultimo_login: string | null;
}

// Objeto de procurador embutido dentro de cada processo (procuradores[])
export interface ProcuradorVinculado {
  cnpj_cpf: string;
  nome: string;
  email: string;
  telefone: string;
}

// Processo retornado para o procurador — mesma estrutura salva em
// resumo/dashboard, incluindo os arrays de procuradores vinculados
export interface ProcessoProcurador {
  id: string;
  protocolo: string;
  aba: string;
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
  procuradores: ProcuradorVinculado[];
  cpf_procuradores: string[];
}

// Resposta de /procurador/processos
export interface ProcessosProcuradorResponse {
  total: number;
  processos: ProcessoProcurador[];
}

// Item individual do histórico de tramitações (mesmo shape do cliente)
export interface Tramitacao {
  ordem: number;
  data: string;
  destino: string;
  estagio: string;
  parecer: string;
}

export type ProcessoTramitacoes = Tramitacao[];
