import { useState } from 'react';
import { StopCircle, Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { resetarFlagLogin } from '../lib/loginFlag';

export function PararAutomacaoButton() {
  const [carregando, setCarregando] = useState(false);
  const queryClient = useQueryClient();

  async function handlePararAutomacao() {
    const confirmou = window.confirm(
      'Isso vai parar a extração automática. Você precisará fazer login novamente para reativar. Confirma?'
    );
    if (!confirmou) return;

    setCarregando(true);
    try {
      await api.pararAutomacao();

      resetarFlagLogin();
      queryClient.invalidateQueries({ queryKey: ['sedur-login-status'] });
    } catch (error) {
      console.error('Erro ao parar automação:', error);
      alert('Não foi possível parar a automação. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handlePararAutomacao}
      disabled={carregando}
      className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
    >
      {carregando ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <StopCircle className="h-4 w-4" />
      )}
      Parar automação
    </button>
  );
}
