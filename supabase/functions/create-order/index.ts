import { corsHeaders } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabase-client.ts";
import type { CreateOrderPayload } from "../_shared/types.ts";

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

    // ─── 2. Parsear body ────────────────────────────────────────────────
    const payload: CreateOrderPayload = await req.json();

    if (!payload.items?.length)
      return json({ error: "El carrito está vacío" }, 400);

    if (!payload.address_id)
      return json({ error: "Debes seleccionar una dirección" }, 400);

    if (!payload.delivery_option_id)
      return json({ error: "Debes seleccionar un método de envío" }, 400);

    // ─── 3. Verificar que la dirección pertenece al usuario ─────────────
    const { data: address, error: addressError } = await supabaseAdmin
      .from("addresses")
      .select("id")
      .eq("id", payload.address_id)
      .eq("user_id", user.id) // seguridad: no puede usar dirección ajena
      .single();

    if (addressError || !address)
      return json({ error: "Dirección no válida" }, 422);

    // ─── 4. Validar productos: precio real, stock ───────────────────────
    const productIds = payload.items.map((i) => i.product_id);

    const { data: products, error: productsError } = await supabaseAdmin
      .from("products")
      .select("id, name, price, stock")
      .in("id", productIds);

    if (productsError || !products)
      throw new Error("Error al obtener productos");

    const validationErrors: string[] = [];
    let subtotal = 0;

    const validatedItems = payload.items.map((item) => {
      const product = products.find((p) => p.id === item.product_id);

      if (!product) {
        validationErrors.push(`Producto ${item.product_id} no encontrado`);
        return null;
      }
      if ((product.stock ?? 0) < item.quantity) {
        validationErrors.push(
          `"${product.name}" solo tiene ${product.stock} unidad(es) disponible(s)`,
        );
        return null;
      }

      subtotal += Number(product.price) * item.quantity;

      return {
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: Number(product.price),
        // subtotal es columna GENERATED en tu BD, no hace falta enviarlo
      };
    });

    if (validationErrors.length > 0)
      return json(
        { error: "Validación fallida", details: validationErrors },
        422,
      );

    // ─── 5. Obtener costo de envío ──────────────────────────────────────
    const { data: deliveryOption, error: deliveryError } = await supabaseAdmin
      .from("delivery_options")
      .select("id, name, price")
      .eq("id", payload.delivery_option_id)
      .single();

    if (deliveryError || !deliveryOption)
      return json({ error: "Método de envío no válido" }, 422);

    const shippingCost = Number(deliveryOption.price);

    // ─── 6. Aplicar código promocional (opcional) ───────────────────────
    let discountAmount = 0;
    let promoCodeId: string | null = null;

    if (payload.promo_code) {
      const now = new Date().toISOString();

      const { data: promo, error: promoError } = await supabaseAdmin
        .from("promo_codes")
        .select("id, discount_percent, valid_from, valid_until, is_active")
        .eq("code", payload.promo_code.toUpperCase().trim())
        .single();

      if (promoError || !promo) {
        return json({ error: "Código promocional no válido" }, 422);
      }
      if (!promo.is_active) {
        return json({ error: "Este código ya no está activo" }, 422);
      }
      if (now < promo.valid_from || now > promo.valid_until) {
        return json(
          { error: "Este código está expirado o aún no es válido" },
          422,
        );
      }

      discountAmount = (subtotal * Number(promo.discount_percent)) / 100;
      promoCodeId = promo.id;
    }

    // ─── 7. Calcular total final ────────────────────────────────────────
    const totalAmount = Math.max(0, subtotal + shippingCost - discountAmount);

    // ─── 8. Crear la orden ──────────────────────────────────────────────
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: user.id,
        address_id: payload.address_id,
        delivery_option_id: payload.delivery_option_id,
        promo_code_id: promoCodeId,
        total_amount: totalAmount,
        status: "pending",
      })
      .select()
      .single();

    if (orderError || !order) throw new Error("Error al crear la orden");

    // ─── 9. Insertar order_items ────────────────────────────────────────
    const orderItems = validatedItems.map((item) => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      // Rollback manual
      await supabaseAdmin.from("orders").delete().eq("id", order.id);
      throw new Error("Error al guardar los items de la orden");
    }

    // ─── 10. Respuesta exitosa ──────────────────────────────────────────
    return json({
      order_id: order.id,
      total_amount: totalAmount,
      subtotal,
      shipping_cost: shippingCost,
      discount_amount: discountAmount,
    });
  } catch (err) {
    console.error("[create-order]", err);
    return json({ error: "Error interno del servidor" }, 500);
  }
});
