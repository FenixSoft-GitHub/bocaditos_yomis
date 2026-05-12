import { useGlobalStore } from "@/store/global.store";
import { X, ShoppingCart, ShieldCheck, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { CartItem } from "@/components/shared/CartItem";
import { useCartStore } from "@/store/cart.store";
import { Separator } from "./Separator";
import { formatPrice } from "@/helpers";
import { motion } from "framer-motion";

export const Cart = () => {
  const closeSheet = useGlobalStore((state) => state.closeSheet);
  const { totalAmount } = useCartStore();
  const cartItems = useCartStore((state) => state.items);
  const cleanCart = useCartStore((state) => state.cleanCart);
  const totalItemsInCart = useCartStore((state) => state.totalItemsInCart);

  return (
    <div className="w-full h-full flex flex-col bg-fondo text-choco dark:bg-fondo-dark dark:text-cream">
      {/* HEADER DEL CARRITO */}
      <div className="px-6 py-4 flex justify-between items-center border-b border-cocoa/20  dark:border-cream/10 shrink-0">
        <span className="flex gap-3 items-center font-semibold">
          <ShoppingCart className="size-5" />
          {totalItemsInCart} {totalItemsInCart === 1 ? "artículo" : "artículos"}
        </span>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={closeSheet}
          className="p-1.5 rounded-full bg-choco/10 dark:bg-cream/10 hover:bg-choco/20 dark:hover:bg-cream/20 transition-colors cursor-pointer"
          aria-label="Cerrar carrito"
        >
          <X className="size-4" />
        </motion.button>
      </div>

      {/* CONTENIDO DEL CARRITO */}
      <div className="flex-1 overflow-y-auto p-5 ">
        {totalItemsInCart > 0 ? (
          <>
            {/* LISTA DE PRODUCTOS AÑADIDOS AL CARRITO */}
            <ul className="space-y-6">
              {cartItems.map((item) => (
                <CartItem item={item} key={item.productId} />
              ))}
            </ul>

            <Separator />

            {/* Columna de Resumen del Pedido */}
            <div className="bg-cream dark:bg-oscuro/60 p-4 rounded-xl space-y-3 mt-4">
              <div className="flex justify-between items-center text-sm text-choco/70 dark:text-cream/70">
                <span>
                  {totalItemsInCart === 1
                    ? `Artículo (${totalItemsInCart})`
                    : `Artículos (${totalItemsInCart})`}
                </span>
                <span>{formatPrice(totalAmount)}</span>
              </div>

              <Separator />

              <div className="flex justify-between items-center text-base font-medium">
                <span>Total</span>
                <span className="text-dorado">{formatPrice(totalAmount)}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-6 py-10">
            <img
              src="/img/misc/Shopping-Cart-3D.avif"
              alt="Carro Vacío"
              className="w-36 rounded-2xl shadow-lg opacity-80"
            />
            <div className="text-center space-y-1">
              <p className="font-semibold">Tu carrito está vacío</p>
              <p className="text-xs text-choco/50 dark:text-cream/50">
                Agrega tus productos favoritos y disfruta de un delicioso
                pedido.
              </p>
            </div>
            <Link
              to="/products"
              onClick={closeSheet}
              className="btn-primary px-6 py-2.5 rounded-full text-sm"
            >
              Explorar Productos
            </Link>
          </div>
        )}
      </div>

      {/* ACCIONES -SOLO CUANDO HAY PRODUCTOS EN EL CARRITO */}
      {totalItemsInCart > 0 && (
        <div className="shrink-0 p-4 border-t border-cocoa/20 dark:border-cream/10 flex flex-col gap-3">
          <Link
            to="/checkout"
            onClick={closeSheet}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm bg-oscuro text-cream dark:bg-cream dark:text-oscuro hover:bg-cocoa dark:hover:bg-butter transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md "
          >
            <ShieldCheck className="size-4" />
            Confirmar Pedido
          </Link>
          <button
            onClick={cleanCart}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl font-semibold text-sm border border-cocoa/30 dark:border-cream/20 text-choco/70 dark:text-cream/70 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-800 transition-all duration-200"
          >
            <Trash2 className="size-4" />
            Vaciar Carrito
          </button>
        </div>
      )}
    </div>
  );
};
