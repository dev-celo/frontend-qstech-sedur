import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import {
  CheckCircle,
  RefreshCw,
  Activity,
  Database,
  TrendingUp,
  Clock,
  Bell,
  BarChart3,
} from "lucide-react";

interface HeroDashboardProps {
  totalProcessos?: number;
  emAndamento?: number;
  emConvite?: number;
  finalizados?: number;
  ultimaAtualizacao?: string;
  sessaoValida?: boolean;
  movimentacoesHoje?: number;
}

export function HeroDashboard({
  totalProcessos = 716,
  emConvite = 34,
  finalizados = 530,
  ultimaAtualizacao = "02/06/2026 às 17:05",
  sessaoValida = true,
  movimentacoesHoje = 14,
}: HeroDashboardProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
      );
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35, delay: 0.06, ease: "power2.out" }
      );
      gsap.fromTo(
        rightColumnRef.current,
        { opacity: 0, x: 12 },
        { opacity: 1, x: 0, duration: 0.4, delay: 0.1, ease: "power2.out" }
      );
    });
    return () => ctx.revert();
  }, []);

  const miniCards = [
    {
      label: "Processos monitorados",
      value: totalProcessos,
      icon: Database,
      color: "text-emerald-600",
      bg: "bg-emerald-50/60",
    },
    {
      label: "Movimentações hoje",
      value: movimentacoesHoje,
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-100/40",
      highlight: true,
      highlightText: `${movimentacoesHoje} movimentações detectadas hoje`,
    },
    {
      label: "Em convite",
      value: emConvite,
      icon: Bell,
      color: "text-amber-600",
      bg: "bg-amber-50/60",
    },
    {
      label: "Finalizados",
      value: finalizados,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50/60",
    },
  ];

  return (
    <div className="relative w-full overflow-hidden" ref={heroRef}>
      {/* ========================================================= */}
      {/* CAMADA 1: FUNDO COM GRADIENTES E PROFUNDIDADE            */}
      {/* ========================================================= */}

      <div className="absolute inset-0 bg-gradient-to-br from-[#F8FAFC] via-white to-[#F1F5F9]" />

      {/* Iluminação ambiente expandida e mais difusa */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-teal-400/6 blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-emerald-400/5 blur-[110px]" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] rounded-full bg-blue-400/4 blur-[100px]" />

      {/* Blur shapes suaves */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-emerald-400/10 blur-[80px]" />
      <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-teal-400/8 blur-[75px]" />

      {/* Grid técnico sutil (opacidade mínima) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.006]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #0F172A 1px, transparent 1px),
            linear-gradient(to bottom, #0F172A 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(circle at center, black 40%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 85%)",
        }}
      />

      {/* Elemento tecnológico de fundo (mais sutil) */}
      <div className="absolute bottom-0 right-0 w-[280px] h-[280px] opacity-10 pointer-events-none">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M100 20 L120 40 L100 60 L80 40 L100 20Z"
            fill="none"
            stroke="#0F9D58"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d="M140 50 L160 70 L140 90 L120 70 L140 50Z"
            fill="none"
            stroke="#14B8A6"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <path
            d="M60 50 L80 70 L60 90 L40 70 L60 50Z"
            fill="none"
            stroke="#2563EB"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <circle cx="100" cy="110" r="6" stroke="#0F9D58" strokeWidth="0.8" fill="none" />
          <circle cx="138" cy="138" r="5" stroke="#14B8A6" strokeWidth="0.8" fill="none" />
          <circle cx="62" cy="138" r="5" stroke="#2563EB" strokeWidth="0.8" fill="none" />
        </svg>
      </div>

      {/* ========================================================= */}
      {/* CAMADA 2: CONTAINER PRINCIPAL (GLASS) - ALTURA OTIMIZADA */}
      {/* ========================================================= */}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-11 pb-4">
        {/* Barra gradiente superior refinada (assinatura premium) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[92%] h-[3px] rounded-full bg-gradient-to-r from-[#0F9D58] via-[#14B8A6] to-[#2563EB] opacity-95 shadow-[0_0_12px_rgba(15,157,88,0.3)]" />

        {/* Painel glass flutuante com fundo ligeiramente diferente */}
        <div
          className={`
            relative backdrop-blur-[20px] bg-white/88
            rounded-[28px] border border-[rgba(15,157,88,0.1)]
            shadow-[0_20px_50px_rgba(15,23,42,0.05),0_4px_12px_rgba(15,157,88,0.03)]
            transition-all duration-300
            ${isHovering ? "shadow-[0_28px_60px_rgba(15,23,42,0.08)]" : ""}
          `}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* ===================================================== */}
          {/* CONTEÚDO PRINCIPAL (2 COLUNAS EQUILIBRADAS)           */}
          {/* ===================================================== */}

          <div className="flex flex-col lg:flex-row gap-7 p-5 sm:p-5 md:p-6 lg:p-7">
            {/* =================================================== */}
            {/* COLUNA ESQUERDA (título ligeiramente reduzido)       */}
            {/* =================================================== */}

            <div className="flex-[0.9] space-y-3.5">
              {/* Badge refinado */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50/80 border border-emerald-100/50 w-fit">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-600" />
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 tracking-wide">
                  QSTECH • MONITORAMENTO OPERACIONAL
                </span>
              </div>

              {/* Título principal - escala final reduzida */}
              <h1
                ref={titleRef}
                className="text-4xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tighter text-slate-900 leading-[1.1]"
              >
                Central de<br />
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Processos Ambientais
                </span>
              </h1>

              {/* Subtítulo */}
              <p className="text-[15px] text-slate-600 leading-relaxed max-w-xl">
                Acompanhe tramitações, atualizações recentes e status dos
                processos ambientais em uma visualização organizada para a
                operação da QSTECH.
              </p>

              {/* Chips de status operacional */}
              <div className="flex flex-wrap gap-2 pt-0.5">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50/60 border border-emerald-100/60">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  <span className="text-[11px] font-medium text-emerald-700">
                    Sessão ativa
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50/60 border border-blue-100/60">
                  <RefreshCw className="w-3 h-3 text-blue-600" />
                  <span className="text-[11px] font-medium text-blue-700">
                    Base atualizada
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100/60 border border-slate-200/60">
                  <Activity className="w-3 h-3 text-slate-600" />
                  <span className="text-[11px] font-medium text-slate-600">
                    Ordenado por movimentação recente
                  </span>
                </div>
              </div>

              {/* Última atualização em linha elegante */}
              <div className="flex flex-wrap items-center gap-3 pt-1.5 border-t border-slate-100/80 pt-2.5">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span className="font-mono">{ultimaAtualizacao}</span>
                  <span className="w-0.5 h-0.5 rounded-full bg-slate-300" />
                  <span className="text-emerald-600 font-medium">
                    {sessaoValida ? "✓ Sessão válida" : "⚠ Sessão expirada"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium px-3 py-1 rounded-xl shadow-[0_4px_12px_rgba(15,157,88,0.15)] transition-all duration-200 hover:-translate-y-0.5 text-[11px]">
                    <span className="relative z-10 flex items-center gap-1.5">
                      <RefreshCw className="w-3 h-3 group-active:animate-spin" />
                      Atualizar
                    </span>
                  </button>
                  <button className="bg-white/90 border border-slate-200 text-slate-600 font-medium px-3 py-1 rounded-xl shadow-sm transition-all duration-200 hover:bg-slate-50 text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <Activity className="w-3 h-3" />
                      Diagnóstico
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* =================================================== */}
            {/* COLUNA DIREITA - PRESENÇA AUMENTADA                 */}
            {/* =================================================== */}

            <div ref={rightColumnRef} className="flex-[1.1]">
              {/* Título da área de KPIs com mais presença */}
              <div className="mb-2.5">
                <h3 className="text-[15px] font-semibold text-slate-800 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-500" />
                  Resumo operacional
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Situação atual dos processos monitorados
                </p>
              </div>

              {/* Badge de atividade em tempo real */}
              <div className="mb-3 flex items-center justify-end">
                <div className="flex items-center gap-1.5 bg-emerald-50/50 px-2 py-0.5 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-medium text-emerald-700">
                    {movimentacoesHoje} atualizações recentes
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {miniCards.map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.label}
                      className={`
                        group relative overflow-hidden
                        backdrop-blur-sm bg-white/85
                        border rounded-xl p-3.5
                        transition-all duration-200
                        hover:translate-y-[-1.5px]
                        ${
                          card.highlight
                            ? "border-emerald-300/60 bg-gradient-to-br from-emerald-50/30 to-white/90 shadow-[0_8px_20px_rgba(15,157,88,0.1)] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-emerald-400/4 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity"
                            : "border-slate-200/70 shadow-[0_2px_12px_rgba(15,23,42,0.03)] hover:shadow-[0_6px_18px_rgba(15,23,42,0.05)]"
                        }
                      `}
                      style={{ animationDelay: `${idx * 70}ms` }}
                    >
                      <div
                        className="animate-in fade-in slide-in-from-bottom-2 duration-350"
                        style={{ animationDelay: `${idx * 70}ms` }}
                      >
                        <div className="flex items-start justify-between">
                          <div className={`p-1.5 rounded-lg ${card.bg}`}>
                            <Icon className={`w-3 h-3 ${card.color}`} />
                          </div>
                          {card.highlight && (
                            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-200/60 px-1.5 py-0.5 rounded-full">
                              HOJE
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                          {card.highlight ? card.highlightText : card.label}
                        </p>
                        <p className="text-xl font-bold text-slate-800 tracking-tight mt-0.5">
                          {card.value.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ===================================================== */}
          {/* RODAPÉ (mais compacto)                                 */}
          {/* ===================================================== */}

          <div className="flex flex-wrap items-center justify-between gap-2 px-5 sm:px-6 md:px-7 pb-3.5 pt-1.5 border-t border-slate-100/80">
            <div className="text-[9px] text-slate-400 flex items-center gap-1.5">
              <Database className="w-2.5 h-2.5" />
              Dados sincronizados da plataforma SEDUR • Organizados por movimentação mais recente
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}