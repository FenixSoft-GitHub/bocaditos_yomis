"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cart/store";
import type { Database } from "@/types/supabase";
import { cartToast } from "@/lib/cart/cartToast";

type Product = Database["public"]["Tables"]["products"]["Row"];

interface AddToCartButtonProps {
  product: Product;
  className?: string;
}

export function AddToCartButton({
  product,
  className = "",
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const isOutOfStock = product.stock === 0;
  const maxQuantity = product.stock || 10;

  const handleAddToCart = () => {
    // Agregar al carrito
    addItem(product, quantity);

    // ✅ Mostrar toast de confirmación
    cartToast.success(product.name, quantity, product.image_url?.[0]);
  };

  return (
    <div className={`space-y-4 pt-6 border-t border-gray-800 ${className}`}>
      {/* Selector de cantidad */}
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-gray-700 rounded-lg">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors rounded-l-lg disabled:opacity-50"
            disabled={isOutOfStock}
            aria-label="Disminuir cantidad"
          >
            −
          </button>
          <input
            type="number"
            min="1"
            max={maxQuantity}
            value={quantity}
            onChange={(e) =>
              setQuantity(
                Math.max(
                  1,
                  Math.min(maxQuantity, parseInt(e.target.value) || 1),
                ),
              )
            }
            className="w-16 text-center bg-transparent text-white font-semibold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            disabled={isOutOfStock}
            aria-label="Cantidad"
          />
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
            className="px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors rounded-r-lg disabled:opacity-50"
            disabled={isOutOfStock}
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>

        {/* Botón principal */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || quantity > maxQuantity}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/25"
        >
          {isOutOfStock ? "Agotado" : "Agregar al carrito"}
        </button>
      </div>

      {/* Info adicional */}
      <div className="flex items-center gap-6 text-sm text-gray-400 pt-4">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>Envío disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <span>Pago seguro</span>
        </div>
      </div>
    </div>
  );
}
