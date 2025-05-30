import { StateCreator, create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { ICartItem } from "@/components/shared/CartItem";

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

      const updatedItems = [...state.items];

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

// import { StateCreator, create } from "zustand";
// import { devtools, persist } from "zustand/middleware";
// import { ICartItem } from "@/components/shared/CartItem"; // Asegúrate de que esta ruta sea correcta

// // Define el estado del carrito
// export interface CartState {
//   items: ICartItem[];
//   totalItemsInCart: number;
//   totalAmount: number;

//   // Modificación aquí: addItem ahora recibe un objeto con las propiedades necesarias, incluyendo stock
//   // Esto permite que el stock se pase al ICartItem cuando se añade al carrito.
//   addItem: (
//     product: {
//       productId: string;
//       name: string;
//       price: number;
//       image_url: string[];
//       stock: number | null;
//     },
//     quantityToAdd: number
//   ) => void;
//   removeItem: (productId: string) => void;
//   updateQuantity: (productId: string, quantity: number) => void;
//   cleanCart: () => void;
// }

// const storeApi: StateCreator<CartState> = (set) => ({
//   items: [],
//   totalItemsInCart: 0,
//   totalAmount: 0,

//   // Modificación de la función addItem
//   addItem: (product, quantityToAdd) => {
//     set((state) => {
//       const existingItemIndex = state.items.findIndex(
//         (i) => i.productId === product.productId
//       );

//       const updatedItems = [...state.items];
//       let newTotalItems = state.totalItemsInCart;
//       let newTotalAmount = state.totalAmount;

//       if (existingItemIndex >= 0) {
//         // Si el item ya existe, actualiza la cantidad
//         const existingItem = updatedItems[existingItemIndex];
//         const maxQuantity = product.stock !== null ? product.stock : Infinity; // Usa el stock del producto

//         // Calcula la nueva cantidad, sin exceder el stock
//         const newQuantity = Math.min(
//           existingItem.quantity + quantityToAdd,
//           maxQuantity
//         );

//         if (newQuantity === existingItem.quantity) {
//           // Si la cantidad no cambia (ej. ya está en el máximo stock), no actualices el estado
//           return state;
//         }

//         updatedItems[existingItemIndex] = {
//           ...existingItem,
//           quantity: newQuantity,
//         };
//       } else {
//         // Si el item no existe, añádelo
//         // Asegúrate de que el ICartItem se cree con el stock
//         updatedItems.push({
//           productId: product.productId,
//           name: product.name,
//           price: product.price,
//           quantity: quantityToAdd, // La cantidad inicial es la que se desea añadir
//           image_url: product.image_url,
//           stock: product.stock, // <--- ¡Aquí se pasa el stock al ICartItem!
//         });
//       }

//       // Recalcular totales después de la actualización de items
//       newTotalItems = updatedItems.reduce((acc, i) => acc + i.quantity, 0);

//       newTotalAmount = updatedItems.reduce(
//         (acc, i) => acc + i.price * i.quantity,
//         0
//       );

//       return {
//         items: updatedItems,
//         totalAmount: newTotalAmount,
//         totalItemsInCart: newTotalItems,
//       };
//     });
//   },

//   removeItem: (productId) => {
//     set((state) => {
//       const updatedItems = state.items.filter((i) => i.productId !== productId);

//       const newTotalItems = updatedItems.reduce(
//         (acc, i) => acc + i.quantity,
//         0
//       );

//       const newTotalAmount = updatedItems.reduce(
//         (acc, i) => acc + i.price * i.quantity,
//         0
//       );

//       return {
//         items: updatedItems,
//         totalAmount: newTotalAmount,
//         totalItemsInCart: newTotalItems,
//       };
//     });
//   },

//   // Modificación de la función updateQuantity
//   updateQuantity: (productId, quantity) => {
//     set((state) => {
//       const itemToUpdate = state.items.find((i) => i.productId === productId);

//       if (!itemToUpdate) {
//         return state; // Si no se encuentra el item, no hagas nada
//       }

//       // Asegúrate de que la nueva cantidad no exceda el stock disponible
//       const maxQuantity =
//         itemToUpdate.stock !== null ? itemToUpdate.stock : Infinity;
//       const safeQuantity = Math.min(Math.max(1, quantity), maxQuantity); // Mínimo 1, máximo stock

//       if (safeQuantity === itemToUpdate.quantity) {
//         return state; // No hay cambio, evita re-renderizados innecesarios
//       }

//       const updatedItems = state.items.map((i) =>
//         i.productId === productId ? { ...i, quantity: safeQuantity } : i
//       );

//       const newTotalItems = updatedItems.reduce(
//         (acc, i) => acc + i.quantity,
//         0
//       );

//       const newTotalAmount = updatedItems.reduce(
//         (acc, i) => acc + i.price * i.quantity,
//         0
//       );

//       return {
//         items: updatedItems,
//         totalAmount: newTotalAmount,
//         totalItemsInCart: newTotalItems,
//       };
//     });
//   },

//   cleanCart: () => {
//     set({ items: [], totalItemsInCart: 0, totalAmount: 0 });
//   },
// });

// export const useCartStore = create<CartState>()(
//   devtools(
//     persist(storeApi, {
//       name: "cart-store",
//     })
//   )
// );
