import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Product } from "@/interfaces/product.interface";
import { CardProduct } from "@/components/products/CardProduct";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
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
  const [maxSlide, setMaxSlide] = useState(0);

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    slides: { perView: 1, spacing: 16 },
    breakpoints: {
      "(min-width: 640px)": { slides: { perView: 2, spacing: 20 } },
      "(min-width: 1024px)": { slides: { perView: 4, spacing: 24 } },
    },
    slideChanged: (s) => setCurrentSlide(s.track.details.rel),
    created(s) {
      let perView = 1;
      const slidesOption = s.options.slides;
      if (
        typeof slidesOption === "object" &&
        slidesOption !== null &&
        "perView" in slidesOption
      ) {
        const rawPerView = slidesOption.perView;
        if (typeof rawPerView === "number") perView = rawPerView;
      }
      setMaxSlide(s.track.details.slides.length - perView);
    },
  });

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

      {showNavigation && slider && (
        <>
          <button
            onClick={() => slider.current?.prev()}
            disabled={currentSlide === 0}
            aria-label="Anterior"
            className={`absolute top-[50%] -left-4 z-10 p-2 rounded-full transition-all ${currentSlide === 0 ? "hidden" : "bg-choco/80 text-cream hover:bg-oscuro/90 dark:bg-cream/80 dark:text-choco dark:hover:bg-butter/90 hover:scale-110 shadow-md"}`}
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            onClick={() => slider.current?.next()}
            disabled={currentSlide >= maxSlide}
            aria-label="Siguiente"
            className={`absolute top-[50%] -right-4 z-10 p-2 rounded-full transition-all ${currentSlide >= maxSlide ? "hidden" : "bg-choco/80 text-cream hover:bg-oscuro/90 dark:bg-cream/80 dark:text-choco dark:hover:bg-butter/90 hover:scale-110 shadow-md"}`}
          >
            <ChevronRight className="size-5" />
          </button>
        </>
      )}
    </div>
  );
};
