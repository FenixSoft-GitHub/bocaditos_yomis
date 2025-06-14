import { Product } from "@/interfaces/product.interface"; 
import { FaCartPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Tag from "@/components/shared/Tag";
import { formatPrice } from "@/helpers";
import { useAddToCart } from "@/hooks/products/useAddToCart";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import {
  getDiscountedPrice,
  getDiscountPercentage,
  isDiscountActive,
} from "@/lib/discount";

interface CardProductProps {
  product: Product; 
}

export const CardProduct = ({ product }: CardProductProps) => {
  const { addToCart } = useAddToCart();

  const handleAddClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    addToCart(product, finalPrice);
  };
  
  const activeDiscount =
    product.discount && isDiscountActive(product.discount)
      ? product.discount
      : null;

  const discountPercentage = activeDiscount
    ? getDiscountPercentage(product.price, activeDiscount)
    : null;

  const finalPrice = activeDiscount
    ? getDiscountedPrice(product.price, activeDiscount)
    : product.price;

  return (
    <div className="group h-full flex flex-col justify-between border border-cocoa/50 dark:border-cream/30 dark:hover:border-cream/80 rounded-lg bg-cream overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 text-choco dark:text-cream dark:bg-fondo-dark">
      <Link
        to={`/products/${product.slug}`}
        className="block relative w-full aspect-square overflow-hidden"
      >
        <ImageWithFallback
          src={product.image_url[0]}
          fallbackSrc="/img/misc/fallback-product.avif"
          alt={`Imagen de ${product.name}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {product.stock === 0 && (
          <div className="absolute top-2 right-2">
            <Tag contentTag="agotado" />
          </div>
        )}

        {discountPercentage && (
          <div className="absolute top-2 left-2">
            <Tag contentTag={`${discountPercentage}% OFF`} />
          </div>
        )}
      </Link>

      <div className="flex flex-col gap-2 px-4 pb-4 pt-2">
        <h3 className="text-base font-semibold line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          {activeDiscount ? (
            <div className="flex flex-col items-start">
              <span className="line-through text-sm text-gray-500 dark:text-gray-400">
                {formatPrice(product.price)}
              </span>
              <span className="text-amber-500 text-lg font-bold">
                {formatPrice(getDiscountedPrice(product.price, activeDiscount))}
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold">
              {formatPrice(product.price)}
            </span>
          )}

          <button
            onClick={handleAddClick}
            disabled={product.stock === 0}
            className={`w-fit flex items-center justify-center rounded-full p-3 transition-all ${
              product.stock === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-choco/90 text-cream dark:bg-cream/70 dark:text-choco hover:bg-choco dark:hover:bg-cream hover:scale-105 active:scale-95"
            }`}
          >
            <FaCartPlus className="size-5.5" />
          </button>
        </div>
      </div>
    </div>
  );
};