import type { ProcessoResumo, ProcessoDetalhes } from "../types/clientTypes.ts";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { CardClient } from "./CardClient";
import { DetalhesProcessoClient } from "./DetalhesProcessoClient";

import {
  fetchProcessoClient,
  fetchProcessosClient,
  fetchTramitacoesClient,
  requestError
} from "@/services/clientApi.ts";

// TODO: Tirar Loading ao trocar a paginação

const ITENS_POR_PAGINA = 5;

export function ProcessosClient() {
  const [todosProcessos, setTodosProcessos] = useState<ProcessoResumo[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [carregandoLista, setCarregandoLista] = useState(true);
  const [erroLista, setErroLista] = useState<string | null>(null);

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
        const resposta = await fetchProcessosClient();
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

  const totalProcessos = todosProcessos.length;
  const totalPaginas = Math.max(1, Math.ceil(totalProcessos / ITENS_POR_PAGINA));

  const processos = useMemo(() => {
    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    return todosProcessos.slice(inicio, inicio + ITENS_POR_PAGINA)
  }, [todosProcessos, paginaAtual])

  const handleSelecionarProcesso = async (processoId: string) => {
    setProcessoSelecionadoId(processoId);
    setCarregandoDetalhes(true);
    setErroDetalhes(null);
    setDetalhes(null);

    try {
      const [andamento, tramitacoes] = await Promise.all([
        fetchProcessoClient(processoId),
        fetchTramitacoesClient(processoId),
      ]);
      setDetalhes({ andamento, tramitacoes });
    } catch (err) {
      setErroDetalhes(err instanceof requestError ? err.message : "Não foi possível carregar os detalhes do processo.");
    } finally {
      setCarregandoDetalhes(false);
    }
  };


  // console.log(detalhes, 'detalhes');

  return (
    <div className="grid h-full min-h-0 grid-cols-1 gap-6 lg:grid-cols-5">
      <div className="min-h-0 lg:col-span-2">
        <div className="flex h-full min-h-0 flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="shrink-0 text-lg font-bold text-gray-800">
            Meus processos
          </h2>

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
                Nenhum processo encontrado para este CNPJ.
              </p>
            )}

            {!carregandoLista &&
              !erroLista &&
              processos.map((processo) => (
                <CardClient
                  key={processo.id}
                  protocolo={processo.protocolo}
                  qtdeTramitacoes={processo.qtde_tramitacoes}
                  estagio={processo.estagio}
                  ultimaTramitacaoData={processo.ultima_tramitacao_data}
                  ultimaTramitacaoDestino={processo.ultima_tramitacao_destino}
                  selecionado={processo.id === processoSelecionadoId}
                  onClick={() => handleSelecionarProcesso(processo.id)}
                />
              ))}
          </div>

          {!carregandoLista && !erroLista && processos.length > 0 && (
            <div className="mt-4 flex shrink-0 items-center justify-between">
              <p className="text-xs text-gray-500">
                Mostrando {processos.length} de {totalProcessos} processos
              </p>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
                  disabled={paginaAtual === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                  (numero) => (
                    <button
                      key={numero}
                      type="button"
                      onClick={() => setPaginaAtual(numero)}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition
                        ${numero === paginaAtual
                          ? "bg-green-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      {numero}
                    </button>
                  )
                )}

                <button
                  type="button"
                  onClick={() =>
                    setPaginaAtual((p) => Math.min(totalPaginas, p + 1))
                  }
                  disabled={paginaAtual === totalPaginas}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
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
