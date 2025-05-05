import { useEffect, useRef } from 'react';
import { sponsors } from '@/constants/Sponsors';

export const SponsorCarousel = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animationFrame: number;
    let lastTimestamp = performance.now();
    const speed = 50; // px/s

    const animate = (now: number) => {
      const elapsed = now - lastTimestamp;
      lastTimestamp = now;

      track.scrollLeft += (speed * elapsed) / 1000;

      // Si llegamos a la mitad del contenido, volvemos sin que se note
      if (track.scrollLeft >= track.scrollWidth / 2) {
        track.scrollLeft = Math.floor(track.scrollLeft - track.scrollWidth / 2);
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="flex flex-col items-center gap-3 pt-6 pb-8 text-choco dark:text-cream">
      <h2 className="font-bold text-2xl">Productos que disponemos</h2>

      <p className="w-2/3 text-center text-sm md:text-base">
        Tenemos los mejores productos para ti, desde chocolates hasta café, todos
        elaborados con ingredientes de la más alta calidad. ¡Descúbrelos y disfruta de su sabor único!
      </p>
      <div className="relative w-full overflow-hidden py-6 dark:bg-cocoa/60 rounded-lg my-6">
        {/* Gradientes laterales */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-fondo via-fondo/80 to-transparent dark:from-fondo-dark dark:via-fondo-dark/80 z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-fondo via-fondo/80 to-transparent dark:from-fondo-dark dark:via-fondo-dark/80 z-10" />

        <div
          ref={trackRef}
          className="overflow-x-scroll scrollbar-none flex gap-20 whitespace-nowrap px-10"
          style={{ scrollBehavior: "auto" }}
        >
          {[...sponsors, ...sponsors].map((logo, i) => (
            <img
              key={i}
              src={logo}
              alt={`sponsor-${i}`}
              className="h-20 w-auto object-contain grayscale hover:grayscale-0 transition duration-300"
            />
          ))}
        </div>
      </div>
    </div>
  );
};