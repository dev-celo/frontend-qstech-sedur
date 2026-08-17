import { Link } from "react-router-dom";
import {
  Leaf,
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  Shield,
  TrendingUp,
  Globe,
  LogIn,
  Search,
  Bell,
  Folder,
  Building2,
  FileText,
  CheckCircle2,
  Clock3,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "Sustentabilidade",
    desc: "Comprometidos com a preservação ambiental e o desenvolvimento sustentável da nossa cidade.",
  },
  {
    icon: Shield,
    title: "Segurança",
    desc: "Dados protegidos com as mais avançadas tecnologias de segurança e criptografia.",
  },
  {
    icon: TrendingUp,
    title: "Eficiência",
    desc: "Processos otimizados para agilizar o licenciamento ambiental e reduzir burocracia.",
  },
  {
    icon: Globe,
    title: "Transparência",
    desc: "Acesso público às informações sobre processos ambientais em andamento.",
  },
];
const steps = [
  {
    number: "01",
    icon: LogIn,
    title: "Acesse",
    desc: "Faça login na plataforma utilizando suas credenciais de acesso.",
  },
  {
    number: "02",
    icon: Search,
    title: "Consulte",
    desc: "Pesquise e visualize seus processos e informações detalhadas.",
  },
  {
    number: "03",
    icon: Bell,
    title: "Acompanhe",
    desc: "Acompanhe as movimentações em tempo real.",
  },
];
const stats = [
  { icon: Folder, value: "700+", label: "Processos monitorados" },
  { icon: Building2, value: "350+", label: "Empresas acompanhadas" },
  { icon: RefreshCw, value: "24/7", label: "Atualizações constantes" },
  // { icon: ShieldIcon, value: "100%", label: "Segurança garantida" },
];

const previewProcesses = [
  {
    code: "LA Nº 2026/0847",
    company: "Ind. Alimentos Bahia Ltda.",
    status: "Aprovado",
  },
  {
    code: "LP Nº 2026/0912",
    company: "Metalúrgica Feira Sul",
    status: "Em análise",
  },
  {
    code: "LI Nº 2026/1033",
    company: "Cerâmica Sertão Verde",
    status: "Pendente",
  },
];
const statusStyles = {
  Aprovado: { icon: CheckCircle2, className: "bg-emerald-50 text-emerald-700" },
  "Em análise": { icon: Clock3, className: "bg-amber-50 text-amber-700" },
  Pendente: { icon: Clock3, className: "bg-slate-100 text-slate-500" },
};

