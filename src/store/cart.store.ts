import { StateCreator, create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { ICartItem } from "@/components/shared/CartItem";
import { supabase } from "@/supabase/client";

// ─── Helpers ────────────────────────────────────────────────

async function syncCartToSupabase(userId: string, items: ICartItem[]) {
  if (!userId) return;
  await supabase.from("abandoned_carts").upsert(
    {
      user_id: userId,
      items: JSON.stringify(items),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
}

async function clearCartFromSupabase(userId: string) {
  if (!userId) return;
  await supabase.from("abandoned_carts").upsert(
    {
      user_id: userId,
      items: JSON.stringify([]),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
}

async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

// ─── Store ───────────────────────────────────────────────────

export interface CartState {
  items: ICartItem[];
  totalItemsInCart: number;
  totalAmount: number;

  addItem: (item: ICartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  cleanCart: () => void;
  loadCartFromSupabase: (userId: string) => Promise<void>;
}

const storeApi: StateCreator<CartState> = (set, get) => ({
  items: [],
  totalItemsInCart: 0,
  totalAmount: 0,

  addItem: (item) => {
    set((state) => {
      const existingItemIndex = state.items.findIndex(
        (i) => i.productId === item.productId,
      );

      const updatedItems = [...state.items];

      if (existingItemIndex >= 0) {
        updatedItems[existingItemIndex].quantity += item.quantity;
      } else {
        updatedItems.push(item);
      }

      const newTotalItems = updatedItems.reduce(
        (acc, i) => acc + i.quantity,
        0,
      );
      const newTotalAmount = updatedItems.reduce(
        (acc, i) => acc + i.price * i.quantity,
        0,
      );

      // Sincronizar con Supabase en background
      getCurrentUserId().then((userId) => {
        if (userId) syncCartToSupabase(userId, updatedItems);
      });

      return {
        items: updatedItems,
        totalAmount: newTotalAmount,
        totalItemsInCart: newTotalItems,
      };
    });
  },

  removeItem: (productId) => {
    set((state) => {
      const updatedItems = state.items.filter((i) => i.productId !== productId);

      const newTotalItems = updatedItems.reduce(
        (acc, i) => acc + i.quantity,
        0,
      );
      const newTotalAmount = updatedItems.reduce(
        (acc, i) => acc + i.price * i.quantity,
        0,
      );

      // Sincronizar con Supabase en background
      getCurrentUserId().then((userId) => {
        if (userId) syncCartToSupabase(userId, updatedItems);
      });

      return {
        items: updatedItems,
        totalAmount: newTotalAmount,
        totalItemsInCart: newTotalItems,
      };
    });
  },

  updateQuantity: (productId, quantity) => {
    set((state) => {
      const updatedItems = state.items.map((i) =>
        i.productId === productId ? { ...i, quantity } : i,
      );

      const newTotalItems = updatedItems.reduce(
        (acc, i) => acc + i.quantity,
        0,
      );
      const newTotalAmount = updatedItems.reduce(
        (acc, i) => acc + i.price * i.quantity,
        0,
      );

      // Sincronizar con Supabase en background
      getCurrentUserId().then((userId) => {
        if (userId) syncCartToSupabase(userId, updatedItems);
      });

      return {
        items: updatedItems,
        totalAmount: newTotalAmount,
        totalItemsInCart: newTotalItems,
      };
    });
  },

  cleanCart: () => {
    // Limpiar en Supabase en background
    getCurrentUserId().then((userId) => {
      if (userId) clearCartFromSupabase(userId);
    });

    set({ items: [], totalItemsInCart: 0, totalAmount: 0 });
  },

  // Cargar carrito desde Supabase al hacer login
  loadCartFromSupabase: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("abandoned_carts")
        .select("items")
        .eq("user_id", userId)
        .single();

      if (error || !data) return;

      const remoteItems: ICartItem[] = JSON.parse(
        typeof data.items === "string"
          ? data.items
          : JSON.stringify(data.items),
      );

      if (!remoteItems.length) return;

      const localItems = get().items;

      // Merge: si hay items locales, combinar con los remotos
      // Items remotos tienen prioridad en caso de conflicto
      const mergedMap = new Map<string, ICartItem>();

      remoteItems.forEach((item) => mergedMap.set(item.productId, item));
      localItems.forEach((item) => {
        if (!mergedMap.has(item.productId)) {
          mergedMap.set(item.productId, item);
        }
      });

      const mergedItems = Array.from(mergedMap.values());

      const newTotalItems = mergedItems.reduce((acc, i) => acc + i.quantity, 0);
      const newTotalAmount = mergedItems.reduce(
        (acc, i) => acc + i.price * i.quantity,
        0,
      );

      set({
        items: mergedItems,
        totalItemsInCart: newTotalItems,
        totalAmount: newTotalAmount,
      });

      // Sincronizar el merge de vuelta a Supabase
      await syncCartToSupabase(userId, mergedItems);
    } catch (err) {
      console.error("[cart.store] loadCartFromSupabase error:", err);
    }
  },
});

export const useCartStore = create<CartState>()(
  devtools(
    persist(storeApi, {
      name: "cart-store",
    }),
  ),
);