import { useEffect, useRef } from "react";
import { sponsors } from "@/constants/Sponsors";

export const SponsorCarousel = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animationFrame: number;
    let lastTimestamp = performance.now();
    const speed = 45; // px/s

    const animate = (now: number) => {
      const elapsed = now - lastTimestamp;
      lastTimestamp = now;
      track.scrollLeft += (speed * elapsed) / 1000;
      if (track.scrollLeft >= track.scrollWidth / 2) {
        track.scrollLeft = Math.floor(track.scrollLeft - track.scrollWidth / 2);
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

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
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-fondo dark:from-fondo-dark to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-fondo dark:from-fondo-dark to-transparent z-10" />

        <div
          ref={trackRef}
          className="overflow-x-scroll scrollbar-none flex gap-20 whitespace-nowrap px-10 mt-8"
          style={{ scrollBehavior: "auto" }}
        >
          {[...sponsors, ...sponsors].map((logo, i) => (
            <div
              key={i}
              className="flex items-center justify-center shrink-0 size-24 rounded-full bg-cocoa/50 dark:bg-cocoa/70 border border-cocoa/10 dark:border-cocoa/10 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <img
                src={logo}
                alt={`producto-${i}`}
                className="size-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};