export default function HeroPage() {

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Navbar */}
      <header className="border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <img
            src="/logo-qstech-nome-qstech-consultoria&gestao-ambientalverde.png"
            alt="QSTECH"
            className="h-32 object-contain"
          />

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 transition-colors text-white text-sm font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg"
            >
              Acessar plataforma <ArrowRight className="w-4 h-4" />
            </Link>

          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-14 sm:pb-24 grid md:grid-cols-2 gap-10 md:gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-[11px] sm:text-xs font-semibold px-3 py-1.5 rounded-full mb-5 sm:mb-6">
              <Leaf className="w-3.5 h-3.5 shrink-0" /> PLATAFORMA DE MONITORAMENTO AMBIENTAL
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-5 sm:mb-6">
              Gestão ambiental
              <br />
              inteligente e
              <br />
              <span className="text-emerald-600">transparente</span>
            </h1>
            <p className="text-slate-500 text-base sm:text-lg mb-7 sm:mb-8 max-w-md">
              A plataforma da QSTECH que conecta você às informações dos
              processos ambientais da Sedur de forma simples, segura e
              eficiente.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10 sm:mb-12">
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 transition-colors text-white text-sm font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg"
              >
                Acessar plataforma <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-3 xs:content-center justify-items-center sm:flex sm:flex-wrap  gap-4 sm:gap-8 mx-auto">
              {[
                { icon: ShieldCheck, label: "Seguro e confiável" },
                { icon: RefreshCw, label: "Dados atualizados" },
                { icon: Leaf, label: "Compromisso ambiental" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-sm text-slate-600 font-medium">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative order-last px-2 sm:px-6 md:px-0">
            {/* fundo com pontilhado sutil, ecoando o selo "monitoramento" */}
            <div
              className="absolute inset-0 -m-6 rounded-[2rem] opacity-60"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #d1fae5 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />

            {/* card principal */}
            <div className="relative bg-white rounded-2xl shadow-xl shadow-slate-200/70 border border-slate-100 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    Painel de processos
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <span className="relative flex w-1.5 h-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-emerald-500" />
                  </span>
                  Ao vivo
                </div>
              </div>

              <div className="space-y-2.5 sm:space-y-3">
                {previewProcesses.map((p) => {
                  const style = statusStyles[p.status as keyof typeof statusStyles];
                  return (
                    <div
                      key={p.code}
                      className="flex items-center gap-3 border border-slate-100 rounded-xl p-2.5 sm:p-3"
                    >
                      <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-slate-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-sm font-semibold text-slate-700 truncate">
                          {p.code}
                        </div>
                        <div className="text-[11px] sm:text-xs text-slate-400 truncate">
                          {p.company}
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold px-2 py-1 rounded-full shrink-0 ${style.className}`}
                      >
                        <style.icon className="w-3 h-3" />
                        {p.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* badge flutuante: total monitorado */}
            <div className="hidden sm:flex absolute -bottom-5 -left-5 items-center gap-3 bg-white rounded-xl shadow-lg shadow-slate-200/70 border border-slate-100 px-4 py-3">
              <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
                <Folder className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-slate-900 leading-none">
                  700+
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  processos monitorados
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section id="sobre" className="bg-white scroll-mt-16">
        {/* Cabeçalho da seção */}
        <div className="bg-slate-50/70 py-14 sm:py-20 md:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <span className="inline-block bg-emerald-50 text-emerald-700 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 rounded-full mb-5 sm:mb-6">
              Sobre a Plataforma
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 sm:mb-6">
              QSTECH
            </h2>
            <p className="text-slate-500 text-sm sm:text-base md:text-lg leading-relaxed">
              Uma plataforma moderna e intuitiva para gestão e monitoramento de
              processos ambientais, desenvolvida para facilitar o acesso às
              informações da Secretaria de Desenvolvimento Urbano (Sedur).
            </p>
          </div>
        </div>

        {/* Nossa Missão */}
        <div className="py-14 sm:py-20 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold mb-5 sm:mb-6">
                Nossa Missão
              </h3>
              <div className="space-y-4 text-slate-500 text-sm sm:text-base leading-relaxed">
                <p>
                  Facilitar o acesso às informações sobre processos ambientais,
                  promovendo transparência e eficiência na gestão ambiental
                  urbana. Acreditamos que a tecnologia pode ser uma aliada
                  poderosa na preservação do meio ambiente.
                </p>
                <p>
                  A QSTECH foi desenvolvida com foco na experiência do usuário,
                  oferecendo uma interface moderna e intuitiva que permite
                  visualizar e acompanhar processos de forma simples e
                  eficiente.
                </p>
              </div>
            </div>

            {/* Card de destaque com citação */}
            <div className="relative max-w-md mx-auto md:mx-0 md:ml-auto w-full">
              {/* sombra/camada decorativa deslocada */}
              <div className="absolute inset-0 translate-x-3 translate-y-3 sm:translate-x-4 sm:translate-y-4 bg-emerald-100 rounded-2xl -z-10" />

              <div className="relative bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 sm:p-8 shadow-xl shadow-emerald-900/10">
                <Leaf
                  className="w-8 h-8 sm:w-9 sm:h-9 text-white/80 mb-5 sm:mb-6"
                  strokeWidth={1.4}
                />
                <p className="text-white text-base sm:text-lg leading-relaxed">
                  "A preservação do meio ambiente não é apenas uma
                  responsabilidade, é um compromisso com o futuro das próximas
                  gerações."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="bg-slate-50/60 py-10 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 sm:mb-4">
              Por que escolher a QSTECH?
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Nossa plataforma foi desenvolvida com as melhores práticas de
              usabilidade e tecnologia para oferecer uma experiência
              excepcional.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-7 hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 sm:mb-5">
                  <f.icon className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-14 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 sm:mb-4">
              Como funciona?
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Três passos simples para acompanhar seus processos ambientais
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8 lg:gap-10 relative">
            <div className="hidden sm:block absolute top-6 left-[16%] right-[16%] h-px border-t border-dashed border-slate-300" />
            {steps.map((s) => (
              <div key={s.number} className="text-center relative">
                <div className="relative w-14 h-14 mx-auto mb-5">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                    <s.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center">
                    {s.number}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 max-w-[240px] sm:max-w-[220px] mx-auto leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-emerald-600 py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-around">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-3 justify-center md:justify-start text-center md:text-left flex-col md:flex-row"
            >
              <s.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white/90" strokeWidth={1.5} />
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-white leading-none">
                  {s.value}
                </div>
                <div className="text-emerald-100 text-xs sm:text-sm mt-1">
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center text-center md:text-left justify-between gap-6 sm:gap-8">
          <div className="flex flex-col md:flex-row items-center md:items-center gap-4 sm:gap-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
              <Leaf className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold mb-2">
                Pronto para acompanhar
                <br className="hidden sm:block" /> seus processos com mais
                clareza?
              </h3>
              <p className="text-slate-500 text-sm sm:text-base">
                Acesse a plataforma QSTECH e tenha todas as informações que
                você precisa na palma da sua mão.
              </p>
            </div>
          </div>

          <Link
            to="/login"
            className="hidden sm:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 transition-colors text-white text-sm font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg"
          >
            Acessar plataforma <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8">
        <div className="text-center text-xs text-slate-500">
          © 2026 QSTECH. Todos os direitos reservados.
        </div>
      </footer >
    </div >
  );
}
