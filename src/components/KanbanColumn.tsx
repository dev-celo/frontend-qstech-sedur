import { useRef, useEffect } from 'react';
import { KanbanCard } from './KanbanCard';
import type { Processo } from '@/types';
import { Clock, Mail, CheckCircle2 } from 'lucide-react';
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
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50/30',
    borderColor: 'border-blue-200',
    headerBg: 'bg-gradient-to-r from-blue-500 to-blue-600',
  },
  convite: {
    icon: Mail,
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50/30',
    borderColor: 'border-amber-200',
    headerBg: 'bg-gradient-to-r from-amber-500 to-amber-600',
  },
  finalizado: {
    icon: CheckCircle2,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50/30',
    borderColor: 'border-green-200',
    headerBg: 'bg-gradient-to-r from-green-500 to-green-600',
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
  const config = columnConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    if (columnRef.current) {
      gsap.fromTo(
        columnRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          delay: index * 0.1,
          ease: "power2.out",
        }
      );
    }
  }, [index]);

  const processosPorData = processos.reduce((acc, p) => {
    const data = p.ultima_tramitacao?.data?.split(' ')[0] || 'Sem data';
    acc[data] = (acc[data] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div
      ref={columnRef}
      className={`
        flex-1 min-w-[350px] max-w-[400px] 
        ${config.bgColor} 
        rounded-xl border ${config.borderColor}
        flex flex-col 
        
        /* 👇 MAIS ALTURA */
        h-[calc(110vh)]
        
        /* 👇 RESPIRO PRO FOOTER */
        mb-10 md:mb-16
      `}
    >
      {/* Header */}
      <div className={`${config.headerBg} p-4 rounded-t-xl text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{title}</h3>
              <p className="text-xs text-white/80">
                {count} processos • últimos 7 dias
              </p>
            </div>
          </div>
          <span className="text-3xl font-bold text-white drop-shadow-lg">
            {count}
          </span>
        </div>

        {Object.keys(processosPorData).length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {Object.entries(processosPorData)
              .sort((a, b) => b[0].localeCompare(a[0]))
              .slice(0, 3)
              .map(([data, qtd]) => (
                <span key={data} className="text-[10px] bg-white/20 px-2 py-1 rounded-full">
                  {data}: {qtd}
                </span>
              ))}
          </div>
        )}
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {processos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center bg-white/50 rounded-xl border-2 border-dashed border-gray-200 p-8">
            <Icon className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-sm text-[#7f8c8d] font-medium">Sem processos</p>
            <p className="text-xs text-gray-400 mt-1">nos últimos 7 dias</p>
          </div>
        ) : (
          processos.map((processo, idx) => (
            <KanbanCard 
              key={processo.id} 
              processo={processo} 
              index={idx}
            />
          ))
        )}
      </div>
    </div>
  );
}