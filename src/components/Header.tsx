import { useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";


export function Header() {
  useEffect(() => {
    gsap.fromTo(
      ".nav-item",
      { y: -20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
      }
    );
  }, []);

  return (
    <header className="relative">
      <nav className="bg-white/70 backdrop-blur-xl shadow-md border-b border-green-100">

        {/* Container com mais espaço para a logo */}
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-2 flex items-center justify-between">

          {/* 🔥 LOGO MAIOR 🔥 */}
          <Link to="/admin/login" className="flex items-center mt-4 ml-4 md:ml-10">
            <img
              src="/logo-qstech-nome-qstech-consultoria&gestao-ambientalverde.png"
              alt="QSTech"
              className="h-20 md:h-28 scale-150 md:scale-125 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </Link>

          {/* NAV DESKTOP */}
        </div>

      </nav>
    </header>
  );
}
