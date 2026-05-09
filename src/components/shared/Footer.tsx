import { Link } from "react-router-dom";
import { ReactNode } from "react";
import { socialLinks } from "@/constants/SocialLink";
import { PaymentMethods } from "@/constants/PaymentMethods";
import { Logo } from "./Logo";

interface SocialLink {
  id: number;
  title: string;
  href: string;
  icon: ReactNode;
  className: string;
}

const footerLinks = [
  { to: "/products",     label: "Productos" },
  { to: "/about",        label: "Sobre Nosotros" },
  { to: "/blog",         label: "Blog" },
  { to: "/contact-us",   label: "Contáctanos" },
  { to: "/soporte",      label: "Soporte" },
  { to: "/policies",     label: "Políticas de privacidad" },
  { to: "/terms-of-use", label: "Términos de uso" },
  { to: "/conditions",   label: "Condiciones personalizadas" },
];

export const Footer = () => {
  return (
    <footer className="bg-oscuro text-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Logo + tagline */}
          <div className="flex flex-col items-center lg:items-start gap-3">
            <Logo />
            <p className="text-sm text-cream/70 italic leading-relaxed">
              "El arte de hornear con el corazón."
            </p>
          </div>

          {/* Métodos de pago */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-cocoa text-center">
              Métodos de Pago
            </h3>
            <div className="grid grid-cols-3 gap-3 items-center">
              {PaymentMethods.map((method, index) => (
                <div key={index} className="flex justify-center p-1">
                  <img
                    src={method.image}
                    alt={method.alt}
                    className={method.size + " rounded opacity-90 hover:opacity-100 transition-opacity"}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Enlaces útiles */}
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-cocoa">
              Enlaces Útiles
            </h3>
            <nav className="space-y-2">
              {footerLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="block text-sm text-cream/70 hover:text-butter transition-colors duration-200"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Redes sociales */}
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-cocoa">
              Síguenos
            </h3>
            <p className="text-sm text-cream/70 leading-relaxed">
              Entérate primero de nuestras novedades y promociones.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-2">
              {socialLinks.map((link: SocialLink) => (
                <a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className={link.className}
                  aria-label={link.title}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="border-t border-cocoa/30 py-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-cream/50">
            {new Date().getFullYear()} © Bocaditos Yomi's · Todos los derechos reservados.
          </p>
          <div className="flex gap-5">
            <Link to="/contact-us" className="text-xs text-cream/50 hover:text-butter transition-colors">
              Contacto
            </Link>
            <Link to="/contact-us#location" className="text-xs text-cream/50 hover:text-butter transition-colors">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};