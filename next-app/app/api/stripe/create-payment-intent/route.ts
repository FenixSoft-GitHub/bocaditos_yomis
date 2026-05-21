import { NextResponse } from "next/server";
import Stripe from "stripe";

// Inicializar Stripe con la clave secreta (SOLO servidor)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16", // Versión estable actual
});

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Carrito vacío" }, { status: 400 });
    }

    // Calcular el total en centavos (Stripe usa centavos)
    // ️ IMPORTANTE: En producción, deberías consultar los precios reales en la BD
    // para evitar que el usuario envíe precios manipulados.
    let totalAmount = 0;
    items.forEach((item: any) => {
      const price = parseFloat(item.product.price);
      totalAmount += Math.round(price * 100) * item.quantity;
    });

    // Crear la intención de pago
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: "usd",
      automatic_payment_methods: { enabled: true }, // Permite tarjetas, Apple Pay, etc.
      metadata: {
        // Puedes guardar información útil aquí
        shopId: "bocaditos-yomis",
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error Stripe:", error);
    return NextResponse.json({ error: "Error creando pago" }, { status: 500 });
  }
}
