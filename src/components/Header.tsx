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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      ".nav-item",
      { y: -20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2,
      }
    );
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 mb-5 ${
        isScrolled ? "mx-auto mt-4 max-w-6xl px-4" : "w-full"
      }`}
    >
      <nav
        className={`transition-all duration-500 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-xl shadow-lg rounded-2xl px-6 py-3"
            : "bg-transparent px-8 py-6"
        }`}
      >
        <div className="flex items-center justify-between">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center shrink-0">
            <img
              src="/logo-qstech-nome-qstech-consultoria&gestao-ambientalverde.png"
              alt="QSTech Consultoria e Gestão Ambiental"
              className="h-14 md:h-20 w-auto object-contain"
            />
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-item relative px-4 py-2 text-sm font-medium transition-colors rounded-full ${
                  location.pathname === link.path
                    ? "text-[#27ae60]"
                    : "text-[#7f8c8d] hover:text-[#2c3e50]"
                }`}
              >
                {location.pathname === link.path && (
                  <span className="absolute inset-0 bg-[#27ae60]/10 rounded-full" />
                )}

                <span className="relative">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* MOBILE MENU BUTTON */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-[#2c3e50]" />
            ) : (
              <Menu className="w-5 h-5 text-[#2c3e50]" />
            )}
          </Button>
        </div>

        {/* MOBILE MENU */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === link.path
                      ? "bg-[#27ae60]/10 text-[#27ae60]"
                      : "text-[#7f8c8d] hover:bg-gray-50 hover:text-[#2c3e50]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}