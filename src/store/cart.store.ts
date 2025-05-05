import { StateCreator, create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { ICartItem } from "../components/shared/CartItem";

export interface CartState {
  items: ICartItem[];
  totalItemsInCart: number;
  totalAmount: number;

  addItem: (item: ICartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  cleanCart: () => void;
}

const storeApi: StateCreator<CartState> = (set) => ({
  items: [],
  totalItemsInCart: 0,
  totalAmount: 0,

  addItem: (item) => {
    set((state) => {
      const existingItemIndex = state.items.findIndex(
        (i) => i.productId === item.productId
      );

      // let updatedItems;

      const updatedItems = [...state.items];

      // if (existingItemIndex >= 0) {
        // Si el item ya existe en el carrito, actualizamos la cantidad
      //   updatedItems = state.items.map((i, index) =>
      //     index === existingItemIndex
      //       ? {
      //           ...i,
      //           quantity: i.quantity + item.quantity,
      //         }
      //       : i
      //   );
      // } else {
        // Si el item no existe en el carrito, lo añadimos
      //   updatedItems = [...state.items, item];
      // }

      if (existingItemIndex >= 0) {
        updatedItems[existingItemIndex].quantity += item.quantity;
      } else {
        updatedItems.push(item);
      }

      const newTotalItems = updatedItems.reduce(
        (acc, i) => acc + i.quantity,
        0
      );

      const newTotalAmount = updatedItems.reduce(
        (acc, i) => acc + i.price * i.quantity,
        0
      );

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
        0
      );

      const newTotalAmount = updatedItems.reduce(
        (acc, i) => acc + i.price * i.quantity,
        0
      );

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
        i.productId === productId ? { ...i, quantity } : i
      );

      const newTotalItems = updatedItems.reduce(
        (acc, i) => acc + i.quantity,
        0
      );

      const newTotalAmount = updatedItems.reduce(
        (acc, i) => acc + i.price * i.quantity,
        0
      );

      return {
        items: updatedItems,
        totalAmount: newTotalAmount,
        totalItemsInCart: newTotalItems,
      };
    });
  },

  cleanCart: () => {
    set({ items: [], totalItemsInCart: 0, totalAmount: 0 });
  },
});

export const useCartStore = create<CartState>()(
  devtools(
    persist(storeApi, {
      name: "cart-store",
    })
  )
);
