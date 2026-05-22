import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { createElement } from "react";
import "../mocks/supabase";

// Mock de orderService
vi.mock("@/actions/order", () => ({
  createOrderEdgeFunction: vi.fn().mockResolvedValue({
    order_id: "test-order-id",
    total_amount: 100,
    subtotal: 90,
    shipping_cost: 10,
    discount_amount: 0,
    payment_methods: [
      {
        id: "pm-1",
        type: "pago_movil",
        bank_name: "Banco de Venezuela",
        account_name: "Yomi's",
        id_number: "J-123",
        phone: "0414-1234567",
        account_number: null,
      },
    ],
  }),
  submitPaymentReceipt: vi.fn().mockResolvedValue(undefined),
}));

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

// Mock del cart store
vi.mock("@/store/cart.store", () => ({
  useCartStore: vi
    .fn()
    .mockImplementation((selector) =>
      selector({ cleanCart: vi.fn(), items: [] }),
    ),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(MemoryRouter, null, children),
    );
};

describe("useCheckout", () => {
  beforeEach(() => vi.clearAllMocks());

  it("inicia en el paso 'form'", async () => {
    const { useCheckout } = await import("@/hooks/checkout/useCheckout");
    const { result } = renderHook(() => useCheckout(), {
      wrapper: createWrapper(),
    });
    expect(result.current.step).toBe("form");
  });

  it("avanza a 'payment' al crear la orden exitosamente", async () => {
    const { useCheckout } = await import("@/hooks/checkout/useCheckout");
    const { result } = renderHook(() => useCheckout(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.handleCreateOrder({
        items: [{ product_id: "p-1", quantity: 2 }],
        address_id: "addr-1",
        delivery_option_id: "del-1",
        payment_type: "pago_movil",
      });
    });

    await waitFor(() => {
      expect(result.current.step).toBe("payment");
      expect(result.current.orderData?.order_id).toBe("test-order-id");
    });
  });

  it("avanza a 'confirmed' al enviar el comprobante", async () => {
    const { useCheckout } = await import("@/hooks/checkout/useCheckout");
    const { result } = renderHook(() => useCheckout(), {
      wrapper: createWrapper(),
    });

    // Primero crear orden
    await act(async () => {
      await result.current.handleCreateOrder({
        items: [{ product_id: "p-1", quantity: 1 }],
        address_id: "addr-1",
        delivery_option_id: "del-1",
        payment_type: "transferencia",
      });
    });

    // Luego enviar comprobante
    await act(async () => {
      await result.current.handleSubmitReceipt({
        order_id: "test-order-id",
        payment_method_id: "pm-1",
        reference_number: "REF123",
        amount: 100,
        payment_date: "2026-05-21",
      });
    });

    await waitFor(() => {
      expect(result.current.step).toBe("confirmed");
    });
  });

  it("goToOrders navega a /account/pedidos", async () => {
    const { useCheckout } = await import("@/hooks/checkout/useCheckout");
    const { result } = renderHook(() => useCheckout(), {
      wrapper: createWrapper(),
    });

    act(() => result.current.goToOrders());
    expect(mockNavigate).toHaveBeenCalledWith("/account/pedidos");
  });
});
