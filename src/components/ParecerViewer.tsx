import { useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ParecerViewerProps {
  parecer: string | null | undefined;
}

export function ParecerViewer({ parecer }: ParecerViewerProps) {
  const [aberto, setAberto] = useState(false);

  if (!parecer || parecer.trim() === "") {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setAberto(true)}
        className=" text-xs font-medium text-green-700 hover:underline"
      >
        Ver parecer completo
      </button>

      {aberto &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setAberto(false)}
          >
            <div
              className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                <h3 className="text-lg font-semibold text-gray-900">Parecer</h3>
                <button
                  onClick={() => setAberto(false)}
                  aria-label="Fechar"
                  className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto whitespace-pre-wrap px-6 py-5 text-base leading-relaxed text-gray-700">
                {parecer}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
