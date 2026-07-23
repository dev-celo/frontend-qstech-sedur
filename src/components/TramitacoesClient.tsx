import { MapPin, Calendar } from "lucide-react";
import type { ProcessoTramitacoes } from "../types/clientTypes.ts";
import { getStatusStyle } from "../utils/statusStyles.ts";
import { ParecerViewer } from "./ParecerViewer.tsx";

interface TramitacoesClientProps {
  tramitacoes: ProcessoTramitacoes;
}

export function TramitacoesClient({ tramitacoes }: TramitacoesClientProps) {
  const itens = tramitacoes ?? [];

  if (itens.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-gray-500">
        Nenhuma tramitação encontrada para este processo.
      </p>
    );
  }

  const ordenados = [...itens].sort((a, b) => a.ordem - b.ordem);
  const ultimaAtualizacao = ordenados[0]?.data;

  return (
    <div className="space-y-5">
      {ultimaAtualizacao && (
        <p className="text-xs text-gray-500">
          Atualizado em {ultimaAtualizacao}
        </p>
      )}

      <div className="max-h-[420px] overflow-y-auto pr-2">
        <ol className="relative space-y-6 border-l border-gray-200 pl-6">
          {ordenados.map((item, index) => {
            const style = getStatusStyle(item.estagio);
            const isFirst = index === 0;

            return (
              <li key={item.ordem} className="relative">
                <span
                  className={`absolute -left-[29px] flex h-4 w-4 items-center justify-center rounded-full border-2 border-white
                    ${isFirst ? "bg-green-600" : "bg-gray-300"}`}
                />
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${style.badge}`}>
                    {item.estagio}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar size={12} />
                    {item.data}
                  </span>
                </div>
                <p className="mt-1 flex items-start gap-1 text-sm text-gray-700">
                  <MapPin size={14} className="mt-0.5 shrink-0 text-gray-400" />
                  {item.destino}
                </p>
                <ParecerViewer parecer={item.parecer} />
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
