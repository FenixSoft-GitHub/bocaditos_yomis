"use client";

import { useCartStore } from "@/lib/cart/store";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

function formatPrice(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("es-VE", {
    style: "currency",
    currency: "USD",
  }).format(num);
}

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
  } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const total = getTotal();
  const itemCount = getItemCount();

  // Estado vacío
  if (itemCount === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <ShoppingBag className="w-16 h-16 text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-300 mb-2">
          Tu carrito está vacío
        </h2>
        <p className="text-gray-500 mb-6">
          Agrega algunos bocaditos deliciosos para continuar.
        </p>
        <Link
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Tu Carrito ({itemCount} {itemCount === 1 ? "item" : "items"})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de productos */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => {
            const firstImage = product.image_url?.[0];
            return (
              <div
                key={product.id}
                className="flex gap-4 p-4 bg-gray-900 border border-gray-800 rounded-xl"
              >
                {/* Imagen */}
                <div className="size-24 shrink-0 bg-gray-800 rounded-lg overflow-hidden">
                  {firstImage ? (
                    <Image
                      src={firstImage}
                      alt={product.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                      Sin img
                    </div>
                  )}
                </div>

                {/* Info + Controles */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-green-400 font-bold">
                      {formatPrice(product.price)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Controles de cantidad */}
                    <div className="flex items-center border border-gray-700 rounded-lg">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        disabled={quantity === 1}
                        className="px-3 py-1 hover:bg-gray-800 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-l-lg"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-1 font-semibold min-w-12 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="px-3 py-1 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors rounded-r-lg"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Eliminar */}
                    <button
                      onClick={() => removeItem(product.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors p-2"
                      aria-label="Eliminar producto"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Limpiar carrito */}
          <button
            onClick={() => clearCart()}
            className="text-sm text-gray-400 hover:text-red-400 transition-colors mt-2"
          >
            Vaciar carrito
          </button>
        </div>

        {/* Resumen / Checkout */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Resumen del pedido</h2>

            <div className="space-y-3 text-gray-300 mb-6">
              <div className="flex justify-between">
                <span>Subtotal ({itemCount} items)</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span className="text-green-400">Gratis</span>
              </div>
              <div className="border-t border-gray-700 pt-3 flex justify-between text-white font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              Continuar al pago <ArrowRight className="w-5 h-5" />
            </Link>

            <p className="text-xs text-gray-500 text-center mt-4">
              🔒 Pago seguro con Stripe. Tus datos están protegidos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
