import { useGlobalStore } from "@/store/global.store";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";
import { RiSecurePaymentLine } from "react-icons/ri";
import { CartItem } from "@/components/shared/CartItem";
import { useCartStore } from "@/store/cart.store";
import { FiShoppingCart } from "react-icons/fi";
import { Separator } from "./Separator";
import { formatPrice } from "@/helpers";

export const Cart = () => {
  const closeSheet = useGlobalStore((state) => state.closeSheet);
  const { totalAmount } = useCartStore();
  const cartItems = useCartStore((state) => state.items);
  const cleanCart = useCartStore((state) => state.cleanCart);
  const totalItemsInCart = useCartStore((state) => state.totalItemsInCart);

  return (
    <div className="w-full h-full">
      <div className="px-7 py-5 flex justify-between items-center border-b border-cocoa bg-cream text-choco dark:border-cream/70 dark:bg-fondo-dark/60 dark:text-gray-100">
        <span className="flex gap-5 items-center font-semibold">
          <FiShoppingCart className="text-2xl" />
          {totalItemsInCart} artículos
        </span>
        <button
          className="bg-amber-600 text-cream dark:bg-amber-500 dark:text-oscuro hover:bg-amber-700 dark:hover:bg-amber-600 font-medium  rounded-full shadow-lg cursor-pointer"
          onClick={closeSheet}
        >
          <IoMdClose size={25} className="p-1" />
        </button>
      </div>

      <div className="p-5 h-full bg-fondo/90 text-choco dark:bg-fondo-dark/90 dark:text-cream overflow-y-auto">
        {totalItemsInCart > 0 ? (
          <>
            {/* LISTA DE PRODUCTOS AÑADIDOS AL CARRITO */}
            <div className="px-2 py-4 overflow-auto flex-1">
              <ul className="space-y-7">
                {cartItems.map((item) => (
                  <CartItem item={item} key={item.productId} />
                ))}
              </ul>
            </div>

            <Separator />

            {/* Columna de Resumen del Pedido */}
            <div className="lg:col-span-1 bg-cream dark:bg-fondo-dark p-3 rounded-lg shadow-md h-fit sticky top-24">
              <h2 className="text-lg font-semibold mb-3">Resumen del Pedido</h2>

              <div className="flex justify-between items-center text-base font-medium mb-4 border-b pb-4 border-cocoa/20 dark:border-cream/20">
                <div className="flex gap-2">
                  <span>Total Items:</span>
                  <span># {totalItemsInCart}</span>
                </div>
                <div className="flex gap-2">
                  <span>Subtotal:</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-2xl font-bold mt-2">
                <span>Total a Pagar:</span>
                <span className="text-amber-600 dark:text-amber-500">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>

            {/* BOTONES ACCIÓN */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 w-full px-4 pb-18 text-sm mt-6">
              <Link
                to="/checkout"
                onClick={closeSheet}
                className="w-full md:w-1/2 bg-oscuro text-cream dark:bg-fondo dark:text-choco hover:bg-neutral-800 dark:hover:bg-neutral-300 font-medium py-3 px-6 rounded-xl transition-all duration-200 border border-transparent hover:shadow-md flex items-center justify-center gap-3"
              >
                <RiSecurePaymentLine size={24} />
                Comprar ahora
              </Link>

              <button
                className="w-full md:w-1/2 bg-amber-600 text-cream dark:bg-amber-500 dark:text-oscuro hover:bg-amber-700 dark:hover:bg-amber-600 font-medium py-3 px-6 rounded-xl transition-all duration-200 border border-transparent hover:shadow-md flex items-center justify-center gap-3 cursor-pointer"
                onClick={cleanCart}
              >
                <img
                  src="/img/misc/clean.png"
                  alt="Icono de escoba"
                  className="size-6 invert dark:invert-0"
                />
                Limpiar Carrito
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-7">
            <img
              src="/img/misc/Shopping-Cart-3D.avif"
              alt="Carro Vacío"
              className="w-1/2 rounded-full p-4 shadow-lg dark:shadow-gray-200 shadow-choco"
            />
            <p className="text-sm font-medium tracking-tight">
              Su carro esta vacío
            </p>
            <Link
              to="/products"
              className="bg-amber-600 text-cream dark:bg-amber-500 dark:text-oscuro hover:bg-amber-700 dark:hover:bg-amber-600 font-medium uppercase py-2 rounded-full px-7 text-sm shadow-lg transition-all duration-300 ease-in-out hover:scale-105 mt-4 outline-2 outline-offset-2 outline-amber-600 dark:outline-amber-500 "
              onClick={closeSheet}
            >
              Empezar a comprar
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
