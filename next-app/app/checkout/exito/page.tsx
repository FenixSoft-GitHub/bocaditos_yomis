"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/cart/store";
import { CheckCircle, Home, Package } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CheckoutSuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart);
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get("payment_intent");

  // Vaciar carrito automáticamente al confirmar éxito
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-4">
      <div className="max-w-lg w-full text-center space-y-8 py-12">
        {/* Animación de éxito */}
        <div className="relative flex justify-center">
          <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full animate-pulse" />
          <CheckCircle className="relative w-24 h-24 text-green-500 drop-shadow-lg" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">¡Pago Exitoso!</h1>
          <p className="text-gray-400 text-lg">
            Gracias por tu compra. Estamos preparando tu pedido 🧁
          </p>
        </div>

        {/* Referencia de pago */}
        {paymentIntentId && (
          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-5 text-left space-y-2">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Package className="w-4 h-4" />
              <span>Referencia de transacción</span>
            </div>
            <p className="font-mono text-blue-400 break-all text-sm select-all">
              {paymentIntentId}
            </p>
            <p className="text-xs text-gray-500">
              Guarda este ID para seguimiento o soporte.
            </p>
          </div>
        )}

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-blue-600/20"
          >
            <Home className="w-5 h-5" />
            Volver a la tienda
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors border border-gray-700"
          >
            🖨️ Imprimir comprobante
          </button>
        </div>
      </div>
    </main>
  );
}
