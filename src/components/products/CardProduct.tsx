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

interface CardProductProps {
  product: Product;
}

export const CardProduct = ({ product }: CardProductProps) => {
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
      // 1. Elevación al hover + sombra más suave y natural
      whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.12)" }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={`group h-full flex flex-col border border-cocoa/20 dark:border-cream/10 rounded-2xl bg-cream dark:bg-fondo-dark overflow-hidden ${
        isOutOfStock ? "opacity-70 grayscale-[0.5]" : ""
      }`}
    >
      {/* ── Imagen ─────────────────────────────────────────────── */}
      <Link
        to={`/products/${product.slug}`}
        className="block relative w-full aspect-square overflow-hidden bg-cocoa/5 dark:bg-cream/5"
        aria-label={`Ver detalles de ${product.name}`}
        tabIndex={-1}
      >
        <ImageWithFallback
          src={product.image_url[0]}
          fallbackSrc="/img/misc/fallback-product.avif"
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            !isOutOfStock ? "group-hover:scale-105" : ""
          }`}
          loading="lazy"
        />

        {/* Gradiente inferior sutil para mejorar lectura si hubiera texto encima */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

        {/* Badge descuento */}
        {discountPercentage && !isOutOfStock && (
          <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-1 rounded-full bg-red-500/90 text-white shadow-sm backdrop-blur-sm">
            -{discountPercentage}% Desc.
          </span>
        )}

        {/* Badge agotado */}
        {isOutOfStock && (
          <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-1 rounded-full bg-black/60 text-white shadow-sm backdrop-blur-sm">
            Agotado
          </span>
        )}

        {/* Botón favorito */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={handleFavoriteClick}
          disabled={isPending}
          aria-label={favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
          className="absolute top-2.5 right-2.5 size-8 rounded-full bg-white/90 dark:bg-oscuro/80 backdrop-blur-md flex items-center justify-center shadow-md hover:scale-110 transition-transform disabled:opacity-50 border border-cocoa/10 dark:border-cream/10"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={favorite ? "filled" : "empty"}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Heart
                className={`size-4 transition-colors ${
                  favorite
                    ? "fill-red-500 text-red-500"
                    : "text-choco/50 dark:text-cream/50"
                }`}
              />
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </Link>

      {/* ── Info ───────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-4 gap-3 justify-between">
        <div>
          {/* Categoría: Más sutil para dar prioridad al nombre */}
          {product.categories?.name && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-cocoa/60 dark:text-cream/40 mb-1">
              {product.categories.name}
            </p>
          )}

          {/* Título: Más legible y con hover interactivo */}
          <Link to={`/products/${product.slug}`}>
            <h3 className="text-sm font-semibold text-choco dark:text-cream line-clamp-2 leading-snug group-hover:text-cocoa dark:group-hover:text-cocoa transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Footer: Precio y Carrito */}
        <div className="flex items-center justify-between mt-2 pt-3 border-t border-cocoa/10 dark:border-cream/10">
          <div className="flex flex-col">
            {activeDiscount ? (
              <>
                <span className="text-[10px] line-through text-choco/40 dark:text-cream/40 leading-none">
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

          {/* Botón Carrito con Tooltip */}
          <div className="relative group/cart">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleAddClick}
              disabled={isOutOfStock}
              aria-label={`Añadir ${product.name} al carrito`}
              className={`size-9 rounded-xl flex items-center justify-center transition-all shrink-0 shadow-sm ${
                isOutOfStock
                  ? "bg-cocoa/10 dark:bg-cream/10 cursor-not-allowed opacity-50"
                  : "bg-cocoa/10 dark:bg-cream/10 hover:bg-choco dark:hover:bg-cream hover:text-cream dark:hover:text-choco hover:shadow-md"
              }`}
            >
              <ShoppingCart className="size-4" />
            </motion.button>

            {/* Tooltip */}
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-choco dark:bg-cream text-cream dark:text-choco text-[10px] font-medium px-2 py-1 rounded shadow-lg whitespace-nowrap opacity-0 group-hover/cart:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
              Agregar
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
};