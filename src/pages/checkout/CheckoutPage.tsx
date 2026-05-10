import { Link } from "react-router-dom";
import { useCartStore } from "@/store/cart.store";
import { FormCheckout } from "@/components/checkout/FormCheckout";
import { ItemsCheckout } from "@/components/checkout/ItemsCheckout";
import { ShoppingCart } from "lucide-react";

const CheckoutPage = () => {
  const totalItems = useCartStore((state) => state.totalItemsInCart);

  return (
    <main className="min-h-screen bg-fondo dark:bg-fondo-dark text-choco dark:text-cream">
      {/* Header del checkout */}
      <div className="border-b border-cocoa/20 dark:border-cream/10 py-1 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/LogoBocaditosYomis.avif"
              alt="Bocaditos Yomi's"
              className="w-18 h-18 object-contain"
            />
            <span className="font-semibold text-sm hidden sm:block">
              Bocaditos Yomi's
            </span>
          </Link>
          <div className="flex items-center gap-2 text-sm text-choco/60 dark:text-cream/60">
            <ShoppingCart className="size-4" />
            <span>
              {totalItems} {totalItems === 1 ? "artículo" : "artículos"}
            </span>
          </div>
        </div>
      </div>

      {/* Contenido */}
      {totalItems === 0 ? (
        <div className="flex flex-col items-center justify-center gap-6 py-24 px-4 text-center">
          <img
            src="/img/Cart.avif"
            alt="Carrito vacío"
            className="w-40 md:w-56 rounded-xl shadow-lg opacity-80"
          />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Tu carrito está vacío</h2>
            <p className="text-sm text-choco/60 dark:text-cream/60">
              Agrega productos antes de continuar con el pago.
            </p>
          </div>
          <Link
            to="/products"
            className="btn-primary px-8 py-3 text-base rounded-full"
          >
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-73px)]">
          {/* Formulario */}
          <div className="p-6 md:p-10 border-r-0 lg:border-r border-cocoa/20 dark:border-cream/10">
            <FormCheckout />
          </div>

          {/* Resumen — solo en desktop */}
          <div className="hidden lg:block p-6 md:p-10">
            <div className="sticky top-6">
              <h2 className="text-lg font-semibold mb-4">Resumen del pedido</h2>
              <ItemsCheckout />
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default CheckoutPage;
