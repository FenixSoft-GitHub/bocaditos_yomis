import { Product } from "@/interfaces/product.interface";
import { ShoppingCart } from "lucide-react";
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
import { motion } from "framer-motion";

interface CardProductProps {
  product: Product;
}

export const CardProduct = ({ product }: CardProductProps) => {
  const { addToCart } = useAddToCart();
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
  const isOutOfStock = product.stock === 0;

  const handleAddClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    addToCart(product, finalPrice);
  };

  return (
    <motion.article
      whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.12)" }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group h-full flex flex-col border border-cocoa/30 dark:border-cream/10 rounded-xl bg-cream dark:bg-fondo-dark overflow-hidden shadow-sm"
    >
      <Link
        to={`/products/${product.slug}`}
        className="block relative w-full aspect-square overflow-hidden"
        aria-label={`Ver ${product.name}`}
      >
        <ImageWithFallback
          src={product.image_url[0]}
          fallbackSrc="/img/misc/fallback-product.avif"
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 right-2 flex justify-between">
          {discountPercentage && (
            <Tag contentTag={`${discountPercentage}% OFF`} />
          )}
          {isOutOfStock && <Tag contentTag="Agotado" />}
        </div>
      </Link>

      <div className="flex flex-col gap-3 p-4 flex-1 justify-between">
        <Link to={`/products/${product.slug}`}>
          <h3 className="text-sm font-semibold text-choco dark:text-cream line-clamp-2 hover:text-cocoa dark:hover:text-cocoa transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col">
            {activeDiscount ? (
              <>
                <span className="text-xs line-through text-choco/40 dark:text-cream/40">
                  {formatPrice(product.price)}
                </span>
                <span className="text-base font-bold text-dorado">
                  {formatPrice(finalPrice)}
                </span>
              </>
            ) : (
              <span className="text-base font-bold text-choco dark:text-cream">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={handleAddClick}
            disabled={isOutOfStock}
            aria-label={`Añadir ${product.name} al carrito`}
            className={`flex items-center justify-center rounded-full p-2.5 transition-colors duration-200 ${
              isOutOfStock
                ? "bg-choco/10 dark:bg-cream/10 cursor-not-allowed opacity-50"
                : "bg-choco dark:bg-cream/80 text-cream dark:text-choco hover:bg-cocoa dark:hover:bg-cream shadow-sm"
            }`}
          >
            <ShoppingCart className="size-4" />
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};