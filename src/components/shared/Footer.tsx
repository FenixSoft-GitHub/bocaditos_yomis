
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

export const Footer = () => {
  return (
    <footer className="bg-gray-950 text-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sección principal del footer */}
        <div className="py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="space-y-4 text-center lg:text-left flex flex-col items-center lg:items-start">
            <Logo />
            <p className="text-sm text-cream/80">
              Tu destino confiable para encontrar los mejores precios en equipos
              de tecnología y accesorios.
            </p>
          </div>

          {/* Formulario de suscripción */}
          <div className="space-y-4">
            <h3 className="font-semibold uppercase tracking-wider text-center">
              Métodos de Pagos
            </h3>
            <div className="grid grid-cols-2 gap-4 mt-6 items-center sm:grid-cols-3">
              {PaymentMethods.map((paymentMethod, index) => (
                <div key={index} className="flex justify-center p-1">
                  <img
                    src={paymentMethod.image}
                    alt={paymentMethod.alt}
                    className={paymentMethod.size + " rounded"}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Enlaces útiles */}
          <div className="space-y-4 text-center md:text-left">
            <h3 className="font-semibold uppercase tracking-wider">
              Enlaces Útiles
            </h3>
            <nav className="space-y-1.5">
              <Link
                to="/products"
                className="block text-sm text-cream/80 hover:text-butter hover:underline hover:scale-105 transition-all ease-in-out duration-300"
              >
                Productos
              </Link>
              <Link
                to="/about"
                className="block text-sm text-cream/80 hover:text-butter hover:underline hover:scale-105 transition-all ease-in-out duration-300"
              >
                Sobre Nosotros
              </Link>
              <Link
                to="/blog"
                className="block text-sm text-cream/80 hover:text-butter hover:underline hover:scale-105 transition-all ease-in-out duration-300"
              >
                Blog
              </Link>
              <Link
                to="/contact-us"
                className="block text-sm text-cream/80 hover:text-butter hover:underline hover:scale-105 transition-all ease-in-out duration-300"
              >
                Contáctanos
              </Link>
              <Link
                to="/soporte"
                className="block text-sm text-cream/80 hover:text-butter hover:underline hover:scale-105 transition-all ease-in-out duration-300"
              >
                Soporte
              </Link>
              <Link
                to="/policies"
                className="block text-sm text-cream/80 hover:text-butter hover:underline hover:scale-105 transition-all ease-in-out duration-300"
              >
                Políticas de privacidad
              </Link>
              <Link
                to="/terms-of-use"
                className="block text-sm text-cream/80 hover:text-butter hover:underline hover:scale-105 transition-all ease-in-out duration-300"
              >
                Términos de uso
              </Link>
              <Link
                to="/conditions"
                className="block text-sm text-cream/80 hover:text-butter hover:underline hover:scale-105 transition-all ease-in-out duration-300"
              >
                Condiciones Personalizadas
              </Link>
            </nav>
          </div>

          {/* Redes sociales */}
          <div className="space-y-4 text-center md:text-left">
            <h3 className="font-semibold uppercase tracking-wider text-white">
              Síguenos
            </h3>
            <p className="text-sm text-cream/80">
              No te pierdas las novedades que Fenix Technology tiene para ti.
            </p>
            <div className="grid grid-cols-5 gap-4 mt-6 justify-items-center">
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

        {/* Línea divisoria */}
        <div className="border-t border-cocoa/70">
          <div className="py-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-cream/60">
              {new Date().getFullYear()} © Bocaditos Yomi's. ❤ Todos los
              derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="/contact-us"
                className="text-sm text-cream/60 hover:text-butter transition-colors"
              >
                Contacto
              </Link>
              <Link
                to="/contact-us#location"
                className="text-sm text-cream/60 hover:text-butter transition-colors"
              >
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};