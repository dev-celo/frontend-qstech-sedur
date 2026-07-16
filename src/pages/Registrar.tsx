import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  ShieldCheck,
  ArrowLeft,
  EyeOff,
  Eye,
  CheckCircle2,
  UserPlus,
  Loader2,
} from "lucide-react";
import {
  registroClient,
  gerarCodigoClient,
  validarCodigoClient,
  requestError
} from '../services/clientApi.ts'
import { formatCpfCnpj, cpfCnpjValido } from '../utils/formatCpfCnpj'

const STEP_META = [{ label: "CNPJ" }, { label: "Código" }, { label: "Senha" }];

export function Registrar() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [cnpj, setCnpj] = useState("");
  const [codigo, setCodigo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  const canSubmit =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const stepTitles: Record<number, string> = {
    1: "Informe seu CNPJ ou CPF",
    2: "Valide seu código",
    3: "Crie sua senha",
  };

  const stepSubtitles: Record<number, string> = {
    1: "Digite o CNPJ da sua empresa ou o CPF do responsável.",
    2: "Digite o código enviado para o e-mail cadastrado.",
    3: "Defina uma senha segura para acessar o sistema.",
  };

  const cnpjValido = cpfCnpjValido(cnpj);

  const handleGerarCodigo = async () => {
    setError(null);
    if (!cnpjValido) {
      setError("CPF/CNPJ inválido");
      return;
    }

    setLoading(true);
    try {
      await gerarCodigoClient(cnpj);
      setStep(2);
    } catch (err) {
      if (err instanceof requestError && err.status === 409) {
        setError("Já existe uma conta cadastrada com esse CNPJ/CPF. Tente fazer login.");
      } else {
        setError(err instanceof requestError ? err.message : "Não foi possível gerar o código.");
      }
    } finally {
      setLoading(false);
    }
  }

  const handleValidarCodigo = async () => {
    setError(null);
    if (codigo.length !== 6) {
      setError("Digite o código de 6 dígitos");
      return;
    }

    setLoading(true);
    try {
      await validarCodigoClient(cnpj, codigo, 'registro');
      setStep(3);
    } catch (err) {
      setError(err instanceof requestError ? err.message : "Código inválido.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!canSubmit) return;

    setLoading(true);
    try {
      await registroClient(cnpj, password);
      navigate("/login");
    } catch (err) {
      setError(err instanceof requestError ? err.message : "Não foi possível criar a conta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-gray-200 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Crie sua conta</h1>
          <p className="mt-2 text-sm text-gray-600">
            Siga os passos abaixo para criar sua conta de acesso
          </p>

          <div className="mt-6 flex items-center justify-center">
            {STEP_META.map((item, index) => {
              const number = index + 1;
              return (
                <div key={item.label} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all
                        ${step >= number
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-500"
                        }`}
                    >
                      {number}
                    </div>

                    <span className="mt-2 text-xs font-medium text-gray-600">
                      {item.label}
                    </span>
                  </div>

                  {index < STEP_META.length - 1 && (
                    <div
                      className={`mb-5 mx-2 h-[2px] w-16 transition-colors
                        ${step > number ? "bg-green-600" : "bg-gray-200"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
          <div className="px-8 pt-6 pb-2">

            <div className="mt-3 flex justify-center">
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                Passo {step} de 3
              </span>
            </div>

            <h2 className="mt-3 text-center text-xl font-bold text-gray-800">
              {stepTitles[step]}
            </h2>

            <p className="mt-1 text-center text-sm text-gray-500">
              {stepSubtitles[step]}
            </p>
          </div>

          <form onSubmit={handleRegistrar} className="space-y-5 px-8 py-5">

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-center text-red-600">
                {error}
              </div>
            )}

            {step === 1 && (
              <>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    CNPJ
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

                <div className="rounded-lg border border-green-100 bg-green-50 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 text-green-600" size={18} />

                    <p className="text-xs text-green-700">
                      Após gerar o código, você receberá instruções para
                      validá-lo.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGerarCodigo}
                  disabled={!cnpjValido || loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-green-600 disabled:bg-slate-500 font-medium text-white transition hover:bg-green-700"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                  {loading ? "Enviando..." : "Continuar"}
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Código de verificação
                  </label>

                  <input
                    value={codigo}
                    onChange={(e) =>
                      setCodigo(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="Digite o código de 6 dígitos"
                    maxLength={6}
                    inputMode="numeric"
                    className="h-12 w-full rounded-lg border border-gray-300 px-4 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="rounded-lg border border-green-100 bg-green-50 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 text-green-600" size={18} />

                    <p className="text-xs text-green-700">
                      Caso não tenha recebido o código, verifique sua caixa de
                      spam.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <ArrowLeft size={18} />
                    Voltar
                  </button>

                  <button
                    type="button"
                    onClick={handleValidarCodigo}
                    disabled={codigo.length !== 6 || loading}
                    className="flex h-12 flex-[1.5] items-center justify-center gap-2 rounded-lg bg-green-600 disabled:bg-slate-500 font-medium text-white transition hover:bg-green-700"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                    {loading ? "Validando..." : "Validar e continuar"}
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Senha
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Digite sua senha"
                      className="h-12 w-full rounded-lg border border-gray-300 px-4 pr-11 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Confirmar senha
                  </label>

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirme sua senha"
                      className={`h-12 w-full rounded-lg border px-4 pr-11 outline-none transition focus:ring-2
                        ${passwordsMismatch
                          ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                        }`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  {passwordsMismatch && (
                    <p className="mt-2 text-xs text-red-600">
                      As senhas não coincidem.
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <ArrowLeft size={18} />
                    Voltar
                  </button>

                  <button
                    type="submit"
                    disabled={!canSubmit || loading || password.length < 8}
                    className="flex h-12 flex-[1.6] items-center justify-center gap-2 rounded-lg bg-green-600 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:hover:bg-gray-300"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
                    {loading ? "Criando..." : "Criar conta"}
                  </button>
                </div>
              </>
            )}
          </form>

          <div className="border-t px-8 py-5 text-center text-xs text-gray-500">
            © 2026 QSTECH. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </div>
  );
}
