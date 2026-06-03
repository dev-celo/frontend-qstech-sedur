import { useRef, useEffect, useState } from 'react';
import { KanbanCard } from './KanbanCard';
import type { Processo } from '@/types';
import { Clock, Mail, CheckCircle2, Circle } from 'lucide-react';
import gsap from 'gsap';

interface KanbanColumnProps {
  title: string;
  count: number;
  processos: Processo[];
  type: 'andamento' | 'convite' | 'finalizado';
  index: number;
}

const columnConfig = {
  andamento: {
    icon: Clock,
    dotColor: 'text-blue-500',
    countColor: 'text-blue-600',
  },
  convite: {
    icon: Mail,
    dotColor: 'text-amber-500',
    countColor: 'text-amber-600',
  },
  finalizado: {
    icon: CheckCircle2,
    dotColor: 'text-emerald-500',
    countColor: 'text-emerald-600',
  },
};

export function KanbanColumn({ 
  title, 
  count, 
  processos, 
  type, 
  index 
}: KanbanColumnProps) {
  const columnRef = useRef<HTMLDivElement>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(0);
  const config = columnConfig[type];
  const Icon = config.icon;

  // Animação de entrada da coluna
  useEffect(() => {
    if (columnRef.current) {
      gsap.fromTo(
        columnRef.current,
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          delay: index * 0.06,
          ease: "power2.out",
        }
      );
    }
  }, [index]);

  // Animação de contagem
  useEffect(() => {
    const obj = { value: displayCount };
    gsap.to(obj, {
      value: count,
      duration: 0.6,
      ease: "power2.out",
      onUpdate: () => setDisplayCount(Math.floor(obj.value)),
      onComplete: () => setDisplayCount(count),
    });
  }, [count]);

  return (
    <div
      ref={columnRef}
      className="flex-1 min-w-[360px] max-w-[440px] bg-transparent flex flex-col h-[calc(100vh-240px)] min-h-[500px]"
    >
      {/* Header minimalista */}
      <div className="px-4 pb-4 mb-2">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Circle className={`w-2 h-2 ${config.dotColor} fill-current`} />
            <h3 className="font-medium text-[14px] text-slate-600 tracking-tight">
              {title}
            </h3>
          </div>
          <span className={`text-sm font-semibold ${config.countColor}`}>
            {displayCount}
          </span>
        </div>
        <p className="text-[10px] text-slate-400">
          processos ativos
        </p>
      </div>

      {/* Cards com efeito de foco */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {processos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center bg-white/40 rounded-2xl border border-dashed border-slate-200 p-8">
            <Icon className="w-8 h-8 text-slate-300 mb-2" />
            <p className="text-sm text-slate-400">Nenhum processo</p>
          </div>
        ) : (
          processos.map((processo, idx) => (
            <div
              key={processo.id}
              style={{
                opacity: hoveredCardId && hoveredCardId !== processo.id ? 0.85 : 1,
                transition: "opacity 250ms cubic-bezier(0.2, 0, 0, 1)",
              }}
            >
              <KanbanCard 
                processo={processo} 
                index={idx}
                isHovered={hoveredCardId === processo.id}
                onHover={setHoveredCardId}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}