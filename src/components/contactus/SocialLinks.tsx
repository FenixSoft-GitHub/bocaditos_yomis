// import React from "react";
import { socialLinks } from "@/constants/SocialLink";

export const SocialLinks = () => (
  <div className="flex flex-col gap-4 mb-4">
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-cocoa mb-1">
        Redes Sociales
      </p>
      <h3 className="text-xl font-bold text-choco dark:text-cream">
        Síguenos y forma parte
      </h3>
      <p className="text-sm text-choco/60 dark:text-cream/60 mt-1">
        Entérate primero de nuestras novedades, ofertas y recetas especiales.
      </p>
    </div>

    <div className="flex flex-wrap gap-3 mt-2 justify-center">
      {socialLinks.map((link, index) => (
        <a
          key={index}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.title}
          className={link.className2}
        >
          <span className="transition-transform duration-200">
            {link.icon}
          </span>
          <span className="text-xs font-medium">
            {link.title}
          </span>
        </a>
      ))}
    </div>
  </div>
);