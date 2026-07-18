import { useState } from "react";
import { TrendingUp, ListTree } from "lucide-react";
import type { ProcessoDetalhes } from "../types/clientTypes.ts";
import { AndamentoClient } from "./AndamentoClient";
import { TramitacoesClient } from "./TramitacoesClient";

type Aba = "andamento" | "tramitacoes";

interface DetalhesProcessoClientProps {
  detalhes: ProcessoDetalhes | null;
  carregando: boolean;
  erro: string | null;
}

export function DetalhesProcessoClient({
  detalhes,
  carregando,
  erro,
}: DetalhesProcessoClientProps) {
  const [aba, setAba] = useState<Aba>("andamento");
  console.log(detalhes?.tramitacoes);


  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="shrink-0 text-lg font-bold text-gray-800">
        Detalhes do processo
      </h2>

      <div className="mt-4 flex shrink-0 items-center gap-2 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setAba("andamento")}
          className={`flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium transition
            ${aba === "andamento"
              ? "border-green-600 text-green-700"
              : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
        >
          <TrendingUp size={16} />
          Processo
        </button>

        <button
          type="button"
          onClick={() => setAba("tramitacoes")}
          className={`flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium transition
            ${aba === "tramitacoes"
              ? "border-green-600 text-green-700"
              : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
        >
          <ListTree size={16} />
          Tramitações
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1 pt-6">
        {carregando && (
          <p className="py-10 text-center text-sm text-gray-500">
            Carregando detalhes do processo...
          </p>
        )}

        {!carregando && erro && (
          <p className="py-10 text-center text-sm text-red-600">{erro}</p>
        )}

        {!carregando && !erro && !detalhes && (
          <p className="py-10 text-center text-sm text-gray-500">
            Selecione um processo na lista ao lado para ver os detalhes.
          </p>
        )}

        {!carregando && !erro && detalhes && aba === "andamento" && (
          <AndamentoClient andamento={detalhes.andamento} />
        )}

        {!carregando && !erro && detalhes && aba === "tramitacoes" && (
          <TramitacoesClient tramitacoes={detalhes.tramitacoes} />
        )}
      </div>
    </div>
  );
}
