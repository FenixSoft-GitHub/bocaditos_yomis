import React from "react";
import { socialLinks } from "@/constants/SocialLink";

export const SocialLinks: React.FC = () => {
  return (

    <section className="max-w-3xl mx-auto px-4 py-20 text-choco dark:text-cream ">
      <h2 className="text-3xl font-bold text-center mb-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]">
        Nuestras Redes Sociales
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-8 justify-items-center py-5 px-10 lg:py-10 lg:px-20">
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.title}
            className={link.className2}
          >
            {link.icon}
          </a>
        ))}
      </div>
    </section>
  );
};