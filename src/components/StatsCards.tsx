import { useRef, useEffect, useState } from 'react';
import { FileText, Clock, Mail, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';

interface StatsCardsProps {
  resumo: {
    andamento: number;
    convite: number;
    finalizado: number;
  };
  total: number;
}

export default function StatsCards({ resumo, total }: StatsCardsProps) {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [displayTotals, setDisplayTotals] = useState({
    total: 0,
    andamento: 0,
    convite: 0,
    finalizado: 0,
  });

  useEffect(() => {
    // Anima cada contador individualmente
    const animateValue = (start: number, end: number, setter: (value: number) => void) => {
      gsap.to({ value: start }, {
        value: end,
        duration: 0.6,
        ease: "power2.out",
        onUpdate: function() {
          setter(Math.floor(this.targets()[0].value));
        },
      });
    };

    animateValue(0, total, (v) => setDisplayTotals(prev => ({ ...prev, total: v })));
    animateValue(0, resumo.andamento, (v) => setDisplayTotals(prev => ({ ...prev, andamento: v })));
    animateValue(0, resumo.convite, (v) => setDisplayTotals(prev => ({ ...prev, convite: v })));
    animateValue(0, resumo.finalizado, (v) => setDisplayTotals(prev => ({ ...prev, finalizado: v })));
  }, [total, resumo.andamento, resumo.convite, resumo.finalizado]);

  useEffect(() => {
    cardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.fromTo(
          card,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            delay: index * 0.05,
            ease: 'power2.out',
          }
        );
      }
    });
  }, []);

  const stats = [
    {
      title: 'Total',
      value: displayTotals.total,
      icon: FileText,
      dotColor: 'bg-slate-400',
      textColor: 'text-slate-600',
      bgColor: 'bg-slate-50',
    },
    {
      title: 'Andamento',
      value: displayTotals.andamento,
      icon: Clock,
      dotColor: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Convite',
      value: displayTotals.convite,
      icon: Mail,
      dotColor: 'bg-amber-500',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Finalizados',
      value: displayTotals.finalizado,
      icon: CheckCircle2,
      dotColor: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
  ];

  const maxValue = Math.max(total, resumo.andamento, resumo.convite, resumo.finalizado);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const percentual = maxValue > 0 ? (stat.value / maxValue) * 100 : 0;
        
        return (
          <div
            key={stat.title}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
            className={`${stat.bgColor} rounded-xl p-3 border border-slate-100 transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${stat.dotColor}`} />
                  <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">
                    {stat.title}
                  </p>
                </div>
                <p className={`text-xl font-bold ${stat.textColor} mt-0.5 tabular-nums`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-1.5 rounded-lg ${stat.bgColor} shadow-sm transition-transform duration-200 group-hover:scale-105`}>
                <Icon className={`w-3.5 h-3.5 ${stat.textColor}`} />
              </div>
            </div>
            <div className="mt-2">
              <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                <div
                  className={`h-1 rounded-full ${stat.dotColor} transition-all duration-500 ease-out`}
                  style={{ width: `${percentual}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}