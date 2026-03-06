import { useEffect, useRef } from 'react';
import { Leaf, Shield, Zap, Globe, Target, Heart } from 'lucide-react';
import gsap from 'gsap';

const features = [
  {
    icon: Leaf,
    title: 'Sustentabilidade',
    description: 'Comprometidos com a preservação ambiental e o desenvolvimento sustentável de nossa cidade.',
    color: 'from-green-500 to-emerald-600',
  },
  {
    icon: Shield,
    title: 'Segurança',
    description: 'Dados protegidos com as mais avançadas tecnologias de segurança e criptografia.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Zap,
    title: 'Eficiência',
    description: 'Processos otimizados para agilizar o licenciamento ambiental e reduzir burocracia.',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: Globe,
    title: 'Transparência',
    description: 'Acesso público às informações sobre processos ambientais em andamento.',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    icon: Target,
    title: 'Precisão',
    description: 'Dados atualizados em tempo real diretamente da base da Sedur.',
    color: 'from-purple-500 to-violet-600',
  },
  {
    icon: Heart,
    title: 'Compromisso',
    description: 'Dedicados a servir a comunidade com excelência e responsabilidade.',
    color: 'from-rose-500 to-pink-600',
  },
];

export function Sobre() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero animation
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.querySelectorAll('.animate-item'),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
      );
    }

    // Features animation
    if (featuresRef.current) {
      const cards = featuresRef.current.querySelectorAll('.feature-card');
      gsap.fromTo(
        cards,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 80%',
          },
        }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Hero Section */}
      <div ref={heroRef} className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="animate-item inline-block px-4 py-1.5 bg-[#27ae60]/10 text-[#27ae60] 
                           rounded-full text-sm font-medium mb-6">
            Sobre a Plataforma
          </span>
          <h1 className="animate-item text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2c3e50] mb-6">
            EcoSedur
          </h1>
          <p className="animate-item text-lg sm:text-xl text-[#7f8c8d] leading-relaxed max-w-2xl mx-auto">
            Uma plataforma moderna e intuitiva para gestão e monitoramento de processos ambientais, 
            desenvolvida para facilitar o acesso às informações da Secretaria de Desenvolvimento 
            Urbano (Sedur).
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#2c3e50] mb-6">
                Nossa Missão
              </h2>
              <p className="text-[#7f8c8d] leading-relaxed mb-6">
                Facilitar o acesso às informações sobre processos ambientais, promovendo 
                transparência e eficiência na gestão ambiental urbana. Acreditamos que 
                a tecnologia pode ser uma aliada poderosa na preservação do meio ambiente.
              </p>
              <p className="text-[#7f8c8d] leading-relaxed">
                A EcoSedur foi desenvolvida com foco na experiência do usuário, 
                oferecendo uma interface moderna e intuitiva que permite visualizar 
                e acompanhar processos de forma simples e eficiente.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#27ae60]/20 to-[#1e8449]/20 
                              rounded-3xl transform rotate-3" />
              <div className="relative bg-gradient-to-br from-[#27ae60] to-[#1e8449] rounded-3xl p-8 
                              text-white">
                <Leaf className="w-16 h-16 mb-6 opacity-80" />
                <blockquote className="text-xl font-medium leading-relaxed">
                  "A preservação do meio ambiente não é apenas uma responsabilidade, 
                  é um compromisso com o futuro das próximas gerações."
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div ref={featuresRef} className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#2c3e50] mb-4">
              Por que escolher a EcoSedur?
            </h2>
            <p className="text-[#7f8c8d] max-w-2xl mx-auto">
              Nossa plataforma foi desenvolvida com as melhores práticas de usabilidade 
              e tecnologia para oferecer uma experiência excepcional.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="feature-card group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 
                             hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} 
                                   flex items-center justify-center mb-4 
                                   group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#2c3e50] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#7f8c8d] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1e8449] to-[#166534]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: '30+', label: 'Processos Monitorados' },
              { value: '3', label: 'Categorias' },
              { value: '24/7', label: 'Atualizações' },
              { value: '100%', label: 'Transparência' },
            ].map((stat, index) => (
              <div key={index} className="text-white">
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
