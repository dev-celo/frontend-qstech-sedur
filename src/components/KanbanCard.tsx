import { useRef, useEffect } from 'react';
import { Calendar, FileText } from 'lucide-react';
import type { Processo } from '@/types';
import gsap from 'gsap';

interface KanbanCardProps {
  processo: Processo;
  index: number;
}

export function KanbanCard({ processo, index }: KanbanCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          delay: index * 0.05,
          ease: 'power3.out',
        }
      );
    }
  }, [index]);

  const getStageColor = (estagio: string) => {
    switch (estagio.toLowerCase()) {
      case 'encaminhado':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'em convite':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'finalizado':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div
      ref={cardRef}
      className="group bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100 
                 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer
                 relative overflow-hidden"
    >
      {/* Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent 
                      -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

      <div className="relative space-y-3">
        {/* Protocolo */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#27ae60]" />
            <span className="text-xs font-mono text-[#7f8c8d]">
              {processo.protocolo}
            </span>
          </div>
        </div>

        {/* Serviço */}
        <h4 className="text-sm font-medium text-[#2c3e50] line-clamp-2 group-hover:text-[#27ae60] transition-colors">
          {processo.servico}
        </h4>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <div className="flex items-center gap-1.5 text-xs text-[#7f8c8d]">
            <Calendar className="w-3.5 h-3.5" />
            <span>{processo.data}</span>
          </div>
          
          <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getStageColor(processo.estagio)}`}>
            {processo.estagio}
          </span>
        </div>
      </div>
    </div>
  );
}
