"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCartStore } from "@/lib/cart/store";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { Loader2 } from "lucide-react";

// Cargar Stripe con tu clave pública
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.getTotal());

  useEffect(() => {
    // Llamar a nuestra API para obtener el 'clientSecret'
    fetch("/api/stripe/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [items]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!clientSecret) {
    return <div className="p-8 text-center">Error al iniciar el pago.</div>;
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white py-12 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Finalizar Compra</h1>
        <p className="text-gray-400 mb-8">
          Total a pagar:{" "}
          <span className="text-green-400 font-bold">${total.toFixed(2)}</span>
        </p>

        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-xl">
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: { theme: "night" }, // Tema oscuro automático
            }}
          >
            <CheckoutForm />
          </Elements>
        </div>
      </div>
    </main>
  );
}
