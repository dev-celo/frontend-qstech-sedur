import {
  FileText,
  ClipboardList,
  Flag,
  RefreshCw,
  Calendar,
  Clock,
  MapPin,
  Building2,
  Mail,
  Phone,
  Info,
} from "lucide-react";
import type { ProcessoAndamento } from "../types/clientTypes.ts";
import { getStatusStyle } from "../utils/statusStyles.ts";

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="break-words font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}

interface AndamentoClientProps {
  andamento: ProcessoAndamento;
}

export function AndamentoClient({ andamento }: AndamentoClientProps) {
  const style = getStatusStyle(andamento.estagio);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
        <InfoRow
          icon={<FileText size={16} />}
          label="Protocolo"
          value={andamento.protocolo}
        />

        <InfoRow
          icon={<MapPin size={16} />}
          label="Destino da última tramitação"
          value={andamento.ultima_tramitacao_destino}
        />

        <InfoRow
          icon={<ClipboardList size={16} />}
          label="Serviço"
          value={andamento.servico}
        />

        <InfoRow
          icon={<Building2 size={16} />}
          label="CNPJ/CPF"
          value={andamento.cnpj_cpf}
        />

        <InfoRow
          icon={<Flag size={16} />}
          label="Estágio (Status)"
          value={
            <span
              className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${style.badge}`}
            >
              {andamento.estagio}
            </span>
          }
        />

        <InfoRow
          icon={<Building2 size={16} />}
          label="Empresa"
          value={andamento.empresa}
        />

        <InfoRow
          icon={<RefreshCw size={16} />}
          label="Quantidade de tramitações"
          value={andamento.qtde_tramitacoes}
        />

        <InfoRow
          icon={<Mail size={16} />}
          label="E-mail"
          value={andamento.email}
        />

        <InfoRow
          icon={<Calendar size={16} />}
          label="Data"
          value={andamento.data}
        />

        <InfoRow
          icon={<Phone size={16} />}
          label="Telefone"
          value={andamento.telefone}
        />

        <InfoRow
          icon={<Clock size={16} />}
          label="Última tramitação (Data e Hora)"
          value={andamento.ultima_tramitacao_data}
        />
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-green-100 bg-green-50 p-4">
        <Info size={16} className="mt-0.5 shrink-0 text-green-600" />
        <p className="text-sm text-green-700">
          Clique na aba "Tramitações" para visualizar o histórico completo de
          movimentações deste processo.
        </p>
      </div>
    </div>
  );
}
