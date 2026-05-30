import { useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/store/cart.store";
import { FormCheckout } from "@/components/checkout/FormCheckout";
import { ItemsCheckout } from "@/components/checkout/ItemsCheckout";
import { ShoppingCart } from "lucide-react";
import { useCheckout } from "@/hooks/checkout/useCheckout";
import { PaymentInfo } from "@/components/checkout/PaymentInfo";
import { OrderConfirmed } from "@/components/checkout/OrderConfirmed";
import { AutoCouponInput } from "@/components/dashboard/coupons/AutoCouponInput";

const CheckoutPage = () => {
  const totalItems = useCartStore((state) => state.totalItemsInCart);
  const cartItems = useCartStore((state) => state.items);

  const {
    step,
    loading,
    error,
    orderData,
    handleCreateOrder,
    handleSubmitReceipt,
    goToOrders,
  } = useCheckout();

  const [appliedCoupon, setAppliedCoupon] = useState<{
    id: string;
    code: string;
    discount: number;
  } | null>(null);

  // El store ya calcula totalAmount, pero lo recalculamos
  // con el descuento del cupón para mostrarlo en el resumen
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const couponDiscount = appliedCoupon
    ? (subtotal * appliedCoupon.discount) / 100
    : 0;

  // Paso 3 — Confirmación
  if (step === "confirmed" && orderData) {
    return (
      <main className="min-h-screen bg-fondo dark:bg-fondo-dark flex items-center justify-center px-4">
        <OrderConfirmed
          orderId={orderData.order_id}
          onViewOrders={goToOrders}
        />
      </main>
    );
  }

  // Paso 2 — Datos bancarios + comprobante
  if (step === "payment" && orderData) {
    return (
      <main className="min-h-screen bg-fondo dark:bg-fondo-dark px-4 py-10">
        <PaymentInfo
          orderData={orderData}
          onSubmit={handleSubmitReceipt}
          loading={loading}
          error={error}
        />
      </main>
    );
  }

  // Paso 1 — Formulario
  return (
    <main className="min-h-screen bg-fondo dark:bg-fondo-dark text-choco dark:text-cream">
      {/* Header */}
      <div className="border-b border-cocoa/20 dark:border-cream/10 py-1 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/LogoBocaditosYomis.avif"
              alt="Bocaditos Yomi's"
              className="size-18 object-contain"
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

      {/* Carrito vacío */}
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
          <div className="p-6 md:p-10 border-r-0 lg:border-r border-cocoa/20 dark:border-cream/10 space-y-6">
            {/* Cupón — solo móvil */}
            <div className="lg:hidden">
              <AutoCouponInput
                subtotal={subtotal}
                onCouponApplied={(discount, couponId, code) =>
                  setAppliedCoupon({ id: couponId, code, discount })
                }
                onCouponRemoved={() => setAppliedCoupon(null)}
              />
            </div>

            <FormCheckout
              onOrderCreated={(data) =>
                handleCreateOrder({
                  ...data,
                  auto_coupon_id: appliedCoupon?.id ?? null,
                })
              }
              loading={loading}
              error={error}
            />
          </div>

          {/* Resumen desktop */}
          <div className="hidden lg:block p-6 md:p-10">
            <div className="sticky top-6 space-y-6">
              <h2 className="text-lg font-semibold">Resumen del pedido</h2>

              <ItemsCheckout />

              {/* Cupón — desktop */}
              <AutoCouponInput
                subtotal={subtotal}
                onCouponApplied={(discount, couponId, code) =>
                  setAppliedCoupon({ id: couponId, code, discount })
                }
                onCouponRemoved={() => setAppliedCoupon(null)}
              />

              {/* Desglose */}
              <div className="space-y-2 border-t border-cocoa/20 dark:border-cream/10 pt-4">
                <div className="flex justify-between text-sm text-choco/60 dark:text-cream/60">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                    <span>Cupón {appliedCoupon.code}</span>
                    <span>-${couponDiscount.toFixed(2)}</span>
                  </div>
                )}

                <p className="text-xs text-choco/40 dark:text-cream/40">
                  El costo de envío se calcula en el formulario
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default CheckoutPage;