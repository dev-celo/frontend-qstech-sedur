// components/StatsCards.tsx
import { useRef, useEffect } from 'react';
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

// Export default direto na função
export default function StatsCards({ resumo, total }: StatsCardsProps) {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    cardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.fromTo(
          card,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            delay: index * 0.1,
            ease: 'power3.out',
          }
        );
      }
    });
  }, []);

  const stats = [
    {
      title: 'Total de Processos',
      value: total,
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Em Andamento',
      value: resumo.andamento,
      icon: Clock,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Em Convite',
      value: resumo.convite,
      icon: Mail,
      color: 'from-amber-500 to-amber-600',
    },
    {
      title: 'Finalizados',
      value: resumo.finalizado,
      icon: CheckCircle2,
      color: 'from-green-500 to-green-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#7f8c8d] mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-[#2c3e50]">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full bg-gradient-to-r ${stat.color}`}
                  style={{
                    width: `${total > 0 ? (stat.value / total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}