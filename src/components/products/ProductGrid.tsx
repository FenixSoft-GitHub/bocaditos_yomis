import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Product } from "@/interfaces/product.interface"; 
import { CardProduct } from "@/components/products/CardProduct";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { useState } from "react";

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
    slides: {
      perView: 1,
      spacing: 16,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: { perView: 2, spacing: 20 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 4, spacing: 24 },
      },
    },
    slideChanged: (s) => {
      setCurrentSlide(s.track.details.rel); // Índice actual
    },
    created(s) {
      let perView = 1;

      const slidesOption = s.options.slides;
      if (
        typeof slidesOption === "object" &&
        slidesOption !== null &&
        "perView" in slidesOption
      ) {
        const rawPerView = slidesOption.perView;
        if (typeof rawPerView === "number") {
          perView = rawPerView;
        }
      }

      setMaxSlide(s.track.details.slides.length - perView);
    },
  });

  return (
    <div className="py-8 relative">
      <div className="flex items-center justify-center gap-2 md:gap-6 mb-8">
        {icon && (
          <div className="text-2xl font-semibold text-center md:text-4xl lg:text-5xl drop-shadow-[0_3px_3px_rgba(0,0,0,0.5)]">
            {icon}
          </div>
        )}
        <h2 className="text-2xl font-semibold text-center md:text-4xl lg:text-5xl drop-shadow-[0_3px_3px_rgba(0,0,0,0.5)]">
          {title}
        </h2>
      </div>

      <div ref={sliderRef} className="keen-slider">
        {products.map((product) => (
          <div
            key={product.id}
            className="keen-slider__slide shrink-0 min-w-0 transition-transform duration-200"
          >
            <CardProduct product={product} />
          </div>
        ))}
      </div>

      {showNavigation && slider && (
        <>
          <button
            onClick={() => slider.current?.prev()}
            disabled={currentSlide === 0}
            className={`absolute top-[50%] -left-4 z-10 p-2 rounded-full transition ${
              currentSlide === 0
                ? "hidden"
                : "bg-choco/80 text-cream hover:bg-oscuro/90 dark:bg-cream/80 dark:text-choco dark:hover:bg-butter/90 hover:scale-110"
            }`}
          >
            <FaChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => slider.current?.next()}
            disabled={currentSlide >= maxSlide}
            className={`absolute top-[50%] -right-4 z-10 p-2 rounded-full transition ${
              currentSlide >= maxSlide
                ? "hidden"
                : "bg-choco/80 text-cream hover:bg-oscuro/90 dark:bg-cream/80 dark:text-choco dark:hover:bg-butter/90 hover:scale-110"
            }`}
          >
            <FaChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
};