// src/pages/ProductPage.tsx

import GridImages from "@/components/products/GridImages";
import { Separator } from "@/components/shared/Separator";
import Tag from "@/components/shared/Tag";
import { formatPrice } from "@/helpers";
import { useGetReviewsByProduct, useProduct } from "@/hooks";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ProductDescription } from "@/components/products/ProductDescription";
import { useCounterStore } from "@/store/counter.store";
import { useCartStore } from "@/store/cart.store";
import toast from "react-hot-toast";
import InputNumber from "@/components/shared/InputNumber";
import { ReviewSection } from "@/components/reviews/ReviewSection";
import { StarRating } from "@/components/reviews/StarRating";
import { useWishlist } from "@/hooks/wishlist/useWishlist";
import {
  getDiscountedPrice,
  getDiscountPercentage,
  isDiscountActive,
} from "@/lib/discount";
import { SEOHead } from "@/components/seo/SEOHead";
import {
  ShoppingCart,
  Truck,
  MessageCircle,
  ShieldCheck,
  ArrowLeft,
  Tag as TagIcon,
  Heart,
} from "lucide-react";
import { breadcrumbSchema, productSchema } from "@/components/seo/schemas";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/animations";
import { RelatedProducts } from "@/components/products/RelatedProducts";
import { ProductPageSkeleton } from "@/components/shared/skeletons/ProductPageSkeleton";

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { product, isLoading, isError } = useProduct(slug || "");
  const { count, reset, setCount } = useCounterStore();
  const addItem = useCartStore((state) => state.addItem);
  const navigate = useNavigate();
  const { isFavorite, toggle, isPending } = useWishlist();

  useEffect(() => {
    reset();
  }, [slug, reset]);

  const isOutOfStock = product?.stock === 0 || false;
  const activeDiscount = product?.discounts?.find(isDiscountActive);
  const hasDiscount = !!activeDiscount;
  const discountedPrice = getDiscountedPrice(
    product?.price || 0,
    activeDiscount,
  );

  const { data: reviews = [] } = useGetReviewsByProduct(product?.id);
  const validRatings = reviews.filter((r) => r.rating !== null);
  const averageRating =
    validRatings.length > 0
      ? validRatings.reduce((sum, r) => sum + r.rating!, 0) /
        validRatings.length
      : 0;

  const favorite = product ? isFavorite(product.id) : false;

  const addToCart = () => {
    if ((product?.stock ?? 0) > 0) {
      addItem({
        productId: product?.id || "",
        name: product?.name || "",
        image_url: product?.image_url || [],
        price: discountedPrice,
        quantity: count,
        stock: product?.stock || 0,
      });
      toast.success(`"${product?.name}" añadido al carrito`, {
        position: "bottom-right",
      });
    } else {
      toast.error("Producto agotado", { position: "bottom-right" });
    }
  };

  const buyNow = () => {
    if ((product?.stock ?? 0) > 0) {
      addItem({
        productId: product?.id || "",
        name: product?.name || "",
        image_url: product?.image_url || [],
        price: discountedPrice,
        quantity: count,
        stock: product?.stock || 0,
      });
      navigate("/checkout");
    }
  };

  if (isLoading) return <ProductPageSkeleton />;

  if (isError)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-choco dark:text-cream">
        <p className="text-lg font-semibold">Error al cargar el producto</p>
        <button
          onClick={() => navigate(-1)}
          className="btn-primary px-6 py-2.5 rounded-full text-sm"
        >
          Volver
        </button>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-choco dark:text-cream">
        <img
          src="/img/misc/NoResult.avif"
          alt="No encontrado"
          className="w-32 rounded-2xl opacity-70"
        />
        <p className="font-semibold">Producto no encontrado</p>
        <Link
          to="/products"
          className="btn-primary px-6 py-2.5 rounded-full text-sm"
        >
          Ver productos
        </Link>
      </div>
    );

  return (
    <>
      <SEOHead
        title={product.name}
        description={
          product.description || `Compra ${product.name} en Bocaditos Yomi's.`
        }
        canonical={`/products/${product.slug}`}
        ogType="product"
        ogImage={product.image_url?.[0] || undefined}
        schema={[
          productSchema({
            name: product.name,
            description: product.description || product.name,
            image: product.image_url || [],
            price: discountedPrice,
            slug: product.slug,
            inStock: !isOutOfStock,
            rating: averageRating || undefined,
            reviewCount: reviews.length || undefined,
          }),
          breadcrumbSchema([
            { name: "Inicio", url: "/" },
            { name: "Productos", url: "/products" },
            { name: product.name, url: `/products/${product.slug}` },
          ]),
        ]}
      />

      <div className="container mx-auto px-4 py-6 text-choco dark:text-cream">
        {/* Breadcrumb */}
        <FadeIn>
          <nav className="flex items-center gap-2 text-xs text-choco/50 dark:text-cream/50 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 hover:text-choco dark:hover:text-cream transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              Volver
            </button>
            <span>/</span>
            <Link
              to="/products"
              className="hover:text-choco dark:hover:text-cream transition-colors"
            >
              Productos
            </Link>
            <span>/</span>
            <span className="text-choco dark:text-cream font-medium line-clamp-1">
              {product.name}
            </span>
          </nav>
        </FadeIn>

        {/* Layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Galería */}
          <FadeIn>
            <GridImages images={product.image_url} />
          </FadeIn>

          {/* Info del producto */}
          <FadeIn delay={0.1}>
            <div className="flex flex-col gap-5">
              {/* Categoría + nombre */}
              <div>
                {product.categories?.name && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-cocoa mb-2">
                    <TagIcon className="size-3" />
                    {product.categories.name}
                  </div>
                )}
                <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Rating */}
              {reviews.length > 0 && (
                <div className="flex items-center gap-2">
                  <StarRating rating={averageRating} />
                  <span className="text-sm text-choco/60 dark:text-cream/60">
                    {averageRating.toFixed(1)} / 5 · {reviews.length}{" "}
                    {reviews.length === 1 ? "reseña" : "reseñas"}
                  </span>
                </div>
              )}

              <Separator />

              {/* Precio */}
              <div className="flex items-center gap-3 flex-wrap">
                {hasDiscount ? (
                  <>
                    <span className="text-3xl font-bold text-dorado">
                      {formatPrice(discountedPrice)}
                    </span>
                    <span className="text-lg line-through text-choco/40 dark:text-cream/40">
                      {formatPrice(product.price)}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                      -{getDiscountPercentage(product.price, activeDiscount)}%
                      OFF
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold">
                    {formatPrice(product.price)}
                  </span>
                )}
                {isOutOfStock && <Tag contentTag="Agotado" />}
              </div>

              {/* Descripción */}
              {product.description && (
                <div className="bg-cocoa/5 dark:bg-cream/5 rounded-xl p-4 border border-cocoa/10 dark:border-cream/10">
                  <p className="text-xs font-semibold uppercase tracking-wider text-choco/50 dark:text-cream/50 mb-2">
                    Descripción del producto
                  </p>
                  <div className="text-sm leading-relaxed">
                    <ProductDescription content={product.description} />
                  </div>
                </div>
              )}

              {/* Cantidad */}
              {!isOutOfStock && (
                <div className="flex items-center gap-4">
                  <p className="text-sm font-medium">Cantidad:</p>
                  <InputNumber
                    value={count}
                    min={1}
                    max={product.stock || 99}
                    onChange={(val) => setCount(val)}
                    className="w-30 text-xl"
                    classNameIcon="size-4"
                  />
                  <span className="text-xs text-choco/50 dark:text-cream/50">
                    {product.stock} disponibles
                  </span>
                </div>
              )}

              {/* Botones CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                {isOutOfStock ? (
                  <button
                    disabled
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm bg-choco/10 dark:bg-cream/10 text-choco/40 dark:text-cream/40 cursor-not-allowed border border-cocoa/20 dark:border-cream/10"
                  >
                    Agotado
                  </button>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={addToCart}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm bg-choco text-cream dark:bg-cream dark:text-oscuro hover:bg-cocoa dark:hover:bg-butter transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <ShoppingCart className="size-4" />
                    Añadir al carrito
                  </motion.button>
                )}

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={buyNow}
                  disabled={isOutOfStock}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm border-2 border-choco dark:border-cream text-choco dark:text-cream hover:bg-choco hover:text-cream dark:hover:bg-cream dark:hover:text-oscuro transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ShieldCheck className="size-4" />
                  Comprar ahora
                </motion.button>

                {/* Botón favorito */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggle(product.id)}
                  disabled={isPending}
                  aria-label={
                    favorite ? "Quitar de favoritos" : "Guardar en favoritos"
                  }
                  className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold text-sm border-2 transition-all duration-200 disabled:opacity-50 ${
                    favorite
                      ? "border-[#E0B08E] bg-[#E0B08E]/10 text-[#E0B08E] dark:border-[#E0B08E] dark:bg-[#E0B08E]/10 dark:text-[#E0B08E]"
                      : "border-cocoa/30 dark:border-cream/20 text-choco/60 dark:text-cream/60 hover:border-[#E0B08E]/60 hover:text-[#E0B08E] dark:hover:border-[#E0B08E]/50 dark:hover:text-[#E0B08E]"
                  }`}
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
                        className={`size-5 ${favorite ? "fill-red-500 text-red-500" : ""}`}
                      />
                    </motion.span>
                  </AnimatePresence>
                  <span className="hidden sm:inline">
                    {favorite ? "Guardado" : "Guardar"}
                  </span>
                </motion.button>
              </div>

              {/* Beneficios */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-cocoa/5 dark:bg-cream/5 border border-cocoa/10 dark:border-cream/10">
                  <Truck className="size-5 text-choco/60 dark:text-cream/60 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold">Envío gratis</p>
                    <p className="text-[11px] text-choco/50 dark:text-cream/50">
                      En pedidos seleccionados
                    </p>
                  </div>
                </div>
                <Link
                  to="/contact-us"
                  className="flex items-center gap-3 p-3 rounded-xl bg-cocoa/5 dark:bg-cream/5 border border-cocoa/10 dark:border-cream/10 hover:bg-cocoa/10 dark:hover:bg-cream/10 transition-colors group"
                >
                  <MessageCircle className="size-5 text-choco/60 dark:text-cream/60 shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-xs font-semibold">¿Dudas?</p>
                    <p className="text-[11px] text-choco/50 dark:text-cream/50">
                      Contáctanos aquí
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Reseñas */}
        <div className="mt-16 border-t border-cocoa/10 dark:border-cream/10">
          {product.id && <ReviewSection productId={product.id} />}
        </div>

        {product.category_id && (
          <RelatedProducts
            categoryId={product.category_id}
            excludeSlug={product.slug}
            categoryName={product.categories?.name}
          />
        )}
      </div>
    </>
  );
};

export default ProductPage;