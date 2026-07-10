import { useEffect, useState } from "react";
import type { EmpresaInfo } from "../types/clientTypes.ts";
import { HeaderClient } from "./HeaderClient";
import { ProcessosClient } from "./ProcessosClient";

import { fetchEmpresaInfo } from "../services/apiMock.ts";

interface DashboardClientProps {
  // TODO: no fluxo real, esse cnpj deve vir da sessão/autenticação do usuário
  cnpj: string;
}

export function DashboardClient({ cnpj }: DashboardClientProps) {
  const [empresaInfo, setEmpresaInfo] = useState<EmpresaInfo | null>(null);
  const [carregandoEmpresa, setCarregandoEmpresa] = useState(true);
  const [erroEmpresa, setErroEmpresa] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;

    async function carregarEmpresa() {
      setCarregandoEmpresa(true);
      setErroEmpresa(null);

      try {
        const dados = await fetchEmpresaInfo(cnpj);
        if (ativo) setEmpresaInfo(dados);
      } catch (err) {
        if (ativo) setErroEmpresa("Não foi possível carregar os dados da empresa.");
      } finally {
        if (ativo) setCarregandoEmpresa(false);
      }
    }

    carregarEmpresa();

    return () => {
      ativo = false;
    };
  }, [cnpj]);

  const handleLogout = () => {
    // TODO: integrar com o fluxo real de logout (limpar sessão/token e redirecionar para o login)
    console.log("logout");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-gray-200 px-4 py-8">
      <div className="mx-auto max-w-screen-2xl">
        {carregandoEmpresa && (
          <p className="py-10 text-center text-sm text-gray-500">
            Carregando dados da empresa...
          </p>
        )}

        {!carregandoEmpresa && erroEmpresa && (
          <p className="py-10 text-center text-sm text-red-600">
            {erroEmpresa}
          </p>
        )}

        {!carregandoEmpresa && !erroEmpresa && empresaInfo && (
          <>
            <HeaderClient
              empresa={empresaInfo.empresa}
              cnpj={empresaInfo.cnpj_cpf}
              email={empresaInfo.email}
              telefone={empresaInfo.telefone}
              onLogout={handleLogout}
            />

            <ProcessosClient cnpj={cnpj} />
          </>
        )}

        <div className="mt-8 text-center text-xs text-gray-500">
          © 2026 QSTECH. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
}

