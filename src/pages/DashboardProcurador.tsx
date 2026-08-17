import { useEffect, useState } from "react";
import { fetchMeProcurador, clearToken } from "../services/procuradorApi.ts";
import { HeaderProcurador } from "../components/HeaderProcurador.tsx";
import { ProcessosProcurador } from "../components/ProcessosProcurador.tsx";
import { useNavigate } from "react-router-dom";

interface ProcuradorInfo {
  nome: string;
  cnpj_cpf: string;
  email: string;
  telefone: string;
}

export function DashboardProcurador() {
  const [procuradorInfo, setProcuradorInfo] = useState<ProcuradorInfo | null>(null);
  const [carregandoProcurador, setCarregandoProcurador] = useState(true);
  const [erroProcurador, setErroProcurador] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    let ativo = true;

    async function carregarProcurador() {
      setCarregandoProcurador(true);
      setErroProcurador(null);

      try {
        const dados = await fetchMeProcurador();
        if (ativo) {
          setProcuradorInfo({
            nome: dados.nome,
            cnpj_cpf: dados.cnpj_cpf,
            email: dados.email,
            telefone: dados.telefone ?? "",
          });
        }
      } catch (err) {
        if (ativo) setErroProcurador("Não foi possível carregar os dados do procurador.");
      } finally {
        if (ativo) setCarregandoProcurador(false);
      }
    }

    carregarProcurador();

    return () => {
      ativo = false;
    };
  }, []);

  const handleLogout = () => {
    clearToken();
    navigate("/procurador/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-gray-200 px-4 py-8">
      <div className="mx-auto max-w-screen-2xl">
        {carregandoProcurador && (
          <p className="py-10 text-center text-sm text-gray-500">
            Carregando dados do procurador...
          </p>
        )}

        {!carregandoProcurador && erroProcurador && (
          <p className="py-10 text-center text-sm text-red-600">
            {erroProcurador}
          </p>
        )}

        {!carregandoProcurador && !erroProcurador && procuradorInfo && (
          <>
            <HeaderProcurador
              nome={procuradorInfo.nome}
              cnpj={procuradorInfo.cnpj_cpf}
              email={procuradorInfo.email}
              telefone={procuradorInfo.telefone}
              onLogout={handleLogout}
            />

            <ProcessosProcurador />
          </>
        )}

        <div className="mt-8 text-center text-xs text-gray-500">
          © 2026 QSTECH. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
}
