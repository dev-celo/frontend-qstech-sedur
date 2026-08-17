import type { ProcessoResumo, ProcessoDetalhes } from "../types/clientTypes.ts";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

import { CardClient } from "./CardClient";
import { DetalhesProcessoClient } from "./DetalhesProcessoClient";

import {
  fetchProcessoProcurador,
  fetchProcessosProcurador,
  fetchTramitacoesProcurador,
  requestError
} from "../services/procuradorApi.ts";

const ITENS_POR_PAGINA = 5;

function parseDataBR(data: string): number {
  if (!data) return 0;
  const [dataParte, horaParte] = data.split(" ");
  const [dia, mes, ano] = dataParte.split("/").map(Number);
  const [hora, minuto] = (horaParte ?? "00:00").split(":").map(Number);
  return new Date(ano, mes - 1, dia, hora, minuto).getTime();
}

function getPaginasVisiveis(paginaAtual: number, totalPaginas: number): (number | "...")[] {
  const delta = 1; // quantas páginas mostrar ao redor da atual
  const paginas: (number | "...")[] = [];

  const inicio = Math.max(2, paginaAtual - delta);
  const fim = Math.min(totalPaginas - 1, paginaAtual + delta);

  paginas.push(1);
  if (inicio > 2) paginas.push("...");
  for (let i = inicio; i <= fim; i++) paginas.push(i);
  if (fim < totalPaginas - 1) paginas.push("...");
  if (totalPaginas > 1) paginas.push(totalPaginas);

  return paginas;
}

export function ProcessosProcurador() {
  const [todosProcessos, setTodosProcessos] = useState<ProcessoResumo[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [carregandoLista, setCarregandoLista] = useState(true);
  const [erroLista, setErroLista] = useState<string | null>(null);

  const [filtroEmpresa, setFiltroEmpresa] = useState("");

  const [processoSelecionadoId, setProcessoSelecionadoId] = useState<string | null>(null);

  const [detalhes, setDetalhes] = useState<ProcessoDetalhes | null>(null);
  const [carregandoDetalhes, setCarregandoDetalhes] = useState(false);
  const [erroDetalhes, setErroDetalhes] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;

    async function carregarProcessos() {
      setCarregandoLista(true);
      setErroLista(null);

      try {
        const resposta = await fetchProcessosProcurador();
        if (!ativo) return;
        const processosCarregados = resposta.processos ?? [];
        setTodosProcessos(processosCarregados);

        if (processosCarregados.length > 0) {
          await handleSelecionarProcesso(processosCarregados[0].id);
        }
      } catch (err) {
        if (!ativo) return;
        setErroLista(err instanceof requestError ? err.message : "Não foi possível carregar os processos.");
      } finally {
        if (ativo) setCarregandoLista(false);
      }
    }

    carregarProcessos();
    return () => { ativo = false };
  }, []);

  const processosOrdenados = useMemo(() => {
    return [...todosProcessos].sort(
      (a, b) => parseDataBR(b.ultima_tramitacao_data) - parseDataBR(a.ultima_tramitacao_data)
    );
  }, [todosProcessos]);

  const processosFiltrados = processosOrdenados.filter((processo) =>
    processo.empresa?.toLowerCase().includes(filtroEmpresa.toLowerCase())
  );

  const totalProcessos = processosFiltrados.length;
  const totalPaginas = Math.max(1, Math.ceil(totalProcessos / ITENS_POR_PAGINA));

  const processos = useMemo(() => {
    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    return processosFiltrados.slice(inicio, inicio + ITENS_POR_PAGINA);
  }, [processosFiltrados, paginaAtual]);

  const handleSelecionarProcesso = async (processoId: string) => {
    setProcessoSelecionadoId(processoId);
    setCarregandoDetalhes(true);
    setErroDetalhes(null);
    setDetalhes(null);

    try {
      const [andamento, tramitacoes] = await Promise.all([
        fetchProcessoProcurador(processoId),
        fetchTramitacoesProcurador(processoId),
      ]);
      setDetalhes({ andamento, tramitacoes });
    } catch (err) {
      setErroDetalhes(err instanceof requestError ? err.message : "Não foi possível carregar os detalhes do processo.");
    } finally {
      setCarregandoDetalhes(false);
    }
  };

  return (
    <div className="grid h-full min-h-0 grid-cols-1 gap-6 lg:grid-cols-5" >
      <div className="min-h-0 lg:col-span-2">
        <div className="flex h-full min-h-0 flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="shrink-0 text-lg font-bold text-gray-800">
            Processos vinculados
          </h2>

          {/* Filtro por nome da empresa */}
          <div className="mt-4 shrink-0 relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={filtroEmpresa}
              onChange={(e) => {
                setFiltroEmpresa(e.target.value);
                setPaginaAtual(1);
              }}
              placeholder="Buscar por empresa..."
              className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-green-500"
            />
          </div>

          <div className="mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
            {carregandoLista && (
              <p className="py-10 text-center text-sm text-gray-500">
                Carregando processos...
              </p>
            )}

            {!carregandoLista && erroLista && (
              <p className="py-10 text-center text-sm text-red-600">
                {erroLista}
              </p>
            )}

            {!carregandoLista && !erroLista && processos.length === 0 && (
              <p className="py-10 text-center text-sm text-gray-500">
                {filtroEmpresa
                  ? "Nenhum processo encontrado para essa empresa."
                  : "Nenhum processo vinculado a este CPF."}
              </p>
            )}

            {!carregandoLista &&
              !erroLista &&
              processos.map((processo, index) => (
                <CardClient
                  key={processo.id}
                  empresa={processo.empresa}
                  servico={processo.servico}
                  cnpj={processo.cnpj_cpf}
                  protocolo={processo.protocolo}
                  qtdeTramitacoes={processo.qtde_tramitacoes}
                  estagio={processo.estagio}
                  ultimaTramitacaoData={processo.ultima_tramitacao_data}
                  ultimaTramitacaoDestino={processo.ultima_tramitacao_destino}
                  selecionado={processo.id === processoSelecionadoId}
                  onClick={() => handleSelecionarProcesso(processo.id)}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 40}ms` }}
                />
              ))}
          </div>

          {!carregandoLista && !erroLista && processos.length > 0 && (
            <div className="mt-4 flex min-w-0 shrink-0 items-center justify-between gap-2">
              <p className="shrink-0 text-xs text-gray-500">
                Mostrando {processos.length} de {totalProcessos} processos
              </p>
              <div className="flex min-w-0 items-center gap-1 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
                  disabled={paginaAtual === 1}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                </button>

                {getPaginasVisiveis(paginaAtual, totalPaginas).map((item, index) =>
                  item === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="flex h-8 w-8 shrink-0 items-center justify-center text-sm text-gray-400"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setPaginaAtual(item)}
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-medium transition
            ${item === paginaAtual
                          ? "bg-green-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      {item}
                    </button>
                  )
                )}

                <button
                  type="button"
                  onClick={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
                  disabled={paginaAtual === totalPaginas}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>)}
        </div>
      </div>

      {/* Coluna: Detalhes do processo */}
      <div className="min-h-0 lg:col-span-3">
        <DetalhesProcessoClient
          detalhes={detalhes}
          carregando={carregandoDetalhes}
          erro={erroDetalhes}
        />
      </div>
    </div>
  );
}
