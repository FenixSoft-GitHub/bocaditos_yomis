import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type RetentionType = "review_request" | "abandoned_cart" | "reactivation";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

// ============================================
// HELPERS
// ============================================

function formatPrice(amount: number): string {
  return `$${Number(amount).toFixed(2)}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-VE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const APP_URL = "https://bocaditos-yomis.vercel.app";

// ============================================
// TEMPLATES
// ============================================

function reviewRequestTemplate(
  firstName: string,
  orderId: string,
  items: { name: string; unit_price: number; quantity: number }[],
): { subject: string; html: string } {
  const subject = `${firstName}, ¿qué te pareció tu pedido? ⭐`;
  const itemsList = items
    .map(
      (i) => `
    <tr>
      <td style="padding:8px 0; color:#57534e; font-size:14px;">${i.name}</td>
      <td style="padding:8px 0; color:#57534e; font-size:14px; text-align:right;">
        x${i.quantity} — ${formatPrice(i.unit_price * i.quantity)}
      </td>
    </tr>
  `,
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0; padding:20px; background-color:#f5f0e8; font-family:Georgia,serif;">
      <div style="max-width:600px; margin:0 auto; background:#fdfaf6; border-radius:12px; overflow:hidden;">

        <!-- Header -->
        <div style="background:linear-gradient(135deg,#92400e,#d97706); padding:40px 32px; text-align:center;">
          <div style="font-size:48px; margin-bottom:12px;">⭐</div>
          <h1 style="color:#fff; font-size:24px; margin:0;">
            ¿Cómo estuvo tu pedido, ${firstName}?
          </h1>
        </div>

        <!-- Body -->
        <div style="padding:36px 32px;">
          <p style="color:#44403c; font-size:16px; line-height:1.7; margin:0 0 24px;">
            Tu pedido ya fue entregado. Nos encantaría saber tu opinión —
            tu reseña ayuda a otros clientes y nos motiva a seguir mejorando.
          </p>

          <!-- Items -->
          <div style="background:#fff8ed; border-radius:12px; padding:20px; margin-bottom:28px;">
            <p style="color:#92400e; font-size:13px; font-weight:600;
              text-transform:uppercase; letter-spacing:1px; margin:0 0 12px;">
              Tu pedido
            </p>
            <table style="width:100%; border-collapse:collapse;">
              ${itemsList}
            </table>
          </div>

          <!-- CTA -->
          <div style="text-align:center; margin-bottom:32px;">
            <a href="${APP_URL}/products"
              style="background:linear-gradient(135deg,#92400e,#d97706);
                color:#fff; text-decoration:none; padding:14px 36px;
                border-radius:8px; font-size:16px; font-weight:600;
                display:inline-block;">
              Dejar mi reseña →
            </a>
          </div>

          <!-- Incentivo -->
          <div style="background:#f0fdf4; border:1px solid #bbf7d0;
            border-radius:8px; padding:16px; text-align:center;">
            <p style="color:#15803d; font-size:14px; margin:0;">
              🎁 Al dejar una reseña verificada recibirás un
              <strong>cupón de descuento</strong> en tu próxima compra
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background:#292524; padding:24px 32px; text-align:center;">
          <p style="color:#a8a29e; font-size:13px; margin:0;">
            © ${new Date().getFullYear()} Bocaditos Yomi's — Hecho con ❤️
          </p>
        </div>

      </div>
    </body>
    </html>
  `;

  return { subject, html };
}

