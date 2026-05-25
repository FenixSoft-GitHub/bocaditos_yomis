// src/components/products/CardProductList.tsx
// Variante de lista horizontal para ProductsPage

import { Product } from "@/interfaces/product.interface";
import { ShoppingCart, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/helpers";
import { useAddToCart } from "@/hooks/products/useAddToCart";
import { useWishlist } from "@/hooks/wishlist/useWishlist";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import {
  getDiscountedPrice,
  getDiscountPercentage,
  isDiscountActive,
} from "@/lib/discount";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  product: Product;
}

export const CardProductList = ({ product }: Props) => {
  const { addToCart } = useAddToCart();
  const { isFavorite, toggle, isPending } = useWishlist();

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
  const favorite = isFavorite(product.id);

  const handleAddClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    addToCart(product, finalPrice);
  };

  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toggle(product.id);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={`flex items-center gap-4 p-3 rounded-2xl border border-cocoa/20 dark:border-cream/10 bg-cream dark:bg-fondo-dark ${
        isOutOfStock ? "opacity-75" : ""
      }`}
    >
      {/* Imagen */}
      <Link
        to={`/products/${product.slug}`}
        className="relative shrink-0 size-20 sm:size-24 rounded-xl overflow-hidden bg-cocoa/5 dark:bg-cream/5"
        tabIndex={-1}
        aria-label={`Ver ${product.name}`}
      >
        <ImageWithFallback
          src={product.image_url[0]}
          fallbackSrc="/img/misc/fallback-product.avif"
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-xl">
            <span className="text-[10px] font-semibold text-white">
              Agotado
            </span>
          </div>
        )}
        {discountPercentage && !isOutOfStock && (
          <span className="absolute top-1.5 left-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-red-500 text-white">
            -{discountPercentage}%
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        {product.categories?.name && (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-cocoa/60 dark:text-cream/40 mb-0.5">
            {product.categories.name}
          </p>
        )}
        <Link to={`/products/${product.slug}`}>
          <h3 className="text-sm font-semibold text-choco dark:text-cream hover:text-cocoa dark:hover:text-cocoa transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        {product.description && (
          <p className="text-xs text-choco/50 dark:text-cream/50 mt-0.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
      </div>

      {/* Precio + acciones */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex flex-col items-end">
          {activeDiscount ? (
            <>
              <span className="text-[11px] line-through text-choco/40 dark:text-cream/40 leading-none">
                {formatPrice(product.price)}
              </span>
              <span className="text-base font-bold text-amber-700 dark:text-dorado leading-tight">
                {formatPrice(finalPrice)}
              </span>
            </>
          ) : (
            <span
              className={`text-base font-bold leading-tight ${
                isOutOfStock
                  ? "text-choco/40 dark:text-cream/40"
                  : "text-choco dark:text-cream"
              }`}
            >
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Favorito */}
        <motion.button
          whileTap={{ scale: 0.82 }}
          onClick={handleFavoriteClick}
          disabled={isPending}
          aria-label={favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
          className="size-9 rounded-xl flex items-center justify-center bg-cocoa/5 dark:bg-cream/5 hover:bg-cocoa/10 dark:hover:bg-cream/10 transition-colors disabled:opacity-50"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={favorite ? "filled" : "empty"}
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.6 }}
              transition={{ duration: 0.15 }}
            >
              <Heart
                className={`size-4 ${favorite ? "fill-red-500 text-red-500" : "text-choco/50 dark:text-cream/50"}`}
              />
            </motion.span>
          </AnimatePresence>
        </motion.button>

        {/* Carrito */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={handleAddClick}
          disabled={isOutOfStock}
          aria-label={`Añadir ${product.name} al carrito`}
          className={`size-9 rounded-xl flex items-center justify-center transition-colors ${
            isOutOfStock
              ? "bg-cocoa/5 dark:bg-cream/5 cursor-not-allowed opacity-40"
              : "bg-choco dark:bg-cream text-cream dark:text-oscuro hover:bg-cocoa dark:hover:bg-butter"
          }`}
        >
          <ShoppingCart className="size-4" />
        </motion.button>
      </div>
    </motion.article>
  );
};