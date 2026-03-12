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
    bgColor: 'bg-blue-50/50',
    borderColor: 'border-blue-100',
    headerBg: 'bg-blue-500',
  },
  convite: {
    icon: Mail,
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50/50',
    borderColor: 'border-amber-100',
    headerBg: 'bg-amber-500',
  },
  finalizado: {
    icon: CheckCircle2,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50/50',
    borderColor: 'border-green-100',
    headerBg: 'bg-green-500',
  },
};

export function KanbanColumn({ title, count, processos, type, index }: KanbanColumnProps) {
  const columnRef = useRef<HTMLDivElement>(null);
  const config = columnConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    if (columnRef.current) {
      gsap.fromTo(
        columnRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: index * 0.15,
          ease: 'power3.out',
        }
      );
    }
  }, [index]);

  return (
    <div
      ref={columnRef}
      className={`flex-shrink-0 w-full md:w-[380px] ${config.bgColor} rounded-2xl border ${config.borderColor} 
                  flex flex-col max-h-[calc(100vh-280px)]`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${config.color} shadow-lg`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-[#2c3e50]">{title}</h3>
              <p className="text-xs text-[#7f8c8d]">{count} processos</p>
            </div>
          </div>
          <span className={`text-lg font-bold bg-gradient-to-br ${config.color} bg-clip-text text-transparent`}>
            {count}
          </span>
        </div>
      </div>

      {/* Cards Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {processos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Icon className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm text-[#7f8c8d]">Nenhum processo encontrado</p>
          </div>
        ) : (
          processos.map((processo, idx) => (
            <KanbanCard key={processo.id} processo={processo} index={idx} />
          ))
        )}
      </div>
    </div>
  );
}
