import GridImages from "@/components/products/GridImages";
import { Loader } from "@/components/shared/Loader";
import { Separator } from "@/components/shared/Separator";
import Tag from "@/components/shared/Tag";
import { formatPrice } from "@/helpers";
import { useProduct } from "@/hooks";
import { useEffect, useState } from "react";
// import { LuMinus, LuPlus } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { CiDeliveryTruck } from "react-icons/ci";
import { BsChatLeftText } from "react-icons/bs";
import { LuMinus, LuPlus } from "react-icons/lu";
import { ProductDescription } from "@/components/products/ProductDescription";
import { useCounterStore } from "@/store/counter.store";
import { useCartStore } from "@/store/cart.store";
import toast from "react-hot-toast";

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [currentSlug, setCurrentSlug] = useState(slug);
  const { product, isLoading, isError } = useProduct(currentSlug || "");
  const { count, increment, decrement, reset } = useCounterStore();
  const addItem = useCartStore((state) => state.addItem);
  const navigate = useNavigate();

  // Resetear el slug actual cuando cambia en la URL
  useEffect(() => {
    setCurrentSlug(slug);
    reset();
  }, [slug, reset]);

  const isOutOfStock = product?.stock === 0 || false;
  // const stock = product?.stock || 0;

  // Función para añadir al carrito
  const addToCart = () => {
    if ((product?.stock ?? 0) > 0) {
      addItem({
        productId: product?.id || "",
        name: product?.name || "",
        image_url: product?.image_url || [],
        price: product?.price || 0,
        quantity: count,
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
        price: product?.price || 0,
        quantity: count,
      });
      
      navigate("/checkout");
    }
  };

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
            <span className="text-lg tracking-wide font-semibold">
              {formatPrice(product?.price || 0)}
            </span>
            <div className="relative bg-cream/80 cursor-not-allowed p-1 transition-all duration-300 ease-in-out hover:scale-105 rounded-full">
              {isOutOfStock && <Tag contentTag="agotado" />}
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium">Descripción del producto</p>

            <div className="flex gap-3 h-24">
              <ProductDescription content={product.description} />
            </div>

            {/* este bloque no pase a este sitio estaba en el de abajo */}

            <div className="space-y-3 mb-3 lg:mb-6 flex flex-col items-center lg:items-start">
              <p className="text-xs font-medium">Cantidad:</p>
              <div className="flex justify-between gap-8 px-5 py-3 border border-cocoa/70 dark:border-cream/60 rounded-full w-1/2 lg:w-1/4 text-sm font-medium dark:bg-cream/20 bg-cocoa/10">
                <button
                  onClick={decrement}
                  disabled={count === 1}
                  className="cursor-pointer"
                >
                  <LuMinus size={18} />
                </button>
                <span>{count}</span>
                <button onClick={increment} className="cursor-pointer">
                  <LuPlus size={18} />
                </button>
              </div>
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
                className="w-full md:w-1/2 bg-amber-600 text-white dark:bg-amber-500 dark:text-black hover:bg-amber-700 dark:hover:bg-amber-600 font-medium py-3 px-6 rounded-xl transition-all duration-200 border border-transparent hover:shadow-md cursor-pointer"
              >
                Añadir al carrito 
              </button>
            )}

            <button
              onClick={buyNow}
              className="w-full md:w-1/2 bg-oscuro text-cream dark:bg-fondo dark:text-choco hover:bg-neutral-800 dark:hover:bg-neutral-300 font-medium py-3 px-6 rounded-xl transition-all duration-200 border border-transparent hover:shadow-md cursor-pointer"
            >
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
    </>
  );
};

export default ProductPage;