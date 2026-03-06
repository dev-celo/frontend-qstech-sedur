import { useRef, useEffect, useState } from 'react';
import { Clock, Mail, CheckCircle2, Layers } from 'lucide-react';
import type { Resumo } from '@/types';
import gsap from 'gsap';

interface StatsCardsProps {
  resumo: Resumo;
  total: number;
}

interface StatItem {
  key: keyof Resumo | 'total';
  label: string;
  value: number;
  icon: React.ElementType;
  gradient: string;
  bgGradient: string;
}

export function StatsCards({ resumo, total }: StatsCardsProps) {
  const cardsRef = useRef<HTMLDivElement>(null);
  const [animatedValues, setAnimatedValues] = useState({
    andamento: 0,
    convite: 0,
    finalizado: 0,
    total: 0,
  });

  const stats: StatItem[] = [
    {
      key: 'andamento',
      label: 'Em Andamento',
      value: resumo.andamento,
      icon: Clock,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
    },
    {
      key: 'convite',
      label: 'Em Convite',
      value: resumo.convite,
      icon: Mail,
      gradient: 'from-amber-500 to-amber-600',
      bgGradient: 'from-amber-50 to-amber-100',
    },
    {
      key: 'finalizado',
      label: 'Finalizados',
      value: resumo.finalizado,
      icon: CheckCircle2,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
    },
    {
      key: 'total',
      label: 'Total de Processos',
      value: total,
      icon: Layers,
      gradient: 'from-[#27ae60] to-[#1e8449]',
      bgGradient: 'from-emerald-50 to-emerald-100',
    },
  ];

  useEffect(() => {
    // Animate cards entrance
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll('.stat-card');
      gsap.fromTo(
        cards,
        { rotateX: 45, opacity: 0, y: 30 },
        {
          rotateX: 0,
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.2,
        }
      );
    }

    // Animate numbers
    const duration = 1500;
    const startTime = Date.now();

    const animateNumbers = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedValues({
        andamento: Math.round(resumo.andamento * easeOut),
        convite: Math.round(resumo.convite * easeOut),
        finalizado: Math.round(resumo.finalizado * easeOut),
        total: Math.round(total * easeOut),
      });

      if (progress < 1) {
        requestAnimationFrame(animateNumbers);
      }
    };

    const timer = setTimeout(() => {
      requestAnimationFrame(animateNumbers);
    }, 500);

    return () => clearTimeout(timer);
  }, [resumo, total]);

  return (
    <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.key}
            className="stat-card group relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100 
                       hover:shadow-lg transition-all duration-300 overflow-hidden"
            style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 
                            group-hover:opacity-100 transition-opacity duration-300`} />

            {/* Content */}
            <div className="relative">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg 
                                group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className={`text-3xl font-bold bg-gradient-to-br ${stat.gradient} 
                                  bg-clip-text text-transparent`}>
                  {animatedValues[stat.key]}
                </span>
              </div>
              <p className="text-sm text-[#7f8c8d] font-medium">{stat.label}</p>
            </div>

            {/* Decorative Line */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} 
                            transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 
                            origin-left`} />
          </div>
        );
      })}
    </div>
  );
}
