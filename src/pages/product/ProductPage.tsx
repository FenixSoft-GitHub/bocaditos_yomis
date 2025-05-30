import GridImages from "@/components/products/GridImages";
import { Loader } from "@/components/shared/Loader";
import { Separator } from "@/components/shared/Separator";
import Tag from "@/components/shared/Tag";
import { formatPrice } from "@/helpers";
import { useGetReviewsByProduct, useProduct } from "@/hooks";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { CiDeliveryTruck } from "react-icons/ci";
import { BsChatLeftText } from "react-icons/bs";
import { ProductDescription } from "@/components/products/ProductDescription";
import { useCounterStore } from "@/store/counter.store";
import { useCartStore } from "@/store/cart.store";
import toast from "react-hot-toast";
import InputNumber from "@/components/shared/InputNumber";
import { ReviewSection } from "@/components/reviews/ReviewSection";
import { StarRating } from "@/components/reviews/StarRating";
import { FaCartPlus } from "react-icons/fa6";
import { RiSecurePaymentLine } from "react-icons/ri";
import { getDiscountedPrice, getDiscountPercentage, isDiscountActive } from "@/lib/discount";

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [currentSlug, setCurrentSlug] = useState(slug);
  const { product, isLoading, isError } = useProduct(currentSlug || "");
  const { count, reset, setCount } = useCounterStore();
  const addItem = useCartStore((state) => state.addItem);
  const navigate = useNavigate();
  

  // Resetear el slug actual cuando cambia en la URL
  useEffect(() => {
    setCurrentSlug(slug);
    reset();
  }, [slug, reset]);

  const isOutOfStock = product?.stock === 0 || false;

  const activeDiscount = product?.discounts?.find(isDiscountActive);
  const hasDiscount = !!activeDiscount;
  const discountedPrice = getDiscountedPrice(product?.price || 0, activeDiscount);

  // Función para añadir al carrito
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
      toast.success("Producto añadido al carrito", {
        position: "bottom-right",
      });
    } else {
      toast.error("Producto agotado", {
        position: "bottom-right",
      });
    }
  };

  // Función para comprar ahora
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

  const { data: reviews } = useGetReviewsByProduct(product?.id);

  if(!reviews) return <p>No existe Reviews</p>

  const validRatings = reviews.filter((r) => r.rating !== null);
  const averageRating =
    validRatings.length > 0
      ? validRatings.reduce((sum, r) => sum + r.rating!, 0) /
        validRatings.length
      : 0;

  if (isLoading) {
    return <Loader size={60} />;
  }

  if (isError) {
    return <div>Error loading product</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <>
      <div className="h-fit flex flex-col md:flex-row gap-4 md:gap-16 mt-32 py-6 px-8">
        <GridImages images={product?.image_url} />

        <div className="flex-1 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{product?.name}</h1>

          <div className="flex gap-5 items-center">
            <div className="flex items-center gap-4">
              {hasDiscount ? (
                <div className="flex justify-center items-center gap-3">
                  <span className="text-2xl font-bold text-amber-500">
                    {formatPrice(discountedPrice)}
                  </span>
                  <span className="line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">
                    -{getDiscountPercentage(product.price, activeDiscount)}%
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-semibold">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <div className="relative bg-cream/80 cursor-not-allowed p-1 transition-all duration-300 ease-in-out hover:scale-105 rounded-full">
              {isOutOfStock && <Tag contentTag="agotado" />}
            </div>

            <div className="flex items-center gap-2">
              <StarRating rating={averageRating} />
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {averageRating.toFixed(1)} / 5 ({reviews.length} reseñas)
              </span>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium">Descripción del producto</p>

            <div className="flex gap-3 h-12 lg:h-24">
              <ProductDescription content={product.description} />
            </div>

            <div className="space-y-3 mb-3 lg:mb-6 flex flex-col items-center lg:items-start">
              <p className="text-xs font-medium">Cantidad:</p>
              <InputNumber
                value={count}
                min={1}
                max={product?.stock || 99}
                onChange={(val) => setCount(val)}
                className="w-30 text-xl"
                classNameIcon="size-4"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 w-full px-4">
            {isOutOfStock ? (
              <button
                disabled
                className="w-full md:w-1/2 bg-neutral-300 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400 font-medium py-3 px-6 rounded-xl border border-neutral-400 dark:border-neutral-600 transition-all duration-200 cursor-not-allowed"
              >
                Agotado
              </button>
            ) : (
              <button
                onClick={addToCart}
                className="w-full flex gap-5.5 items-center justify-center md:w-1/2 bg-amber-600 text-white dark:bg-amber-500 dark:text-black hover:bg-amber-700 dark:hover:bg-amber-600 font-medium py-3 px-6 rounded-xl transition-all duration-200 border border-transparent hover:shadow-md cursor-pointer"
              >
                <FaCartPlus className="size-5" />
                Añadir al carrito
              </button>
            )}

            <button
              onClick={buyNow}
              className="w-full flex gap-5.5 items-center justify-center md:w-1/2 bg-oscuro text-cream dark:bg-fondo dark:text-choco hover:bg-neutral-800 dark:hover:bg-neutral-300 font-medium py-3 px-6 rounded-xl transition-all duration-200 border border-transparent hover:shadow-md cursor-pointer"
            >
              <RiSecurePaymentLine className="size-5" />
              Comprar ahora
            </button>
          </div>

          <div className="flex pt-8">
            <div className="flex flex-col gap-1 flex-1 items-center">
              <CiDeliveryTruck size={35} />
              <p className="text-xs font-medium">Envío gratis</p>
            </div>
            <Link
              to="/contact-us"
              className="flex flex-col gap-1 flex-1 items-center justify-center hover:scale-105 transition-all duration-300 ease-in-out"
            >
              <BsChatLeftText size={25} />
              <p className="flex flex-col items-center text-xs font-medium">
                <span>¿Necesitas ayuda?</span>
                Contáctanos aquí
              </p>
            </Link>
          </div>
        </div>
      </div>
      <div>{product?.id && <ReviewSection productId={product.id} />}</div>
    </>
  );
};

export default ProductPage;