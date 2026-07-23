import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  registroClient,
  gerarCodigoClient,
  validarCodigoClient,
  requestError,
  redefinirSenhaClient
} from '../services/clientApi.ts'
import { cpfCnpjValido } from '../utils/formatCpfCnpj'

export const STEP_META = [{ label: "CNPJ" }, { label: "Código" }, { label: "Senha" }];

export const stepTitles: Record<number, string> = {
  1: "Informe seu CNPJ ou CPF",
  2: "Valide seu código",
  3: "Crie sua senha",
};

export const stepSubtitles: Record<number, string> = {
  1: "Digite o CNPJ da sua empresa ou o CPF do responsável.",
  2: "Digite o código enviado para o e-mail cadastrado.",
  3: "Defina uma senha segura para acessar o sistema.",
};

type Proposito = 'registro' | 'recuperacao_senha';

export function useCliente(proposito: Proposito, errorMessager: string) {
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

  const [reenviando, setReenviando] = useState(false);
  const [reenviado, setReenviado] = useState(false);

  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  const canSubmit =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const cnpjValido = cpfCnpjValido(cnpj);

  const handleGerarCodigo = async () => {
    setError(null);
    if (!cnpjValido) {
      setError("CPF/CNPJ inválido");
      return;
    }

    setLoading(true);
    try {
      await gerarCodigoClient(cnpj, proposito);
      setStep(2);
    } catch (err) {
      if (err instanceof requestError && err.status === 409) {
        setError(errorMessager);
      } else {
        setError(err instanceof requestError ? err.message : "Não foi possível gerar o código.");
      }
    } finally {
      setLoading(false);
    }
  }

  const handleReenviarCodigo = async () => {
    setError(null);
    setReenviado(false);
    setReenviando(true);
    try {
      await gerarCodigoClient(cnpj, proposito);
      setReenviado(true);
    } catch (err) {
      setError(err instanceof requestError ? err.message : "Não foi possível reenviar o código.");
    } finally {
      setReenviando(false);
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
      await validarCodigoClient(cnpj, codigo, proposito);
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
      navigate("/");
    } catch (err) {
      setError(err instanceof requestError ? err.message : "Não foi possível criar a conta.");
    } finally {
      setLoading(false);
    }
  };

  const handleRedefinirSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!canSubmit) return;

    setLoading(true);
    try {
      await redefinirSenhaClient(cnpj, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof requestError ? err.message : "Não foi possível redefinir a senha.");
    } finally {
      setLoading(false);
    }
  };


  return {
    step, setStep,
    cnpj, setCnpj,
    codigo, setCodigo,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    showPassword, setShowPassword,
    showConfirmPassword, setShowConfirmPassword,

    loading, error,
    reenviando, reenviado,

    passwordsMismatch, canSubmit, cnpjValido,
    handleGerarCodigo, handleReenviarCodigo, handleValidarCodigo, handleRegistrar, handleRedefinirSenha
  };
}
