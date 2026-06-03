import type { Processo } from "@/types";
import { useEffect, useState, useRef } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { dbPdfs } from "../firebase-pdfs";

interface PdfButtonProps {
  processo: Processo;
  getStageColor: (estagio: string) => string;
}

type Pdfs = { link: string; criadoEm: Date; expireAt: Date };

export function PdfButton({ processo }: PdfButtonProps) {
  const [pdfs, setPdfs] = useState<Pdfs[]>([]);
  const [aberto, setAberto] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const buttonRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const buscarPdfs = async () => {
      setCarregando(true);
      try {
        const q = query(
          collection(dbPdfs, "pdfs"),
          where("numero_processo", "==", processo.protocolo),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        const lista = snapshot.docs.filter((doc) => {
          const expireAt = doc.data().expireAt?.toDate();
          return expireAt && expireAt > new Date();
        }).map((doc) => {
          const data = doc.data();
          return { 
            link: data.storage?.url, 
            criadoEm: data.createdAt?.toDate(), 
            expireAt: data.expireAt?.toDate() 
          };
        });

        setPdfs(lista);
      } catch (error) {
        console.error("Erro ao buscar PDFs:", error);
      } finally {
        setCarregando(false);
      }
    };

    buscarPdfs();
  }, [processo.protocolo]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setAberto(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const temPdfs = pdfs.length > 0;
  // const stageColor = getStageColor(processo.estagio || "");

  // 🔥 CORES E ESTILOS CONSISTENTES (independente do status)
  const corBase = temPdfs 
    ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
    : "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed";

  return (
    <span className="relative inline-flex" ref={buttonRef}>
      <button
        onClick={() => temPdfs && setAberto((v) => !v)}
        disabled={!temPdfs || carregando}
        className={`
          text-[11px] font-medium px-2.5 py-1 rounded-full border 
          flex items-center gap-1.5 transition-all duration-200 whitespace-nowrap
          ${temPdfs ? "cursor-pointer hover:scale-105 hover:shadow-sm" : "cursor-not-allowed"}
          ${corBase}
        `}
        title={temPdfs ? "Visualizar PDFs" : "Nenhum PDF disponível"}
      >
        {/* Ícone PDF consistente */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-3 h-3 fill-current">
          <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
        </svg>
        PDF
        {temPdfs && pdfs.length > 1 && <span className="text-[10px]">({pdfs.length})</span>}
        {carregando && <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      </button>

      {/* 🔥 DROPDOWN - POSICIONADO PARA NÃO CORTAR */}
      {aberto && temPdfs && (
        <>
          {/* Backdrop para fechar ao clicar fora */}
          <div className="fixed inset-0 z-40" onClick={() => setAberto(false)} />
          
          {/* Dropdown - posicionado acima do botão (bottom-full) */}
          <div className="absolute bottom-full right-0 mb-2 z-50 min-w-[260px] bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden">
            <div className="py-1.5">
              <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-100">
                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                  PDFs disponíveis
                </span>
              </div>
              {pdfs.map((pdf, i) => (
                <a 
                  key={i} 
                  href={pdf.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col px-3 py-2 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                >
                  <span className="text-xs font-medium text-gray-700">
                    📄 PDF {i + 1}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-0.5">
                    Criado: {pdf.criadoEm?.toLocaleDateString("pt-BR") || "N/A"} • 
                    Expira: {pdf.expireAt?.toLocaleDateString("pt-BR") || "N/A"}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </span>
  );
}