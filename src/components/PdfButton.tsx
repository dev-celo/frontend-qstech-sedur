import type { Processo } from "@/types";
import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { dbPdfs } from "../firebase-pdfs";

interface PdfButtonProps {
  processo: Processo;
  getStageColor: (estagio: string) => string;
}

type Pdfs = { link: string; criadoEm: Date; expireAt: Date }

export function PdfButton({ processo, getStageColor }: PdfButtonProps) {
  const [pdfs, setPdfs] = useState<Pdfs[]>([]);
  const [aberto, setAberto] = useState(false);
  const [carregando, setCarregando] = useState(true);

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

  // 🔥 BOTÃO SEMPRE VISÍVEL (com ou sem PDF)
  const temPdfs = pdfs.length > 0;
  const stageColor = getStageColor(processo.estagio || "");

  return (
    <span className="flex flex-1 relative">
      <button
        onClick={() => temPdfs && setAberto((v) => !v)}
        disabled={!temPdfs || carregando}
        className={`text-xs px-2.5 py-1.5 rounded-full border font-medium flex items-center gap-1.5 transition-all duration-200 ${
          temPdfs 
            ? `${stageColor} cursor-pointer hover:scale-105` 
            : "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed"
        }`}
        title={temPdfs ? "Visualizar PDFs" : "Nenhum PDF disponível"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-3 h-3 fill-current">
          <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
        </svg>
        PDF
        {temPdfs && pdfs.length > 1 && ` (${pdfs.length})`}
        {carregando && <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      </button>

      {aberto && temPdfs && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setAberto(false)} />
          <div className="absolute bottom-full mb-2 left-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[220px] flex flex-col gap-1">
            {pdfs.map((pdf, i) => (
              <a 
                key={i} 
                href={pdf.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs px-3 py-2 rounded-md hover:bg-gray-100 flex flex-col transition-colors"
              >
                <span className="font-medium text-gray-700">
                  Criado em: {pdf.criadoEm?.toLocaleDateString("pt-BR") || "N/A"}
                </span>
                <span className="text-gray-400 text-[10px]">
                  Expira em: {pdf.expireAt?.toLocaleDateString("pt-BR") || "N/A"}
                </span>
              </a>
            ))}
          </div>
        </>
      )}
    </span>
  );
}