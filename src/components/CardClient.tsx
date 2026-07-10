import { Folder, RefreshCw, ChevronRight } from "lucide-react";
import { getStatusStyle } from "../utils/statusStyles.ts";

interface CardClientProps {
  protocolo: string;
  qtdeTramitacoes: number;
  estagio: string;
  ultimaTramitacaoData: string;
  ultimaTramitacaoDestino: string;
  selecionado: boolean;
  onClick: () => void;
}

export function CardClient({
  protocolo,
  qtdeTramitacoes,
  estagio,
  ultimaTramitacaoData,
  ultimaTramitacaoDestino,
  selecionado,
  onClick,
}: CardClientProps) {
  const style = getStatusStyle(estagio);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-start gap-4 rounded-xl border bg-white p-4 text-left transition
        ${selecionado
          ? `${style.border} border-2 shadow-sm`
          : "border-gray-200 hover:border-gray-300"
        }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${style.icon}`}
      >
        <Folder size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-gray-800">{protocolo}</p>

        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <RefreshCw size={13} />
            {qtdeTramitacoes} tramitações
          </span>

          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${style.badge}`}
          >
            {estagio}
          </span>
        </div>

        <p className="mt-2 text-xs text-gray-500">
          Última tramitação: {ultimaTramitacaoData}
        </p>
        <p className="truncate text-xs text-gray-500">
          Destino: {ultimaTramitacaoDestino}
        </p>
      </div>

      <ChevronRight size={18} className="mt-2 shrink-0 text-gray-400" />
    </button>
  );
}