function abandonedCartTemplate(
  firstName: string,
  items: CartItem[],
): { subject: string; html: string } {
  const subject = `${firstName}, olvidaste algo en tu carrito 🛒`;

  const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  const itemsList = items
    .slice(0, 3)
    .map(
      (i) => `
    <tr>
      <td style="padding:10px 0; border-bottom:1px solid #e7e5e4;">
        <div style="display:flex; align-items:center; gap:12px;">
          ${
            i.image
              ? `
            <img src="${i.image}" alt="${i.name}"
              style="width:48px; height:48px; border-radius:8px;
                object-fit:cover; flex-shrink:0;" />
          `
              : `
            <div style="width:48px; height:48px; border-radius:8px;
              background:#fef3c7; flex-shrink:0;"></div>
          `
          }
          <div>
            <p style="color:#292524; font-size:14px; font-weight:600; margin:0 0 2px;">
              ${i.name}
            </p>
            <p style="color:#78716c; font-size:13px; margin:0;">
              x${i.quantity} — ${formatPrice(i.price * i.quantity)}
            </p>
          </div>
        </div>
      </td>
    </tr>
  `,
    )
    .join("");

  const moreItems =
    items.length > 3
      ? `<p style="color:#78716c; font-size:13px; text-align:center; margin:8px 0 0;">
        +${items.length - 3} producto(s) más en tu carrito
      </p>`
      : "";

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0; padding:20px; background-color:#f5f0e8; font-family:Georgia,serif;">
      <div style="max-width:600px; margin:0 auto; background:#fdfaf6; border-radius:12px; overflow:hidden;">

        <!-- Header -->
        <div style="background:linear-gradient(135deg,#1c1917,#44403c); padding:40px 32px; text-align:center;">
          <div style="font-size:48px; margin-bottom:12px;">🛒</div>
          <h1 style="color:#fef3c7; font-size:24px; margin:0;">
            ¡Tu carrito te está esperando, ${firstName}!
          </h1>
        </div>

        <!-- Body -->
        <div style="padding:36px 32px;">
          <p style="color:#44403c; font-size:16px; line-height:1.7; margin:0 0 24px;">
            Dejaste algunos productos en tu carrito.
            ¡No dejes que se te escapen!
          </p>

          <!-- Items -->
          <div style="background:#fff8ed; border-radius:12px; padding:20px; margin-bottom:20px;">
            <table style="width:100%; border-collapse:collapse;">
              ${itemsList}
            </table>
            ${moreItems}
            <div style="border-top:2px solid #d97706; margin-top:12px; padding-top:12px;
              display:flex; justify-content:space-between;">
              <span style="color:#92400e; font-weight:600;">Total estimado</span>
              <span style="color:#92400e; font-weight:700; font-size:18px;">
                ${formatPrice(total)}
              </span>
            </div>
          </div>

          <!-- CTA -->
          <div style="text-align:center; margin-bottom:32px;">
            <a href="${APP_URL}/products"
              style="background:linear-gradient(135deg,#92400e,#d97706);
                color:#fff; text-decoration:none; padding:14px 36px;
                border-radius:8px; font-size:16px; font-weight:600;
                display:inline-block;">
              Completar mi compra →
            </a>
          </div>

          <!-- Urgencia -->
          <div style="background:#fef2f2; border:1px solid #fecaca;
            border-radius:8px; padding:16px; text-align:center;">
            <p style="color:#dc2626; font-size:14px; margin:0;">
              ⚡ Los productos en tu carrito tienen stock limitado
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background:#292524; padding:24px 32px; text-align:center;">
          <p style="color:#a8a29e; font-size:13px; margin:0 0 8px;">
            © ${new Date().getFullYear()} Bocaditos Yomi's — Hecho con ❤️
          </p>
          <p style="color:#78716c; font-size:12px; margin:0;">
            Si no deseas recibir este tipo de emails, ignora este mensaje.
          </p>
        </div>

      </div>
    </body>
    </html>
  `;

  return { subject, html };
}

function reactivationTemplate(
  firstName: string,
  lastOrderDate: string,
): { subject: string; html: string } {
  const subject = `${firstName}, ¡te extrañamos! 🥺 Aquí tienes algo especial`;

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0; padding:20px; background-color:#f5f0e8; font-family:Georgia,serif;">
      <div style="max-width:600px; margin:0 auto; background:#fdfaf6; border-radius:12px; overflow:hidden;">

        <!-- Header -->
        <div style="background:linear-gradient(135deg,#7c3aed,#db2777); padding:40px 32px; text-align:center;">
          <div style="font-size:48px; margin-bottom:12px;">🥺</div>
          <h1 style="color:#fff; font-size:24px; margin:0;">
            ¡Te extrañamos, ${firstName}!
          </h1>
        </div>

        <!-- Body -->
        <div style="padding:36px 32px;">
          <p style="color:#44403c; font-size:16px; line-height:1.7; margin:0 0 24px;">
            Han pasado 30 días desde tu último pedido el
            <strong>${formatDate(lastOrderDate)}</strong>.
            Tenemos bocaditos nuevos que te van a encantar — y queremos que
            seas de los primeros en probarlos.
          </p>

          <!-- Novedades -->
          <div style="background:#fff8ed; border-radius:12px; padding:24px;
            margin-bottom:28px; text-align:center;">
            <p style="color:#92400e; font-size:13px; font-weight:600;
              text-transform:uppercase; letter-spacing:1px; margin:0 0 16px;">
              ¿Qué hay de nuevo?
            </p>
            <div style="display:flex; justify-content:center; gap:24px; flex-wrap:wrap;">
              <div style="text-align:center;">
                <div style="font-size:32px;">🧀</div>
                <p style="color:#78716c; font-size:13px; margin:4px 0 0;">Tequeños</p>
              </div>
              <div style="text-align:center;">
                <div style="font-size:32px;">🫔</div>
                <p style="color:#78716c; font-size:13px; margin:4px 0 0;">Empanadas</p>
              </div>
              <div style="text-align:center;">
                <div style="font-size:32px;">🥟</div>
                <p style="color:#78716c; font-size:13px; margin:4px 0 0;">Pastelitos</p>
              </div>
            </div>
          </div>

          <!-- CTA -->
          <div style="text-align:center; margin-bottom:32px;">
            <a href="${APP_URL}/products"
              style="background:linear-gradient(135deg,#7c3aed,#db2777);
                color:#fff; text-decoration:none; padding:14px 36px;
                border-radius:8px; font-size:16px; font-weight:600;
                display:inline-block;">
              Ver novedades →
            </a>
          </div>

          <!-- Incentivo -->
          <div style="background:#f5f3ff; border:1px solid #ddd6fe;
            border-radius:8px; padding:16px; text-align:center;">
            <p style="color:#7c3aed; font-size:14px; margin:0;">
              💜 Como cliente especial, tu próximo pedido tiene
              <strong>envío prioritario</strong>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background:#292524; padding:24px 32px; text-align:center;">
          <p style="color:#a8a29e; font-size:13px; margin:0;">
            © ${new Date().getFullYear()} Bocaditos Yomi's — Hecho con ❤️
          </p>
        </div>

      </div>
    </body>
    </html>
  `;

  return { subject, html };
}

