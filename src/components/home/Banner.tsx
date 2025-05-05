import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BannerImages } from "@/constants/BannerImages";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Banner = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Cambiar imagen automáticamente cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % BannerImages.length
      );
    }, 8000); // Cambia cada 8 segundos

    return () => clearInterval(interval); // Limpia el intervalo al desmontar
  }, []);

  // Navegación manual
  const goToPrev = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + BannerImages.length) % BannerImages.length
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % BannerImages.length);
  };

  return (
    <div className="relative bg-gray-900 text-white w-full h-screen overflow-hidden">
      {/* Imagen de fondo dinámica */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
        style={{
          backgroundImage: `url(${BannerImages[currentImageIndex].image})`,
          opacity: 0.9,
        }}
      />

      {/* Capa de oscurecimiento */}
      <div className="absolute inset-0 bg-black opacity-10 h-full w-full" />

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full py-16 px-4 sm:px-6 md:px-8 lg:py-32 text-center">
        <h2 className="max-w-5xl text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          {BannerImages[currentImageIndex].title}
        </h2>
        <p className="text-base sm:text-lg text-white mb-6 max-w-2xl">
          {BannerImages[currentImageIndex].subtitle}
        </p>
        <Link
          to="/products"
          className="bg-cream hover:bg-transparent hover:text-white text-gray-900 font-semibold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out hover:scale-105 mt-4 outline-2 outline-offset-2 outline-cream"
        >
          Ver Productos
        </Link>

        {/* Controles de navegación */}
        <div className="absolute bottom-6 sm:bottom-14 flex justify-center items-center gap-8 w-full">
          <button
            onClick={goToPrev}
            className="bg-black/40 p-2 sm:p-3 rounded-full hover:bg-black/70 transition"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="text-cream w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={goToNext}
            className="bg-black/40 p-2 sm:p-3 rounded-full hover:bg-black/70 transition"
            aria-label="Imagen siguiente"
          >
            <ChevronRight className="text-cream w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        {/* Dots indicadores */}
        <div className="absolute bottom-10 flex gap-2 justify-center w-full">
          {BannerImages.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentImageIndex ? "bg-cream" : "bg-cream/50"
              } transition-all duration-300`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
