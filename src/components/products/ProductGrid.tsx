import {
  useKeenSlider,
  KeenSliderInstance,
  KeenSliderOptions,
} from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Product } from "@/interfaces/product.interface";
import { CardProduct } from "@/components/products/CardProduct";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { StaggerList, StaggerItem } from "@/components/animations";

interface Props {
  title: string;
  products: Product[];
  showNavigation?: boolean;
  icon?: React.ReactNode;
}

export const ProductGrid = ({
  title,
  products,
  showNavigation = true,
  icon,
}: Props) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [perView, setPerView] = useState(1);
  const [maxSlide, setMaxSlide] = useState(0);
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    slides: { perView: 1, spacing: 16 },
    breakpoints: {
      "(min-width: 640px)": { slides: { perView: 2, spacing: 20 } },
      "(min-width: 1024px)": { slides: { perView: 4, spacing: 24 } },
    },
    slideChanged: (s) => {
      setCurrentSlide(s.track.details.rel);
    },
    created: (s) => {
      // Calcular maxSlide inicialmente
      updateMaxSlide(s);
    },
    updated: (s) => {
      // Recalcular cuando el slider se actualice (resize, productos cambiados, etc.)
      updateMaxSlide(s);
    },
  });

  // Función helper para calcular maxSlide correctamente
  const updateMaxSlide = (s: KeenSliderInstance) => {
    const slidesOptions = s.options.slides as KeenSliderOptions["slides"];

    const currentPerView =
      typeof slidesOptions === "object" &&
      typeof slidesOptions?.perView === "number"
        ? slidesOptions.perView
        : 1;

    setPerView(currentPerView); // <--- Guardamos el perView actual

    const totalSlides = s.track.details.slides.length;
    const max = Math.max(0, totalSlides - currentPerView);
    setMaxSlide(max);
  };
  
  // Actualizar maxSlide cuando cambien los productos
  useEffect(() => {
    if (slider.current) {
      updateMaxSlide(slider.current);
    }
  }, [products, slider]);

  return (
    <div className="py-8 relative">
      <StaggerList className="flex items-center justify-center gap-2 md:gap-6 mb-8">
        <StaggerItem>
          <div className="flex items-center gap-3">
            {icon && (
              <div className="text-2xl md:text-4xl lg:text-5xl drop-shadow-[0_3px_3px_rgba(0,0,0,0.5)]">
                {icon}
              </div>
            )}
            <h2 className="text-2xl font-semibold text-center md:text-4xl lg:text-5xl drop-shadow-[0_3px_3px_rgba(0,0,0,0.5)]">
              {title}
            </h2>
          </div>
        </StaggerItem>
      </StaggerList>

      <div ref={sliderRef} className="keen-slider">
        {products.map((product) => (
          <div key={product.id} className="keen-slider__slide shrink-0 min-w-0">
            <CardProduct product={product} />
          </div>
        ))}
      </div>

      {showNavigation && slider && products.length > 0 && (
        <>
          {/* Botón Anterior con Sombras Mejoradas */}
          <button
            onClick={() => {
              if (!slider.current) return;
              const targetSlide = Math.max(0, currentSlide - perView);
              slider.current.moveToIdx(targetSlide);
            }}
            disabled={currentSlide === 0}
            aria-label="Anterior"
            className={`group absolute top-1/2 -left-4 z-10 p-1.5 rounded-full transform -translate-y-1/2 transition-all duration-300 ease-in-out
      ${
        currentSlide === 0
          ? "opacity-0 pointer-events-none scale-75"
          : "bg-choco/80 text-cream dark:bg-cream/80 dark:text-choco hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl dark:shadow-md dark:hover:shadow-lg"
      }`}
          >
            <ChevronLeft className="size-5" strokeWidth={3.5} />

            {/* Tooltip Desktop */}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 scale-75 opacity-0 pointer-events-none transition-all duration-200 ease-out hidden md:block md:group-hover:opacity-100 md:group-hover:scale-100 px-2.5 py-1 text-[10px] rounded-md whitespace-nowrap shadow-sm bg-oscuro text-cream dark:bg-choco dark:text-cream">
              Anterior
            </span>
          </button>

          {/* Botón Siguiente */}
          <button
            onClick={() => {
              if (!slider.current) return;
              const targetSlide = Math.min(maxSlide, currentSlide + perView);
              slider.current.moveToIdx(targetSlide);
            }}
            disabled={currentSlide >= maxSlide}
            aria-label="Siguiente"
            className={`group absolute top-1/2 -right-4 z-10 p-1.5 rounded-full transform -translate-y-1/2 transition-all duration-300 ease-in-out
      ${
        currentSlide >= maxSlide
          ? "opacity-0 pointer-events-none scale-75"
          : "bg-choco/80 text-cream dark:bg-cream/80 dark:text-choco hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl dark:shadow-md dark:hover:shadow-lg"
      }`}
          >
            <ChevronRight className="size-5" strokeWidth={3.5} />
            {/* Tooltip Desktop */}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 scale-75 opacity-0 pointer-events-none transition-all duration-200 ease-out hidden md:block md:group-hover:opacity-100 md:group-hover:scale-100 px-2.5 py-1 text-[10px] rounded-md whitespace-nowrap shadow-sm bg-oscuro text-cream dark:bg-choco dark:text-cream">
              Siguiente
            </span>
          </button>
        </>
      )}
    </div>
  );
};