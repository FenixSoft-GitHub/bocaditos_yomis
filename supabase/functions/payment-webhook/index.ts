import { supabaseAdmin } from "../_shared/supabase-client.ts";

Deno.serve(async (req) => {
  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json" },
    });

  try {
    // ─── 1. MercadoPago envía una notificación con topic + id ───────────
    const url = new URL(req.url);
    const topic = url.searchParams.get("topic") || url.searchParams.get("type");
    const resourceId =
      url.searchParams.get("id") || url.searchParams.get("data.id");

    // Solo nos interesan notificaciones de pagos
    if (topic !== "payment") {
      return json({ received: true });
    }

    if (!resourceId) {
      return json({ error: "Sin resource ID" }, 400);
    }

    // ─── 2. Consultar el pago directamente a MP (nunca confiar en el body)
    const mpResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${resourceId}`,
      {
        headers: {
          Authorization: `Bearer ${Deno.env.get("MP_ACCESS_TOKEN")}`,
        },
      },
    );

    if (!mpResponse.ok) {
      throw new Error(`MP respondió ${mpResponse.status}`);
    }

    const payment = await mpResponse.json();

    // external_reference es el order_id que pusimos al crear la preferencia
    const orderId = payment.external_reference;
    const paymentStatus = payment.status; // approved | rejected | pending | in_process

    if (!orderId) {
      console.error("[webhook] Sin external_reference en el pago", payment.id);
      return json({ received: true }); // no romper — MP reintenta si falla
    }

    // ─── 3. Mapear status de MP a status de tu app ──────────────────────
    const orderStatusMap: Record<string, string> = {
      approved: "paid",
      rejected: "cancelled",
      pending: "pending",
      in_process: "pending",
      cancelled: "cancelled",
      refunded: "refunded",
    };

    const newOrderStatus = orderStatusMap[paymentStatus] ?? "pending";

    // ─── 4. Actualizar la orden ─────────────────────────────────────────
    const updateData: Record<string, unknown> = {
      mp_payment_id: String(payment.id),
      mp_payment_status: paymentStatus,
      status: newOrderStatus,
    };

    // Si fue aprobado, registrar fecha exacta del pago
    if (paymentStatus === "approved") {
      updateData.paid_at = payment.date_approved;
    }

    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update(updateData)
      .eq("id", orderId);

    if (updateError) {
      console.error("[webhook] Error actualizando orden:", updateError);
      // Retornar 500 para que MP reintente
      return json({ error: "Error interno" }, 500);
    }

    // ─── 5. Si fue aprobado, descontar stock ────────────────────────────
    if (paymentStatus === "approved") {
      const { data: items } = await supabaseAdmin
        .from("order_items")
        .select("product_id, quantity")
        .eq("order_id", orderId);

      if (items) {
        for (const item of items) {
          await supabaseAdmin.rpc("decrement_stock", {
            p_product_id: item.product_id,
            p_quantity: item.quantity,
          });
        }
      }
    }

    // ─── 6. MP espera un 200 rápido — siempre responder OK ─────────────
    return json({ received: true });
  } catch (err) {
    console.error("[payment-webhook]", err);
    // Retornar 500 para que MP reintente la notificación
    return json({ error: "Error interno" }, 500);
  }
});
