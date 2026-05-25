import { useEffect, useRef, useState } from "react";
import { sponsors } from "@/constants/Sponsors";

export const SponsorCarousel = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animationFrame: number;
    let lastTimestamp = performance.now();
    const speed = 80; // px/s - MÁS RÁPIDO (casi el doble)

    const animate = (now: number) => {
      if (!isPaused) {
        const elapsed = now - lastTimestamp;
        lastTimestamp = now;

        track.scrollLeft += (speed * elapsed) / 1000;

        // Loop infinito optimizado
        const halfScrollWidth = track.scrollWidth / 2;
        if (track.scrollLeft >= halfScrollWidth) {
          track.scrollLeft -= halfScrollWidth;
        }
      } else {
        // Actualizar timestamp aunque esté pausado para evitar saltos
        lastTimestamp = now;
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isPaused]); // Depender de isPaused para reiniciar correctamente

  if (!sponsors || sponsors.length === 0) return null;

  return (
    <div className="bg-fondo dark:bg-fondo-dark border-t border-cocoa/10 dark:border-cream/10 py-12">
      <div className="container mx-auto px-4 mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-cocoa dark:text-cocoa mb-2">
          Lo que ofrecemos
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-choco dark:text-cream">
          Nuestra variedad artesanal
        </h2>
        <p className="text-sm text-choco/60 dark:text-cream/60 mt-2 max-w-md mx-auto leading-relaxed">
          Desde chocolates hasta café, elaborados con ingredientes de la más
          alta calidad para que disfrutes cada sabor.
        </p>
      </div>

      {/* Track con fade en los bordes */}
      <div className="relative w-full overflow-hidden">
        <div
          className="pointer-events-none absolute left-0 top-0 h-full w-20 md:w-32 bg-gradient-to-r from-fondo dark:from-fondo-dark to-transparent z-10"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-0 top-0 h-full w-20 md:w-32 bg-gradient-to-l from-fondo dark:from-fondo-dark to-transparent z-10"
          aria-hidden="true"
        />

        <div
          ref={trackRef}
          className="overflow-x-scroll scrollbar-none flex gap-16 md:gap-20 whitespace-nowrap px-10 mt-8 group"
          style={{ scrollBehavior: "auto" }} // SIEMPRE auto para evitar conflictos
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          role="list"
        >
          {[...sponsors, ...sponsors].map((logo, i) => (
            <div
              key={i}
              className="flex items-center justify-center shrink-0 size-16 md:h-20 md:w-28 rounded-lg bg-cocoa/50 dark:bg-cocoa/70 border border-cocoa/10 dark:border-cocoa/10 shadow-sm hover:shadow-md transition-all duration-300 group/logo"
              role="listitem"
            >
              <img
                src={logo}
                alt={`Producto artesanal ${Math.floor(i / sponsors.length) + 1}`}
                className="size-14 md:size-16 object-contain grayscale group-hover/logo:grayscale-0 transition-all duration-300 group-hover/logo:scale-110"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};