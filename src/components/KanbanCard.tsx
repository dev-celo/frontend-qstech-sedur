import { useRef, useEffect, useState } from "react";
import { FileText, Clock, Hash, ChevronRight } from "lucide-react";
import type { Processo } from "@/types";
import gsap from "gsap";
import { PdfButton } from "./PdfButton";

interface KanbanCardProps {
  processo: Processo;
  index: number;
  isHovered?: boolean;
  onHover?: (id: string | null) => void;
}

// 🔥 FUNÇÃO getStageColor (usada pelo PdfButton)
const getStageColor = (estagio: string) => {
  const e = estagio?.toLowerCase() || "";
  if (e.includes("encaminhado")) return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100";
  if (e.includes("convite")) return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100";
  if (e.includes("finalizado") || e.includes("arquiv")) return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100";
  if (e.includes("entrada")) return "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100";
  return "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100";
};

export function KanbanCard({ processo, index, onHover }: KanbanCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isCardHovered, setIsCardHovered] = useState(false);

  // Animação de entrada com stagger
  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: index * 0.03,
          ease: "power2.out",
        }
      );
    }
  }, [index]);

  // Dados
  const ultimaTramitacao = processo.ultima_tramitacao;

  const formatarDataCompleta = (dataStr: string) => {
    if (!dataStr) return "";
    const [datePart, timePart] = dataStr.split(" ");
    const [dia, mes] = datePart.split("/");
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${parseInt(dia)} ${meses[parseInt(mes) - 1]} • ${timePart || ""}`;
  };

  const isHoje = () => {
    if (!ultimaTramitacao?.data) return false;
    try {
      const dataStr = ultimaTramitacao.data.split(' ')[0];
      const hoje = new Date();
      const hojeStr = `${hoje.getDate().toString().padStart(2, '0')}/${(hoje.getMonth() + 1).toString().padStart(2, '0')}/${hoje.getFullYear()}`;
      return dataStr === hojeStr;
    } catch {
      return false;
    }
  };

  const getStatusDot = (estagio: string) => {
    const e = estagio?.toLowerCase() || "";
    if (e.includes("encaminhado")) return "bg-blue-500";
    if (e.includes("convite")) return "bg-amber-500";
    if (e.includes("finalizado") || e.includes("arquiv")) return "bg-emerald-500";
    if (e.includes("entrada")) return "bg-purple-500";
    return "bg-slate-400";
  };

  const getStatusColor = (estagio: string) => {
    const e = estagio?.toLowerCase() || "";
    if (e.includes("encaminhado")) return "bg-blue-50 text-blue-700";
    if (e.includes("convite")) return "bg-amber-50 text-amber-700";
    if (e.includes("finalizado") || e.includes("arquiv")) return "bg-emerald-50 text-emerald-700";
    if (e.includes("entrada")) return "bg-purple-50 text-purple-700";
    return "bg-slate-50 text-slate-600";
  };

  const handleMouseEnter = () => {
    setIsCardHovered(true);
    onHover?.(processo.id);
  };

  const handleMouseLeave = () => {
    setIsCardHovered(false);
    onHover?.(null);
  };

  return (
    <div
      ref={cardRef}
      className="group relative bg-white rounded-3xl transition-all duration-300"
      style={{
        boxShadow: isCardHovered 
          ? "0 20px 40px -12px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0,0,0,0.02)"
          : "0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0,0,0,0.02)",
        transform: isCardHovered ? "translateY(-4px)" : "translateY(0)",
        border: "1px solid",
        borderColor: isCardHovered ? "rgba(203, 213, 225, 0.5)" : "rgba(226, 232, 240, 0.6)",
        transition: "all 300ms cubic-bezier(0.2, 0, 0, 1)",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Barra lateral gradiente sutil */}
      <div 
        className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full transition-all duration-300"
        style={{
          background: `linear-gradient(180deg, var(--status-color), rgba(255,255,255,0))`,
          opacity: isCardHovered ? 0.8 : 0.5,
        }}
        data-status-color={getStatusDot(processo.estagio || "")}
      />

      <div className="p-6 pl-5 space-y-5">
        
        {/* Topo: Protocolo (discreto) + Badges + PDF */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hash className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-[11px] font-mono text-slate-400 tracking-wide">
              {processo.protocolo || "Sem protocolo"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isHoje() && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-100">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-semibold text-red-600">HOJE</span>
              </div>
            )}
            {/* 🔥 PDFBUTTON CORRIGIDO */}
            <div className="transition-transform duration-200 hover:scale-105">
              <PdfButton processo={processo} getStageColor={getStageColor} />
            </div>
          </div>
        </div>

        {/* Empresa - Destaque principal */}
        <div>
          <h3 className="text-[17px] font-bold text-slate-800 leading-tight tracking-tight line-clamp-3">
            {processo.empresa || "Empresa não informada"}
          </h3>
        </div>

        {/* Serviço */}
        <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2">
          {processo.servico || "Serviço não informado"}
        </p>

        {/* Última movimentação - Timeline sutil */}
        {ultimaTramitacao && (
          <div className="pt-1 space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                Última movimentação
              </span>
            </div>
            
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-2 h-2 rounded-full ${getStatusDot(ultimaTramitacao.estagio)}`} />
                <div className="w-px h-7 bg-slate-100 mt-1" />
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="text-[13px] font-semibold text-slate-700">
                  {formatarDataCompleta(ultimaTramitacao.data)}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getStatusColor(ultimaTramitacao.estagio)}`}>
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${getStatusDot(ultimaTramitacao.estagio)} mr-1.5`} />
                    {ultimaTramitacao.estagio}
                  </span>
                  <ChevronRight className="w-3 h-3 text-slate-300" />
                  <span className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                    {ultimaTramitacao.destino?.split(' ').slice(0, 4).join(' ') || "Destino não informado"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rodapé com metadados - organizado */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center gap-3">
            {processo.cnpj_cpf && (
              <div className="flex items-center gap-1.5">
                <FileText className="w-3 h-3 text-slate-300" />
                <span className="text-[10px] font-mono text-slate-400">
                  {processo.cnpj_cpf}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-300">ID:</span>
              <span className="text-[10px] font-mono text-slate-400">
                {processo.id?.slice(-8)}
              </span>
            </div>
          </div>
          
          <span className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(processo.estagio || "")}`}>
            {processo.estagio || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}