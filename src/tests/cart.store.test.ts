// src/tests/cart.store.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest";

// Desactivar cualquier mock de cart.store que pueda venir de otros archivos
vi.unmock("@/store/cart.store");

// Mock de localStorage para que persist no falle en jsdom
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

import { useCartStore } from "@/store/cart.store";

const mockItem = {
  productId: "prod-1",
  name: "Chocolate Artesanal",
  image_url: ["https://test.com/img.jpg"],
  price: 10,
  quantity: 1,
  stock: 5,
};

describe("cart.store", () => {
  beforeEach(() => {
    localStorageMock.clear();
    // Sin replace:true — solo resetea los valores de datos
    useCartStore.setState({ items: [], totalItemsInCart: 0, totalAmount: 0 });
  });

  // ── addItem ────────────────────────────────────────────────────────────

  it("addItem — agrega un producto nuevo al carrito", () => {
    useCartStore.getState().addItem(mockItem);
    const { items, totalItemsInCart, totalAmount } = useCartStore.getState();

    expect(items).toHaveLength(1);
    expect(items[0].productId).toBe("prod-1");
    expect(totalItemsInCart).toBe(1);
    expect(totalAmount).toBe(10);
  });

  it("addItem — incrementa la cantidad si el producto ya existe", () => {
    useCartStore.getState().addItem(mockItem);
    useCartStore.getState().addItem({ ...mockItem, quantity: 2 });
    const { items, totalItemsInCart, totalAmount } = useCartStore.getState();

    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(3);
    expect(totalItemsInCart).toBe(3);
    expect(totalAmount).toBe(30);
  });

  it("addItem — agrega productos distintos como items separados", () => {
    useCartStore.getState().addItem(mockItem);
    useCartStore
      .getState()
      .addItem({ ...mockItem, productId: "prod-2", name: "Galleta" });
    const { items } = useCartStore.getState();

    expect(items).toHaveLength(2);
    expect(items.some((i) => i.productId === "prod-1")).toBe(true);
    expect(items.some((i) => i.productId === "prod-2")).toBe(true);
  });

  // ── removeItem ─────────────────────────────────────────────────────────

  it("removeItem — elimina el producto del carrito", () => {
    useCartStore.getState().addItem(mockItem);
    useCartStore.getState().removeItem("prod-1");
    const { items, totalItemsInCart, totalAmount } = useCartStore.getState();

    expect(items).toHaveLength(0);
    expect(totalItemsInCart).toBe(0);
    expect(totalAmount).toBe(0);
  });

  it("removeItem — no hace nada si el producto no existe", () => {
    useCartStore.getState().addItem(mockItem);
    useCartStore.getState().removeItem("prod-inexistente");
    const { items } = useCartStore.getState();

    expect(items).toHaveLength(1);
  });

  // ── updateQuantity ─────────────────────────────────────────────────────

  it("updateQuantity — actualiza la cantidad y recalcula totales", () => {
    useCartStore.getState().addItem(mockItem);
    useCartStore.getState().updateQuantity("prod-1", 4);
    const { items, totalItemsInCart, totalAmount } = useCartStore.getState();

    expect(items[0].quantity).toBe(4);
    expect(totalItemsInCart).toBe(4);
    expect(totalAmount).toBe(40);
  });

  it("updateQuantity — no afecta otros productos", () => {
    useCartStore
      .getState()
      .addItem({ ...mockItem, productId: "prod-1", quantity: 1 });
    useCartStore
      .getState()
      .addItem({ ...mockItem, productId: "prod-2", price: 5, quantity: 1 });
    useCartStore.getState().updateQuantity("prod-1", 3);
    const { items, totalAmount } = useCartStore.getState();

    const prod2 = items.find((i) => i.productId === "prod-2");
    expect(prod2?.quantity).toBe(1);
    expect(totalAmount).toBe(35); // 10*3 + 5*1
  });

  // ── cleanCart ──────────────────────────────────────────────────────────

  it("cleanCart — vacía el carrito completamente", () => {
    useCartStore.getState().addItem(mockItem);
    useCartStore.getState().addItem({ ...mockItem, productId: "prod-2" });
    useCartStore.getState().cleanCart();
    const { items, totalItemsInCart, totalAmount } = useCartStore.getState();

    expect(items).toHaveLength(0);
    expect(totalItemsInCart).toBe(0);
    expect(totalAmount).toBe(0);
  });

  // ── totalAmount ────────────────────────────────────────────────────────

  it("totalAmount — calcula correctamente con múltiples productos", () => {
    useCartStore.getState().addItem({ ...mockItem, price: 15, quantity: 2 });
    useCartStore
      .getState()
      .addItem({ ...mockItem, productId: "prod-2", price: 8, quantity: 3 });
    const { totalAmount } = useCartStore.getState();

    expect(totalAmount).toBe(54); // 15*2 + 8*3
  });
});
