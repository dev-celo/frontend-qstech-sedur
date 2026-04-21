import { useEffect, useRef } from 'react';
import { MapPin, Navigation, Clock, Car, Bus, Train } from 'lucide-react';
import gsap from 'gsap';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export function Localizacao() {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.querySelectorAll('.animate-item'),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
      );
    }

    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.querySelectorAll('.location-card'),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.3 }
      );
    }
  }, []);

  const transportOptions = [
    {
      icon: Car,
      title: 'De Carro',
      description: 'Estacionamento disponível no local',
      details: 'Acesso pela Av. Paralela ou Av. Luís Viana',
    },
    {
      icon: Bus,
      title: 'Ônibus',
      description: 'Linhas que passam próximo',
      details: 'Consulte o app Salvador por mim',
    },
    {
      icon: Train,
      title: 'Metrô',
      description: 'Estação mais próxima',
      details: 'Estação Detran (linha 1)',
    },
  ];

  return (
    <>
    <Header />
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Hero Section */}
      <div ref={heroRef} className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="animate-item inline-block px-4 py-1.5 bg-[#27ae60]/10 text-[#27ae60] 
                           rounded-full text-sm font-medium mb-6">
            Onde Estamos
          </span>
          <h1 className="animate-item text-4xl sm:text-5xl font-bold text-[#2c3e50] mb-6">
            Nossa Localização
          </h1>
          <p className="animate-item text-lg text-[#7f8c8d] leading-relaxed max-w-2xl mx-auto">
            Visite nosso escritório central em Salvador. Estamos localizados em uma 
            área de fácil acesso, próximo aos principais pontos da cidade.
          </p>
        </div>
      </div>

      {/* Map and Info Section */}
      <div ref={contentRef} className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Map Placeholder */}
            <div className="lg:col-span-2 location-card">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[400px] lg:h-[500px]">
                {/* Simulated Map */}
                <div className="relative w-full h-full bg-gradient-to-br from-gray-100 to-gray-200">
                  {/* Map Grid Pattern */}
                  <div className="absolute inset-0 opacity-30">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <defs>
                        <pattern id="mapGrid" width="5" height="5" patternUnits="userSpaceOnUse">
                          <path d="M 5 0 L 0 0 0 5" fill="none" stroke="#27ae60" strokeWidth="0.3"/>
                        </pattern>
                      </defs>
                      <rect width="100" height="100" fill="url(#mapGrid)" />
                    </svg>
                  </div>

                  {/* Roads */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="0" y1="40" x2="100" y2="40" stroke="white" strokeWidth="3" />
                    <line x1="0" y1="70" x2="100" y2="70" stroke="white" strokeWidth="2" />
                    <line x1="30" y1="0" x2="30" y2="100" stroke="white" strokeWidth="2" />
                    <line x1="60" y1="0" x2="60" y2="100" stroke="white" strokeWidth="3" />
                  </svg>

                  {/* Location Pin */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#27ae60] rounded-full blur-xl opacity-30 animate-pulse" />
                      <div className="relative bg-gradient-to-br from-[#27ae60] to-[#1e8449] p-4 rounded-full shadow-lg">
                        <MapPin className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#1e8449] rotate-45 -z-10" />
                    </div>
                  </div>

                  {/* Map Controls */}
                  <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                    <button className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                      <Navigation className="w-5 h-5 text-[#27ae60]" />
                    </button>
                  </div>

                  {/* Location Label */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-md">
                    <p className="text-sm font-medium text-[#2c3e50]">EcoSedur</p>
                    <p className="text-xs text-[#7f8c8d]">Centro Administrativo</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Cards */}
            <div className="space-y-6">
              {/* Address Card */}
              <div className="location-card bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#27ae60] to-[#1e8449] 
                                flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[#2c3e50] mb-2">
                  Endereço
                </h3>
                <p className="text-[#7f8c8d] text-sm leading-relaxed mb-4">
                  Centro Administrativo da Bahia<br />
                  Bloco B, 3º Andar<br />
                  Salvador - BA, 41745-002
                </p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-[#27ae60] hover:text-[#1e8449] font-medium"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Ver no Google Maps
                </a>
              </div>

              {/* Hours Card */}
              <div className="location-card bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 
                                flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[#2c3e50] mb-2">
                  Horário de Funcionamento
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#7f8c8d]">Segunda - Sexta</span>
                    <span className="font-medium text-[#2c3e50]">08:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7f8c8d]">Sábado</span>
                    <span className="font-medium text-[#2c3e50]">Fechado</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7f8c8d]">Domingo</span>
                    <span className="font-medium text-[#2c3e50]">Fechado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transport Options */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[#2c3e50] mb-6 text-center">
              Como Chegar
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {transportOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <div
                    key={index}
                    className="location-card bg-white rounded-2xl p-6 shadow-sm border border-gray-100 
                               hover:shadow-lg transition-all duration-300 text-center group"
                  >
                    <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[#27ae60] to-[#1e8449] 
                                    flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#2c3e50] mb-1">
                      {option.title}
                    </h3>
                    <p className="text-sm text-[#27ae60] font-medium mb-1">
                      {option.description}
                    </p>
                    <p className="text-sm text-[#7f8c8d]">
                      {option.details}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Nearby Landmarks */}
          <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[#2c3e50] mb-6">
              Pontos de Referência Próximos
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                'Shopping Bela Vista',
                'Parque da Cidade',
                'Estação Detran (Metrô)',
                'Hospital Geral do Estado',
              ].map((landmark, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-[#27ae60]/5 
                             transition-colors cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#27ae60]/10 flex items-center justify-center 
                                  group-hover:bg-[#27ae60] transition-colors">
                    <MapPin className="w-4 h-4 text-[#27ae60] group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-sm font-medium text-[#2c3e50]">{landmark}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
