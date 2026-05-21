"use client";

import { useCartStore } from "@/lib/cart/store";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export function CartButton() {
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <Link
      href="/carrito"
      className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors"
      aria-label="Ver carrito"
    >
      <ShoppingBag className="w-6 h-6 text-gray-300 hover:text-white" />

      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </Link>
  );
}
