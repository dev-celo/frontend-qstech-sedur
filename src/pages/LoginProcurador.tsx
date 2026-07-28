import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, KeyRound, UserPlus, User, Eye, EyeOff, Loader2, Home } from "lucide-react";
import { formatCpfCnpj } from "../utils/formatCpfCnpj";
import { loginProcurador, requestError } from "../services/procuradorApi.ts";

export function LoginProcurador() {
  const navigate = useNavigate();

  const [cnpj, setCnpj] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!cnpj || !senha) {
      setError("Preencha CPF e senha");
      return;
    }

    setLoading(true);
    try {
      await loginProcurador(cnpj, senha);
      navigate("/procurador/dashboard");
    } catch (err) {
      setError(err instanceof requestError ? err.message : "Não foi possível fazer login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-gray-200 px-4">
      <Link
        to="/"
        className="fixed left-4 top-4 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-gray-600 shadow-sm transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
      >
        <Home size={18} />
        Início
      </Link>

      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
          {/* Header */}
          <div className="py-4 px-8">
            <div className="flex justify-center">
              <img
                src="/logo-qstech-nome-qstech-consultoria&gestao-ambientalverde.png"
                alt="QSTECH"
                className="h-32 object-contain"
              />
            </div>

            <h1 className="text-center text-3xl font-bold text-gray-700">
              Acesso do procurador
            </h1>

            <p className="mt-2 text-center text-sm text-gray-600">
              Entre com seu CPF e senha para acompanhar seus processos
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5 py-4 px-8">

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                CPF
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={cnpj}
                  onChange={(e) => setCnpj(formatCpfCnpj(e.target.value))}
                  placeholder="000.000.000-00"
                  className="h-12 w-full rounded-lg border border-gray-300 px-4 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Senha
              </label>

              <div className="relative">
                <input
                  type={showSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 w-full rounded-lg border border-gray-300 pl-4 pr-11 transition focus:border-green-500 focus:ring-2 focus:ring-green-500 outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowSenha(!showSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600"
                >
                  {showSenha ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-green-600 font-medium text-white transition hover:bg-green-700"
              disabled={loading}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
              {loading ? "Entrando..." : "Entrar"}
            </button>

            <div className="flex justify-between text-sm">
              <Link
                to="/procurador/registrar"
                className="flex items-center gap-2 text-green-700 hover:underline"
              >
                <UserPlus size={16} />
                Criar conta
              </Link>

              <Link
                to="/procurador/redefinir-senha"
                className="flex items-center gap-2 text-green-700 hover:underline"
              >
                <KeyRound size={16} />
                Esqueci minha senha
              </Link>
            </div>
          </form>

          <div className="border-t px-8 py-5 text-center text-xs text-gray-500">
            © 2026 QSTECH. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </div>
  );
}
