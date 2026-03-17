import { useState, useRef, useEffect } from 'react';
import { RefreshCw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';

interface UpdateButtonProps {
  lastUpdate: string;
  onUpdate: () => void;
  loading?: boolean; // Nova prop opcional
}

export function UpdateButton({ lastUpdate, onUpdate, loading = false }: UpdateButtonProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isUpdating && iconRef.current) {
      gsap.to(iconRef.current, {
        rotation: 360,
        duration: 1,
        repeat: -1,
        ease: 'none',
      });
    } else if (iconRef.current) {
      gsap.killTweensOf(iconRef.current);
      gsap.to(iconRef.current, { rotation: 0, duration: 0.3 });
    }
  }, [isUpdating]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    
    // Chama a função de update (agora a lógica de carregamento vem de fora)
    await onUpdate();
    
    setIsUpdating(false);
    setShowSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Determina se está em estado de carregamento (prop externa ou interno)
  const estaCarregando = loading || isUpdating;

  return (
    <div className="flex items-center gap-4">
      {/* Last Update Info */}
      <div className="hidden sm:flex flex-col items-end">
        <span className="text-xs text-[#7f8c8d]">Última atualização</span>
        <span className="text-sm font-medium text-[#2c3e50]">
          {formatDate(lastUpdate)}
        </span>
      </div>

      {/* Update Button */}
      <div className="relative">
        <Button
          ref={buttonRef}
          onClick={handleUpdate}
          disabled={estaCarregando}
          className={`relative h-11 px-4 rounded-xl font-medium transition-all duration-300 ${
            estaCarregando
              ? 'bg-[#27ae60]/80 cursor-not-allowed'
              : showSuccess
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-[#27ae60] hover:bg-[#1e8449]'
          } text-white shadow-lg shadow-[#27ae60]/25 hover:shadow-xl hover:shadow-[#27ae60]/30`}
        >
          <div ref={iconRef} className="mr-2">
            {showSuccess && !estaCarregando ? (
              <Check className="w-4 h-4" />
            ) : (
              <RefreshCw className={`w-4 h-4 ${estaCarregando ? 'animate-spin' : ''}`} />
            )}
          </div>
          <span>
            {estaCarregando
              ? 'Buscando dados...'
              : showSuccess
              ? 'Atualizado!'
              : 'Atualizar dados'}
          </span>
        </Button>

        {/* Success Tooltip */}
        {showSuccess && !estaCarregando && (
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-green-500 text-white 
                          text-xs px-3 py-1.5 rounded-lg whitespace-nowrap animate-in fade-in slide-in-from-top-2">
            Dados atualizados com sucesso!
          </div>
        )}
      </div>
    </div>
  );
}