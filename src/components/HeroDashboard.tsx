import gsap from "gsap";
import { useEffect, useRef } from "react";

export function HeroDashboard() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 }
    );
  }, []);

  return (
    <div
      ref={ref}
      className="mb-6 rounded-2xl overflow-hidden relative"
    >
      {/* Background natureza */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-500 to-green-700 opacity-90" />

      {/* efeito textura leve */}
      <div className="absolute inset-0 bg-[url('/nature-texture.png')] opacity-10" />

      <div className="relative p-8 text-white text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-wide drop-shadow-lg">
          Dashboard QsTech
        </h1>
        <p className="mt-2 text-sm md:text-base text-green-100">
          Monitoramento inteligente de processos ambientais SEDUR
        </p>
      </div>
    </div>
  );
}