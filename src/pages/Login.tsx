import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, KeyRound, UserPlus, Building2, Eye, EyeOff, Loader2 } from "lucide-react";
import { loginClient, requestError } from "@/services/clientApi";
import { formatCpfCnpj } from "@/utils/formatCpfCnpj";

export function Login() {
  const navigate = useNavigate()

  const [cnpj, setCnpj] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (cnpj.length < 11 || cnpj.length > 18) {
      setError("CPF/CNPJ inválido");
      return;
    }
    if (password.length < 8) {
      setError("Senha deve ter no mínimo 8 caracteres");
      return;
    }

    setLoading(true);

    try {
      const data = await loginClient(cnpj, password);

      if (data.token) {
        localStorage.setItem("client_token", data.token);
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof requestError ? err.message : "Não foi possível conectar ao servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-gray-200 px-4">
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
              Acesso ao sistema
            </h1>

            <p className="mt-2 text-center text-sm text-gray-600">
              Entre com suas credenciais para acessar o Dashboard QSTECH
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 py-4 px-8">

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                CNPJ/CPF
              </label>

              <div className="relative">
                <Building2
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={cnpj}
                  onChange={(e) => setCnpj(formatCpfCnpj(e.target.value))}
                  placeholder="00.000.000/0000-00"
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
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 w-full rounded-lg border border-gray-300 pl-4 pr-11 transition focus:border-green-500 focus:ring-2 focus:ring-green-500 outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>
            <button
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-green-600 font-medium text-white transition hover:bg-green-700"
              disabled={loading}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
              {loading ? "Entrando..." : "Entrar"}
            </button>

            <div className="flex justify-between text-sm">
              <Link
                to="/registrar"
                className="flex items-center gap-2 text-green-700 hover:underline"
              >
                <UserPlus size={16} />
                Criar conta
              </Link>

              <Link
                to="/redefinir-senha"
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
