import { useRef, useEffect } from "react";
import { FileText, Building2, Clock, Hash, ArrowRight } from "lucide-react";
import type { Processo } from "@/types";
import gsap from "gsap";

interface KanbanCardProps {
  processo: Processo;
  index: number;
}

export function KanbanCard({ processo, index }: KanbanCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 30, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          delay: index * 0.05,
          ease: "back.out(1.2)",
        },
      );
    }
  }, [index]);

  const getStageColor = (estagio: string) => {
    const estagioLower = estagio.toLowerCase();
    if (estagioLower.includes("encaminhado")) return "bg-blue-100 text-blue-700 border-blue-200";
    if (estagioLower.includes("convite")) return "bg-amber-100 text-amber-700 border-amber-200";
    if (estagioLower.includes("finalizado") || estagioLower.includes("arquiv")) return "bg-green-100 text-green-700 border-green-200";
    if (estagioLower.includes("entrada")) return "bg-purple-100 text-purple-700 border-purple-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getStageIcon = (estagio: string) => {
    const estagioLower = estagio.toLowerCase();
    if (estagioLower.includes("encaminhado")) return "→";
    if (estagioLower.includes("convite")) return "✉";
    if (estagioLower.includes("finalizado")) return "✓";
    if (estagioLower.includes("entrada")) return "↓";
    return "•";
  };

  const tramitacoes = processo.ultimas_tramitacoes || [];
  // const dataMaisRecente = tramitacoes[0]?.data?.split(' ')[0] || processo.data || "";

  // const formatarData = (dataStr: string) => {
  //   if (!dataStr) return "";
  //   const partes = dataStr.split(' ')[0].split('/');
  //   if (partes.length === 3) {
  //     return `${partes[0]}/${partes[1]}`; // Retorna apenas DD/MM
  //   }
  //   return dataStr;
  // };

  const formatarDataCompleta = (dataStr: string) => {
    if (!dataStr) return "";
    const partes = dataStr.split(' ')[0].split('/');
    if (partes.length === 3) {
      const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      return `${parseInt(partes[0])} ${meses[parseInt(partes[1])-1]}`;
    }
    return dataStr;
  };

  const getEmpresaDisplay = () => {
    if (!processo.empresa) return "Empresa não informada";
    return processo.empresa;
  };

  const getServicoDisplay = () => {
    return processo.servico || "Serviço não informado";
  };

  const getProtocoloDisplay = () => {
    return processo.protocolo || "Sem protocolo";
  };

  // Verifica se a tramitação é de hoje
  const isHoje = () => {
    if (!tramitacoes[0]?.data) return false;
    try {
      const dataStr = tramitacoes[0].data.split(' ')[0];
      const hoje = new Date();
      const hojeStr = `${hoje.getDate().toString().padStart(2,'0')}/${(hoje.getMonth()+1).toString().padStart(2,'0')}/${hoje.getFullYear()}`;
      return dataStr === hojeStr;
    } catch {
      return false;
    }
  };

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
    >
      {/* Barra lateral colorida baseada no estágio */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
        processo.estagio?.toLowerCase().includes('encaminhado') ? 'bg-blue-500' :
        processo.estagio?.toLowerCase().includes('convite') ? 'bg-amber-500' :
        processo.estagio?.toLowerCase().includes('finalizado') ? 'bg-green-500' :
        'bg-gray-400'
      }`} />

      {/* Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

      <div className="relative space-y-4 pl-3">
        {/* Header com Protocolo e Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#27ae60]/10 rounded-lg">
              <Hash className="w-4 h-4 text-[#27ae60]" />
            </div>
            <span className="text-sm font-mono font-semibold text-[#2c3e50]">
              {getProtocoloDisplay()}
            </span>
          </div>
          
          {isHoje() && (
            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium animate-pulse shadow-sm">
              🔴 Hoje
            </span>
          )}
        </div>

        {/* Empresa em destaque */}
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
          <div className="flex items-start gap-2">
            <Building2 className="w-4 h-4 text-[#27ae60] mt-0.5 flex-shrink-0" />
            <p className="text-sm font-semibold text-[#2c3e50] leading-relaxed">
              {getEmpresaDisplay()}
            </p>
          </div>
        </div>

        {/* Serviço */}
        <div className="text-sm text-gray-600 pl-6">
          <span className="text-xs text-gray-400 block mb-1">Serviço</span>
          <p className="leading-relaxed">{getServicoDisplay()}</p>
        </div>

        {/* CNPJ */}
        {processo.cnpj_cpf && (
          <div className="flex items-center gap-2 text-xs text-gray-500 pl-6">
            <FileText className="w-3.5 h-3.5" />
            <span className="font-mono">{processo.cnpj_cpf}</span>
          </div>
        )}

        {/* Timeline de Tramitações */}
        <div className="space-y-3 pt-3 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Últimas Movimentações
          </p>
          
          <div className="space-y-3">
            {tramitacoes.map((t, idx) => (
              <div 
                key={idx} 
                className={`relative pl-6 ${idx === 0 ? 'bg-blue-50/50 p-3 rounded-lg -ml-2' : ''}`}
              >
                {/* Linha do tempo vertical */}
                {idx < tramitacoes.length - 1 && (
                  <div className="absolute left-1 top-6 bottom-0 w-0.5 bg-gray-200" />
                )}
                
                {/* Marcador de data */}
                <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-white border-2 border-[#27ae60]" />
                
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${
                      idx === 0 ? 'text-[#27ae60]' : 'text-gray-600'
                    }`}>
                      {formatarDataCompleta(t.data)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {t.data.split(' ')[1] || ''}
                    </span>
                    {idx === 0 && (
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        Última
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-medium text-gray-500 min-w-[60px]">
                      {getStageIcon(t.estagio)} {t.estagio}
                    </span>
                    <ArrowRight className="w-3 h-3 text-gray-400 mt-1" />
                    <span className="text-xs text-gray-600 flex-1 line-clamp-2">
                      {t.destino || "Destino não informado"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer com Estágio Atual */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className={`text-xs px-3 py-1.5 rounded-full border font-medium flex items-center gap-1 ${getStageColor(processo.estagio || "")}`}>
            <span>{getStageIcon(processo.estagio || "")}</span>
            {processo.estagio || "N/A"}
          </span>
          <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded">
            ID: {processo.id}
          </span>
        </div>
      </div>
    </div>
  );
}