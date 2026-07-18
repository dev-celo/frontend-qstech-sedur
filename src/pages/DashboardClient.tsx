import { useEffect, useState } from "react";
import type { EmpresaInfo } from "../types/clientTypes.ts";

import { fetchMeClient } from "@/services/clientApi.ts";
import { HeaderClient } from "@/components/HeaderClient.tsx";
import { ProcessosClient } from "@/components/ProcessosClient.tsx";
import { useNavigate } from "react-router-dom";
import { clearToken } from "@/services/clientApi.ts";


export function DashboardClient() {
  const [empresaInfo, setEmpresaInfo] = useState<EmpresaInfo | null>(null);
  const [carregandoEmpresa, setCarregandoEmpresa] = useState(true);
  const [erroEmpresa, setErroEmpresa] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    let ativo = true;

    async function carregarEmpresa() {
      setCarregandoEmpresa(true);
      setErroEmpresa(null);

      try {
        const dados = await fetchMeClient();
        if (ativo) {
          setEmpresaInfo({
            empresa: dados.nome,
            cnpj_cpf: dados.cnpj_cpf,
            email: dados.email,
            telefone: dados.telefone ?? "",
          });
        }
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
  }, []);

  const handleLogout = () => {
    clearToken();
    navigate("/login");
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

            <ProcessosClient />
          </>
        )}

        <div className="mt-8 text-center text-xs text-gray-500">
          © 2026 QSTECH. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
}
