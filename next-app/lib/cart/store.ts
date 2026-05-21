import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Database } from "@/types/supabase";

export type CartItem = {
  product: Database["public"]["Tables"]["products"]["Row"];
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (
    product: Database["public"]["Tables"]["products"]["Row"],
    quantity?: number,
  ) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existing = items.find((item) => item.product.id === product.id);

        if (existing) {
          set({
            items: items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            ),
          });
        } else {
          set({ items: [...items, { product, quantity }] });
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.product.id !== productId),
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item,
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((total, item) => {
          const price = parseFloat(item.product.price);
          return total + price * item.quantity;
        }, 0);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "bocaditos-cart", // clave en localStorage
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
