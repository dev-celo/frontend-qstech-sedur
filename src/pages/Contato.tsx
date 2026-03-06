import { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import gsap from 'gsap';

export function Contato() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
    mensagem: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.querySelectorAll('.animate-item'),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
      );
    }

    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.3 }
      );
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ nome: '', email: '', assunto: '', mensagem: '' });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'contato@ecosedur.com.br',
      description: 'Respondemos em até 24h',
    },
    {
      icon: Phone,
      title: 'Telefone',
      value: '(71) 3202-0000',
      description: 'Seg - Sex, 8h às 18h',
    },
    {
      icon: MapPin,
      title: 'Endereço',
      value: 'Salvador, BA',
      description: 'Centro Administrativo',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Hero Section */}
      <div ref={heroRef} className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="animate-item inline-block px-4 py-1.5 bg-[#27ae60]/10 text-[#27ae60] 
                           rounded-full text-sm font-medium mb-6">
            Entre em Contato
          </span>
          <h1 className="animate-item text-4xl sm:text-5xl font-bold text-[#2c3e50] mb-6">
            Fale Conosco
          </h1>
          <p className="animate-item text-lg text-[#7f8c8d] leading-relaxed max-w-2xl mx-auto">
            Tem alguma dúvida, sugestão ou precisa de ajuda? 
            Estamos aqui para ajudar. Entre em contato conosco.
          </p>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {contactInfo.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 
                             hover:shadow-lg transition-all duration-300 text-center group"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[#27ae60] to-[#1e8449] 
                                  flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#2c3e50] mb-1">{item.title}</h3>
                  <p className="text-[#27ae60] font-medium mb-1">{item.value}</p>
                  <p className="text-sm text-[#7f8c8d]">{item.description}</p>
                </div>
              );
            })}
          </div>

          {/* Contact Form */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-[#2c3e50] mb-6">
                Envie uma mensagem
              </h2>

              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#2c3e50] mb-2">
                    Mensagem enviada!
                  </h3>
                  <p className="text-[#7f8c8d]">
                    Agradecemos seu contato. Responderemos em breve.
                  </p>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-[#2c3e50] mb-2">
                      Nome completo
                    </label>
                    <Input
                      type="text"
                      placeholder="Seu nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      required
                      className="h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#27ae60] 
                                 focus:ring-[#27ae60]/20 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2c3e50] mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#27ae60] 
                                 focus:ring-[#27ae60]/20 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2c3e50] mb-2">
                      Assunto
                    </label>
                    <Input
                      type="text"
                      placeholder="Qual o assunto?"
                      value={formData.assunto}
                      onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
                      required
                      className="h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#27ae60] 
                                 focus:ring-[#27ae60]/20 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2c3e50] mb-2">
                      Mensagem
                    </label>
                    <Textarea
                      placeholder="Escreva sua mensagem..."
                      value={formData.mensagem}
                      onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                      required
                      rows={5}
                      className="bg-gray-50 border-gray-200 focus:bg-white focus:border-[#27ae60] 
                                 focus:ring-[#27ae60]/20 rounded-xl resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-[#27ae60] hover:bg-[#1e8449] text-white rounded-xl 
                               font-medium shadow-lg shadow-[#27ae60]/25 hover:shadow-xl 
                               hover:shadow-[#27ae60]/30 transition-all"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Enviar mensagem
                  </Button>
                </form>
              )}
            </div>

            {/* FAQ / Info */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-[#27ae60] to-[#1e8449] rounded-2xl p-8 text-white">
                <Clock className="w-10 h-10 mb-4 opacity-80" />
                <h3 className="text-xl font-semibold mb-3">
                  Horário de Atendimento
                </h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  Nossa equipe está disponível para atendê-lo de segunda a sexta-feira, 
                  das 8h às 18h.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Segunda - Sexta</span>
                    <span>08:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Sábado</span>
                    <span>Fechado</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Domingo</span>
                    <span>Fechado</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-[#2c3e50] mb-4">
                  Perguntas Frequentes
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      q: 'Como acesso os processos?',
                      a: 'Acesse o Dashboard para visualizar todos os processos organizados por status.',
                    },
                    {
                      q: 'Os dados são atualizados em tempo real?',
                      a: 'Sim, os dados são sincronizados automaticamente com a base da Sedur.',
                    },
                    {
                      q: 'Posso exportar os dados?',
                      a: 'Em breve teremos a funcionalidade de exportação para Excel e PDF.',
                    },
                  ].map((faq, index) => (
                    <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                      <p className="font-medium text-[#2c3e50] text-sm mb-1">{faq.q}</p>
                      <p className="text-sm text-[#7f8c8d]">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
