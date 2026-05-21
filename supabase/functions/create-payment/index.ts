import { corsHeaders } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabase-client.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    // ─── 1. Autenticación ───────────────────────────────────────────────
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "No autorizado" }, 401);

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) return json({ error: "Token inválido" }, 401);

    // ─── 2. Obtener order_id del body ───────────────────────────────────
    const { order_id } = await req.json();
    if (!order_id) return json({ error: "order_id requerido" }, 400);

    // ─── 3. Verificar que la orden existe y pertenece al usuario ────────
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select(
        `
        id,
        user_id,
        total_amount,
        status,
        order_items (
          quantity,
          unit_price,
          products (
            id,
            name,
            image_url
          )
        )
      `,
      )
      .eq("id", order_id)
      .eq("user_id", user.id) // seguridad: no puede pagar orden ajena
      .single();

    if (orderError || !order)
      return json({ error: "Orden no encontrada" }, 404);

    if (order.status !== "pending")
      return json({ error: "Esta orden ya fue procesada" }, 422);

    // ─── 4. Obtener datos del usuario para MP ───────────────────────────
    const { data: userData } = await supabaseAdmin
      .from("users")
      .select("full_name, email")
      .eq("id", user.id)
      .single();

    // ─── 5. Construir los items para MercadoPago ────────────────────────
    const mpItems = order.order_items.map((item: any) => ({
      id: item.products.id,
      title: item.products.name,
      picture_url: item.products.image_url?.[0] ?? "",
      quantity: item.quantity,
      currency_id: "ARS", // Cambia según tu país: COP, MXN, PEN, CLP, etc.
      unit_price: Number(item.unit_price),
    }));

    // ─── 6. URLs de retorno después del pago ───────────────────────────
    const appUrl = Deno.env.get("APP_URL") ?? "https://tudominio.com";

    const preference = {
      items: mpItems,
      payer: {
        name: userData?.full_name ?? "",
        email: user.email ?? "",
      },
      back_urls: {
        success: `${appUrl}/pedidos/${order.id}?payment=success`,
        failure: `${appUrl}/checkout?payment=failure&order=${order.id}`,
        pending: `${appUrl}/pedidos/${order.id}?payment=pending`,
      },
      auto_return: "approved", // redirige automáticamente si el pago es aprobado
      external_reference: order.id, // clave para identificar la orden en el webhook
      notification_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/payment-webhook`,
      statement_descriptor: "BOCADITOS YOMIS",
      expires: true,
      expiration_date_to: new Date(
        Date.now() + 24 * 60 * 60 * 1000, // expira en 24 horas
      ).toISOString(),
    };

    // ─── 7. Crear preferencia en MercadoPago ───────────────────────────
    const mpResponse = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Deno.env.get("MP_ACCESS_TOKEN")}`,
          "Content-Type": "application/json",
          "X-Idempotency-Key": order.id, // evita crear preferencia duplicada
        },
        body: JSON.stringify(preference),
      },
    );

    if (!mpResponse.ok) {
      const mpError = await mpResponse.json();
      console.error("[create-payment] MP Error:", mpError);
      throw new Error("Error al crear preferencia en MercadoPago");
    }

    const mpData = await mpResponse.json();

    // ─── 8. Guardar el preference_id en la orden ────────────────────────
    await supabaseAdmin
      .from("orders")
      .update({ mp_preference_id: mpData.id })
      .eq("id", order.id);

    // ─── 9. Retornar URLs al frontend ───────────────────────────────────
    return json({
      preference_id: mpData.id,
      init_point: mpData.init_point, // URL producción
      sandbox_init_point: mpData.sandbox_init_point, // URL testing
    });
  } catch (err) {
    console.error("[create-payment]", err);
    return json({ error: "Error interno del servidor" }, 500);
  }
});
