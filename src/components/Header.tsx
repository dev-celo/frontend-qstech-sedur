import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";

const navLinks = [
  { path: "/", label: "Dashboard" },
  { path: "/sobre", label: "Sobre" },
  { path: "/contato", label: "Contato" },
  { path: "/localizacao", label: "Localização" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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
        
        {/* 👇 container com mais respiro */}
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-3 flex items-center justify-between">
          
          {/* 👇 LOGO AJUSTADO */}
          <Link to="/" className="flex items-center ml-4 md:ml-10">
            <img
              src="/logo-qstech-nome-qstech-consultoria&gestao-ambientalverde.png"
              alt="QSTech"
              className="h-16 md:h-20 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </Link>

          {/* NAV DESKTOP */}
          <div className="hidden md:flex items-center gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-item relative px-4 py-2 text-sm font-medium rounded-full transition-all
                ${
                  location.pathname === link.path
                    ? "text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-md"
                    : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* MOBILE */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* MOBILE MENU */}
        {isMobileMenuOpen && (
          <div className="md:hidden px-6 pb-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-sm text-gray-700 hover:text-green-600"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}