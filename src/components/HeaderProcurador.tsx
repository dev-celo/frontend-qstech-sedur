import { User, IdCard, LogOut, Mail, Phone } from "lucide-react";

interface HeaderProcuradorProps {
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  onLogout: () => void;
}

export function HeaderProcurador({
  nome,
  cnpj,
  email,
  telefone,
  onLogout,
}: HeaderProcuradorProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center gap-3">
          <img
            src="/logo-qstech-nome-qstech-consultoria&gestao-ambientalverde.png"
            alt="QSTECH"
            className="h-28 object-contain"
          />
        </div>

        <div>
          <h1 className="mt-2 text-center text-3xl font-bold text-gray-800">
            Dashboard do procurador
          </h1>
          <p className="mt-1 text-center text-sm text-gray-600">
            Acompanhe os processos vinculados a você
          </p>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-bold text-gray-800">Dados do procurador</h2>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-between">
          <div className="flex items-start gap-2">
            <User size={16} className="mt-0.5 shrink-0 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Nome</p>
              <p className="text-sm font-medium text-gray-800">{nome}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <IdCard size={16} className="mt-0.5 shrink-0 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">CPF</p>
              <p className="text-sm font-medium text-gray-800">{cnpj}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Mail size={16} className="mt-0.5 shrink-0 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">E-mail</p>
              <p className="text-sm font-medium text-gray-800">{email}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Phone size={16} className="mt-0.5 shrink-0 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Telefone</p>
              <p className="text-sm font-medium text-gray-800">{telefone || "Não informado"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
