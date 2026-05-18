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
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-cocoa/5 dark:bg-cream/5 border border-cocoa/10 dark:border-cream/10 hover:bg-cocoa/10 dark:hover:bg-cream/10 transition-all duration-200 hover:scale-105 group"
        >
          <span className="text-choco dark:text-cream group-hover:scale-110 transition-transform duration-200">
            {link.icon}
          </span>
          <span className="text-xs font-medium text-choco/70 dark:text-cream/70 group-hover:text-choco dark:group-hover:text-cream transition-colors">
            {link.title}
          </span>
        </a>
      ))}
    </div>
  </div>
);

// import React from "react";
// import { socialLinks } from "@/constants/SocialLink";

// export const SocialLinks: React.FC = () => {
//   return (

//     <section className="max-w-3xl mx-auto px-4 py-20 text-choco dark:text-cream ">
//       <h2 className="text-3xl font-bold text-center mb-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]">
//         Nuestras Redes Sociales
//       </h2>
//       <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-8 justify-items-center py-5 px-10 lg:py-10 lg:px-20">
//         {socialLinks.map((link, index) => (
//           <a
//             key={index}
//             href={link.href}
//             target="_blank"
//             rel="noopener noreferrer"
//             aria-label={link.title}
//             className={link.className2}
//           >
//             {link.icon}
//           </a>
//         ))}
//       </div>
//     </section>
//   );
// };
