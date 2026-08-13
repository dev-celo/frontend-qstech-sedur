import { AlertTriangle } from 'lucide-react';
import { useSedurLoginStatus } from '../hooks/useSedurLoginStatus';
import { jaFezLoginAlgumaVez } from '../lib/loginFlag';

export function SedurLoginAlert() {
  const { data, isLoading, isError } = useSedurLoginStatus();

  if (!jaFezLoginAlgumaVez()) return null;
  if (isLoading || isError) return null;

  const loginAtivo = data?.loginAtivo ?? false;
  if (loginAtivo) return null;

  return (
    <div
      role="alert"
      className="flex items-center gap-3 border-b border-amber-200 bg-amber-50 px-6 py-3"
    >
      <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" strokeWidth={2} />

      <p className="flex-1 text-sm font-medium text-amber-900">
        A sessão SEDUR expirou ou não está ativa.{' '}
        <span className="font-normal text-amber-700">
          É necessário fazer login novamente.
        </span>
      </p>
    </div>
  );
}
