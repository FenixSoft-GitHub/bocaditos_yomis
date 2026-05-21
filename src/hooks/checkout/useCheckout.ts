import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cart.store";
import { useCreateOrder } from "./useCreateOrder";
import { useSubmitReceipt } from "./useSubmitReceipt";
import type {
  CreateOrderPayload,
  CreateOrderResponse,
  SubmitReceiptPayload,
} from "@/interfaces/checkout.interface";

export type CheckoutStep = "form" | "payment" | "confirmed";

export const useCheckout = () => {
  const navigate = useNavigate();
  const cleanCart = useCartStore((state) => state.cleanCart);
  const [step, setStep] = useState<CheckoutStep>("form");
  const [orderData, setOrderData] = useState<CreateOrderResponse | null>(null);

  const {
    mutateAsync: createOrder,
    isPending: isCreatingOrder,
    error: createOrderError,
  } = useCreateOrder();

  const {
    mutateAsync: submitReceipt,
    isPending: isSubmittingReceipt,
    error: submitReceiptError,
  } = useSubmitReceipt();

  const handleCreateOrder = async (payload: CreateOrderPayload) => {
    const data = await createOrder(payload);
    setOrderData(data);
    setStep("payment");
  };

  const handleSubmitReceipt = async (payload: SubmitReceiptPayload) => {
    await submitReceipt(payload);
    cleanCart();
    setStep("confirmed");
  };

  const goToOrders = () => navigate("/account/pedidos");

  return {
    step,
    orderData,
    loading: isCreatingOrder || isSubmittingReceipt,
    error: createOrderError?.message ?? submitReceiptError?.message ?? null,
    handleCreateOrder,
    handleSubmitReceipt,
    goToOrders,
  };
};

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   createOrder,
//   submitPaymentReceipt,
//   type CreateOrderPayload,
//   type CreateOrderResponse,
//   type SubmitReceiptPayload,
// } from "@/services/orderService";
// import { useCartStore } from "@/store/cart.store";

// export type CheckoutStep = "form" | "payment" | "confirmed";

// export function useCheckout() {
//   const navigate = useNavigate();
//   const [step, setStep] = useState<CheckoutStep>("form");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [orderData, setOrderData] = useState<CreateOrderResponse | null>(null);
//   const cleanCart = useCartStore((state) => state.cleanCart);

//   async function handleCreateOrder(payload: CreateOrderPayload) {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await createOrder(payload);
//       setOrderData(data);
//       setStep("payment");
//     } catch (err: any) {
//       setError(err.message ?? "Error al procesar el pedido");
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleSubmitReceipt(payload: SubmitReceiptPayload) {
//     setLoading(true);
//     setError(null);
//     try {
//       await submitPaymentReceipt(payload);
//       cleanCart(); // ← limpiar carrito al confirmar
//       setStep("confirmed");
//     } catch (err: any) {
//       setError(err.message ?? "Error al enviar el comprobante");
//     } finally {
//       setLoading(false);
//     }
//   }

//   function goToOrders() {
//     navigate("/account/pedidos");
//   }

//   return {
//     step,
//     loading,
//     error,
//     orderData,
//     handleCreateOrder,
//     handleSubmitReceipt,
//     goToOrders,
//   };
// }