// ============================================
// HANDLER
// ============================================

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    // Verificar secret interno
    const authHeader = req.headers.get("Authorization");
    if (authHeader !== `Bearer ${Deno.env.get("INTERNAL_SECRET")}`) {
      return json({ error: "Unauthorized" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const body = await req.json();
    const { type, user_id, order_id } = body as {
      type: RetentionType;
      user_id: string;
      order_id?: string;
    };

    if (!type || !user_id) {
      return json({ error: "type y user_id son requeridos" }, 400);
    }

    // ─── Obtener datos del usuario ───────────────────────────────
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("full_name, email, birth_date")
      .eq("id", user_id)
      .single();

    if (userError || !userData) {
      return json({ error: "Usuario no encontrado" }, 404);
    }

    const firstName = userData.full_name.split(" ")[0];
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const fromEmail =
      Deno.env.get("FROM_EMAIL") ?? "noreply@bocaditosyomis.com";

    let subject = "";
    let html = "";

    // ─── Construir email según tipo ──────────────────────────────
    if (type === "review_request") {
      if (!order_id)
        return json({ error: "order_id requerido para review_request" }, 400);

      // Verificar que no se haya enviado ya
      const { data: existing } = await supabase
        .from("retention_emails")
        .select("id")
        .eq("user_id", user_id)
        .eq("type", "review_request")
        .eq("reference_id", order_id)
        .single();

      if (existing) return json({ skipped: true, reason: "already_sent" });

      // Obtener items de la orden
      const { data: orderItems } = await supabase
        .from("order_items")
        .select("unit_price, quantity, product_id, products(name)")
        .eq("order_id", order_id);

      const items = (orderItems ?? []).map((i: any) => ({
        name: i.products?.name ?? "Producto",
        unit_price: i.unit_price,
        quantity: i.quantity,
      }));

      const template = reviewRequestTemplate(firstName, order_id, items);
      subject = template.subject;
      html = template.html;
    } else if (type === "abandoned_cart") {
      // Obtener items del carrito
      const { data: cartData } = await supabase
        .from("abandoned_carts")
        .select("items")
        .eq("user_id", user_id)
        .single();

      if (!cartData?.items) return json({ skipped: true, reason: "no_cart" });

      const items: CartItem[] =
        typeof cartData.items === "string"
          ? JSON.parse(cartData.items)
          : cartData.items;

      if (!items.length) return json({ skipped: true, reason: "empty_cart" });

      const template = abandonedCartTemplate(firstName, items);
      subject = template.subject;
      html = template.html;
    } else if (type === "reactivation") {
      // Obtener última orden
      const { data: lastOrder } = await supabase
        .from("orders")
        .select("created_at")
        .eq("user_id", user_id)
        .eq("status", "delivered")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!lastOrder) return json({ skipped: true, reason: "no_orders" });

      const template = reactivationTemplate(firstName, lastOrder.created_at);
      subject = template.subject;
      html = template.html;
    }

    // ─── Enviar email ────────────────────────────────────────────
    const { error: sendError } = await resend.emails.send({
      from: `Bocaditos Yomi's <${fromEmail}>`,
      to: [userData.email],
      subject,
      html,
    });

    if (sendError)
      throw new Error(`Resend error: ${JSON.stringify(sendError)}`);

    // ─── Registrar en retention_emails ──────────────────────────
    await supabase.from("retention_emails").insert({
      user_id,
      type,
      reference_id: order_id ?? null,
    });

    return json({ success: true, email_sent_to: userData.email });
  } catch (error) {
    console.error("[send-retention-email]", error);
    return json({ error: error.message }, 500);
  }
});
