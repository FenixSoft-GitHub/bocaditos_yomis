"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // A dónde redirigir tras el pago exitoso
        return_url: `${window.location.origin}/checkout/exito`,
      },
    });

    if (error) {
      setMessage(error.message || "Ocurrió un error inesperado.");
      toast.error("Error en el pago");
    } else {
      toast.success("¡Pago procesado exitosamente!");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      {/* Stripe inyecta aquí los campos de tarjeta */}
      <PaymentElement id="payment-element" />

      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="mt-6 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-all"
      >
        {isLoading ? "Procesando..." : "Pagar ahora"}
      </button>

      {message && <div className="text-red-500 mt-2 text-sm">{message}</div>}
    </form>
  );
}
