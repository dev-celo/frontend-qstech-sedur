import type {
  EmpresaInfo,
  ProcessoResumo,
  ProcessoAndamento,
  ProcessoTramitacoes,
} from "../types/clientTypes.ts";

// ⚠️ Todos os dados abaixo são fictícios, usados apenas para testar o layout.

export const MOCK_CNPJ = "12.345.678/0001-90";

export const MOCK_EMPRESA: EmpresaInfo = {
  empresa: "ACME CONSTRUÇÕES E EMPREENDIMENTOS LTDA",
  cnpj_cpf: MOCK_CNPJ,
  email: "contato@acmeempreendimentos.com.br",
  telefone: "(71) 91234-5678",
};

const ESTAGIOS_CICLO = [
  "Encaminhado",
  "Em análise",
  "Aguardando documentos",
  "Concluído",
] as const;

const DESTINOS = [
  "SEDUR-DFI-CFA-FAMB-SEMAM-SETOR DE MONITORAMENTO AMBIENTAL",
  "SEDUR-DFI-CFA-FAMB-SEMAM-CONSULTORIA TÉCNICA",
  "SEDUR-DFI-CFA-FAMB-SEMAM-SETOR DE PROTOCOLO",
  "SEDUR-DFI-CFA-FAMB-SEMAM-ARQUIVO",
  "SEDUR-DLI-CPE-COORDENAÇÃO DE PROCESSOS ESPECIAIS",
  "SEDUR-ASSESSORIA",
];

const SERVICOS = [
  "Atendimento a Condicionante Ambiental",
  "Licenciamento Ambiental Simplificado",
  "Emissão de Alvará de Construção",
  "Renovação de Licença de Operação",
  "Certidão de Uso e Ocupação do Solo",
];

function gerarProcessoMock(indice: number): {
  resumo: ProcessoResumo;
  andamento: ProcessoAndamento;
  tramitacoes: ProcessoTramitacoes;
} {
  const id = String(indice + 1);
  const protocolo = `PR 5911000000-${6800 - indice * 17}/2026`;
  const estagio = ESTAGIOS_CICLO[indice % ESTAGIOS_CICLO.length];
  const qtdeTramitacoes = 3 + (indice % 6);
  const destino = DESTINOS[indice % DESTINOS.length];
  const servico = SERVICOS[indice % SERVICOS.length];

  const dia = String(28 - (indice % 27)).padStart(2, "0");
  const mes = String(((indice % 6) + 1)).padStart(2, "0");
  const dataCurta = `${dia}/${mes}/2026`;
  const hora = `${String(8 + (indice % 10)).padStart(2, "0")}:${String(
    (indice * 7) % 60
  ).padStart(2, "0")}`;

  const resumo: ProcessoResumo = {
    id,
    protocolo,
    qtde_tramitacoes: qtdeTramitacoes,
    estagio,
    ultima_tramitacao_data: `${dataCurta} ${hora}`,
    ultima_tramitacao_destino: destino,
  };

  const andamento: ProcessoAndamento = {
    id,
    protocolo,
    cnpj_cpf: MOCK_CNPJ,
    empresa: MOCK_EMPRESA.empresa,
    email: MOCK_EMPRESA.email,
    telefone: MOCK_EMPRESA.telefone,
    servico,
    estagio,
    qtde_tramitacoes: qtdeTramitacoes,
    data: dataCurta,
    ultima_tramitacao_data: `${dataCurta} ${hora}`,
    ultima_tramitacao_destino: destino,
    ultima_tramitacao_estagio: estagio.toUpperCase(),
    extraido_em: "2026-06-26T02:10:50.034Z",
    erro_captura: null,
  };

  const tramitacoes: ProcessoTramitacoes = {
    processo_id: id,
    protocolo,
    cnpj_cpf: MOCK_CNPJ,
    empresa: MOCK_EMPRESA.empresa,
    ultima_atualizacao: "2026-06-26T02:29:23.728Z",
    tramitacoes: Array.from({ length: qtdeTramitacoes }, (_, i) => {
      const ordem = i + 1;
      const diaT = String(27 - ((indice + i) % 26)).padStart(2, "0");
      const mesT = String(((indice + i) % 12) + 1).padStart(2, "0");
      const horaT = `${String(8 + ((indice + i) % 10)).padStart(
        2,
        "0"
      )}:${String(((indice + i) * 11) % 60).padStart(2, "0")}`;

      return {
        ordem,
        data: `${diaT}/${mesT}/2025 ${horaT}`,
        destino: DESTINOS[(indice + i) % DESTINOS.length],
        estagio:
          ESTAGIOS_CICLO[(indice + i) % ESTAGIOS_CICLO.length].toUpperCase(),
      };
    }),
  };

  return { resumo, andamento, tramitacoes };
}

const MOCKS = Array.from({ length: 12 }, (_, i) => gerarProcessoMock(i));

export const MOCK_PROCESSOS: ProcessoResumo[] = MOCKS.map((m) => m.resumo);

export const MOCK_ANDAMENTOS: Record<string, ProcessoAndamento> =
  Object.fromEntries(MOCKS.map((m) => [m.andamento.id, m.andamento]));

export const MOCK_TRAMITACOES: Record<string, ProcessoTramitacoes> =
  Object.fromEntries(
    MOCKS.map((m) => [m.tramitacoes.processo_id, m.tramitacoes])
  );
