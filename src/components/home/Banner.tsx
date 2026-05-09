import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { BannerImages } from "@/constants/BannerImages";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % BannerImages.length);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + BannerImages.length) % BannerImages.length,
    );
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(goToNext, 8000);
    return () => clearInterval(interval);
  }, [isPaused, goToNext]);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "85svh", minHeight: "480px" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Banner principal"
    >
      {BannerImages.map((item, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <img
            src={item.image}
            alt={item.title}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </div>
      ))}

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-8 text-center text-cream">
        <h1 className="max-w-4xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg mb-4">
          {BannerImages[currentIndex].title}
        </h1>
        <p className="max-w-xl text-base sm:text-lg text-cream/90 drop-shadow mb-8">
          {BannerImages[currentIndex].subtitle}
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-cream text-choco hover:bg-butter font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cream focus:ring-offset-2 focus:ring-offset-black/40"
        >
          Ver Productos
        </Link>
      </div>

      <div className="absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between px-3 sm:px-6 pointer-events-none">
        <button
          onClick={goToPrev}
          className="pointer-events-auto bg-black/30 hover:bg-black/60 text-cream p-2 sm:p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
          aria-label="Imagen anterior"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={goToNext}
          className="pointer-events-auto bg-black/30 hover:bg-black/60 text-cream p-2 sm:p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
          aria-label="Imagen siguiente"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      <div className="absolute bottom-5 left-0 right-0 z-20 flex justify-center gap-2">
        {BannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Ir a imagen ${index + 1}`}
            className={`rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-cream w-6 h-2"
                : "bg-cream/50 w-2 h-2 hover:bg-cream/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Banner;
