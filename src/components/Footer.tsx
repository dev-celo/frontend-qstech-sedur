import { Link } from "react-router-dom";
import {  Mail, Phone, MapPin, Linkedin, Instagram } from "lucide-react";

const footerLinks = {
  navegacao: [
    { path: "/", label: "Dashboard" },
    { path: "/sobre", label: "Sobre" },
    { path: "/contato", label: "Contato" },
    { path: "/localizacao", label: "Localização" },
  ],
  legal: [
    { path: "#", label: "Termos de Uso" },
    { path: "#", label: "Política de Privacidade" },
    { path: "#", label: "LGPD" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#1e8449] to-[#166534] text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center shrink-0">
              <img
                src="/logo-qstech-nome-qstech-consultoria&gestao-ambientalverde.png"
                alt="QSTech Consultoria e Gestão Ambiental"
                className="h-14 md:h-20 w-auto object-contain"
              />
            </Link>
            <p className="text-white/70 text-sm leading-relaxed">
              Plataforma moderna de gestão e monitoramento de processos
              ambientais, integrada com a base de dados da Sedur.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Navegação</h3>
            <ul className="space-y-3">
              {footerLinks.navegacao.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/70 hover:text-white hover:translate-x-1 transition-all inline-block text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-white/70 hover:text-white hover:translate-x-1 transition-all inline-block text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-white/70 text-sm">
                <Mail className="w-4 h-4" />
                <span>contato@ecosedur.com.br</span>
              </li>
              <li className="flex items-center gap-3 text-white/70 text-sm">
                <Phone className="w-4 h-4" />
                <span>(71) 3202-0000</span>
              </li>
              <li className="flex items-start gap-3 text-white/70 text-sm">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Salvador, BA - Brasil</span>
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a
                href="#"
                className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            © 2026 EcoSedur. Todos os direitos reservados.
          </p>
          <p className="text-white/50 text-sm">
            Desenvolvido com foco em sustentabilidade
          </p>
        </div>
      </div>
    </footer>
  );
}
