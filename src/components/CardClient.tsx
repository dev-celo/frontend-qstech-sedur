import { Folder, RefreshCw, ChevronRight } from "lucide-react";
import { getStatusStyle } from "../utils/statusStyles.ts";

interface CardClientProps {
  protocolo: string;
  servico: string;
  empresa: string;
  cnpj: string;
  qtdeTramitacoes: number;
  estagio: string;
  ultimaTramitacaoData: string;
  ultimaTramitacaoDestino: string;
  selecionado: boolean;
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function CardClient({
  protocolo,
  servico,
  empresa,
  cnpj,
  qtdeTramitacoes,
  estagio,
  ultimaTramitacaoData,
  ultimaTramitacaoDestino,
  selecionado,
  onClick,
  className,
  style: customStyle,
}: CardClientProps) {
  const statusStyle = getStatusStyle(estagio);

  return (
    <button
      type="button"
      onClick={onClick}
      style={customStyle}
      className={`flex w-full max-w-full items-start gap-4 rounded-xl border bg-white p-4 text-left transition
        ${selecionado
          ? `${statusStyle.border} border-2 shadow-sm`
          : "border-gray-200 hover:border-gray-300"
        } ${className ?? ""}`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${statusStyle.icon}`}
      >
        <Folder size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-gray-800">{protocolo}</p>
        <p className="truncate text-lg text-gray-600">{servico}</p>

        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <RefreshCw size={13} />
            {qtdeTramitacoes} tramitações
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyle.badge}`}
          >
            {estagio}
          </span>
        </div>

        <p className="mt-2 text-sm text-green-600 break-words font-bold">
          {empresa} · CNPJ {cnpj}
        </p>

        <p className="mt-1 text-xs text-gray-500">
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
