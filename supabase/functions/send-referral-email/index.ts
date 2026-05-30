import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const APP_URL = "https://bocaditos-yomis.vercel.app";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-VE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ============================================
// TEMPLATE: notificación al referidor
// "Tu amigo completó su primera compra"
// ============================================

function referrerTemplate(
  referrerName: string,
  referredName: string,
  couponCode: string,
  expiresAt: string,
): { subject: string; html: string } {
  const subject = `🎉 ¡${referredName} hizo su primera compra! Aquí está tu recompensa`;

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0; padding:20px; background-color:#f5f0e8; font-family:Georgia,serif;">
      <div style="max-width:600px; margin:0 auto; background:#fdfaf6; border-radius:12px; overflow:hidden;">

        <!-- Header -->
        <div style="background:linear-gradient(135deg,#92400e,#d97706); padding:40px 32px; text-align:center;">
          <div style="font-size:48px; margin-bottom:12px;">🎉</div>
          <h1 style="color:#ffffff; font-size:24px; font-weight:bold; margin:0; line-height:1.3;">
            ¡Tu referido hizo su primera compra!
          </h1>
        </div>

        <!-- Body -->
        <div style="padding:36px 32px;">
          <p style="color:#44403c; font-size:16px; line-height:1.7; margin:0 0 24px;">
            Hola <strong>${referrerName}</strong>, 
            <strong>${referredName}</strong> acaba de completar su primera compra
            en Bocaditos Yomi's gracias a tu recomendación.
            ¡Como agradecimiento, aquí está tu recompensa!
          </p>

          <!-- Cupón -->
          <div style="background:#fff8ed; border:2px dashed #d97706;
            border-radius:12px; padding:28px; text-align:center; margin-bottom:28px;">
            <p style="color:#92400e; font-size:13px; font-weight:600;
              letter-spacing:2px; text-transform:uppercase; margin:0 0 12px;">
              Tu cupón de recompensa
            </p>
            <div style="background:#ffffff; border:2px solid #f59e0b;
              border-radius:8px; padding:16px 24px; display:inline-block; margin-bottom:16px;">
              <span style="font-family:'Courier New',monospace; font-size:28px;
                font-weight:bold; color:#92400e; letter-spacing:4px;">
                ${couponCode}
              </span>
            </div>
            <div style="display:flex; justify-content:center; gap:16px; flex-wrap:wrap;">
              <span style="background:#fef3c7; color:#92400e; padding:6px 14px;
                border-radius:20px; font-size:13px; font-weight:600;">
                🏷️ 5% OFF
              </span>
              <span style="background:#fef3c7; color:#92400e; padding:6px 14px;
                border-radius:20px; font-size:13px; font-weight:600;">
                📅 Válido hasta ${formatDate(expiresAt)}
              </span>
            </div>
          </div>

          <!-- CTA -->
          <div style="text-align:center; margin-bottom:32px;">
            <a href="${APP_URL}/products"
              style="background:linear-gradient(135deg,#92400e,#d97706);
                color:#ffffff; text-decoration:none; padding:14px 36px;
                border-radius:8px; font-size:16px; font-weight:600;
                display:inline-block;">
              Usar mi cupón →
            </a>
          </div>

          <!-- Incentivo a seguir refiriendo -->
          <div style="background:#f0fdf4; border:1px solid #bbf7d0;
            border-radius:8px; padding:16px; text-align:center;">
            <p style="color:#15803d; font-size:14px; margin:0;">
              💚 ¡Sigue compartiendo tu código y gana más descuentos
              con cada amigo que compre!
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
// TEMPLATE: notificación al referido
// "Gracias por unirte, aquí está tu descuento"
// ============================================

function referredTemplate(
  referredName: string,
  referrerName: string,
  couponCode: string,
  expiresAt: string,
): { subject: string; html: string } {
  const subject = `🎁 ¡Bienvenido/a ${referredName}! Tu descuento por unirte está aquí`;

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0; padding:20px; background-color:#f5f0e8; font-family:Georgia,serif;">
      <div style="max-width:600px; margin:0 auto; background:#fdfaf6; border-radius:12px; overflow:hidden;">

        <!-- Header -->
        <div style="background:linear-gradient(135deg,#065f46,#059669); padding:40px 32px; text-align:center;">
          <div style="font-size:48px; margin-bottom:12px;">🎁</div>
          <h1 style="color:#ffffff; font-size:24px; font-weight:bold; margin:0; line-height:1.3;">
            ¡Gracias por unirte a la familia Yomi's!
          </h1>
        </div>

        <!-- Body -->
        <div style="padding:36px 32px;">
          <p style="color:#44403c; font-size:16px; line-height:1.7; margin:0 0 24px;">
            Hola <strong>${referredName}</strong>,
            <strong>${referrerName}</strong> te recomendó Bocaditos Yomi's
            y completaste tu primera compra. ¡Como agradecimiento,
            aquí tienes un descuento especial para tu próxima compra!
          </p>

          <!-- Cupón -->
          <div style="background:#fff8ed; border:2px dashed #059669;
            border-radius:12px; padding:28px; text-align:center; margin-bottom:28px;">
            <p style="color:#065f46; font-size:13px; font-weight:600;
              letter-spacing:2px; text-transform:uppercase; margin:0 0 12px;">
              Tu cupón de bienvenida especial
            </p>
            <div style="background:#ffffff; border:2px solid #059669;
              border-radius:8px; padding:16px 24px; display:inline-block; margin-bottom:16px;">
              <span style="font-family:'Courier New',monospace; font-size:28px;
                font-weight:bold; color:#065f46; letter-spacing:4px;">
                ${couponCode}
              </span>
            </div>
            <div style="display:flex; justify-content:center; gap:16px; flex-wrap:wrap;">
              <span style="background:#dcfce7; color:#065f46; padding:6px 14px;
                border-radius:20px; font-size:13px; font-weight:600;">
                🏷️ 5% OFF
              </span>
              <span style="background:#dcfce7; color:#065f46; padding:6px 14px;
                border-radius:20px; font-size:13px; font-weight:600;">
                📅 Válido hasta ${formatDate(expiresAt)}
              </span>
            </div>
          </div>

          <!-- Instrucciones -->
          <div style="background:#f5f5f4; border-radius:8px; padding:20px; margin-bottom:28px;">
            <p style="color:#57534e; font-size:13px; font-weight:600; margin:0 0 8px;
              text-transform:uppercase; letter-spacing:1px;">
              ¿Cómo usar tu cupón?
            </p>
            <ol style="color:#78716c; font-size:14px; line-height:1.8; margin:0; padding-left:20px;">
              <li>Agrega tus productos favoritos al carrito</li>
              <li>Ve al checkout</li>
              <li>Ingresa el código <strong>${couponCode}</strong></li>
              <li>¡Listo! El descuento se aplica automáticamente</li>
            </ol>
          </div>

          <!-- CTA -->
          <div style="text-align:center; margin-bottom:32px;">
            <a href="${APP_URL}/products"
              style="background:linear-gradient(135deg,#065f46,#059669);
                color:#ffffff; text-decoration:none; padding:14px 36px;
                border-radius:8px; font-size:16px; font-weight:600;
                display:inline-block;">
              Ver productos →
            </a>
          </div>

          <!-- Referir amigos -->
          <div style="background:#f0fdf4; border:1px solid #bbf7d0;
            border-radius:8px; padding:16px; text-align:center;">
            <p style="color:#15803d; font-size:14px; margin:0;">
              💚 ¿Te gustó? ¡Ahora tú también puedes referir amigos
              y ganar descuentos desde tu cuenta!
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

    const { referred_id } = await req.json();

    if (!referred_id) {
      return json({ error: "referred_id es requerido" }, 400);
    }

    // ─── Obtener el referido completado ─────────────────────────
    const { data: referral, error: referralError } = await supabase
      .from("referrals")
      .select(
        `
        *,
        referrer_coupon:auto_coupons!referrer_coupon_id(code, expires_at),
        referred_coupon:auto_coupons!referred_coupon_id(code, expires_at)
      `,
      )
      .eq("referred_id", referred_id)
      .eq("status", "completed")
      .single();

    if (referralError || !referral) {
      return json({ error: "Referido no encontrado o no completado" }, 404);
    }

    // ─── Obtener datos de ambos usuarios ────────────────────────
    const { data: users } = await supabase
      .from("users")
      .select("id, full_name, email")
      .in("id", [referral.referrer_id, referral.referred_id]);

    if (!users || users.length < 2) {
      return json({ error: "Usuarios no encontrados" }, 404);
    }

    const referrer = users.find((u: any) => u.id === referral.referrer_id);
    const referred = users.find((u: any) => u.id === referral.referred_id);

    if (!referrer || !referred) {
      return json({ error: "Datos de usuarios incompletos" }, 404);
    }

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const fromEmail =
      Deno.env.get("FROM_EMAIL") ?? "noreply@bocaditosyomis.com";

    const referrerFirstName = referrer.full_name.split(" ")[0];
    const referredFirstName = referred.full_name.split(" ")[0];

    // ─── Email al referidor ──────────────────────────────────────
    if (referral.referrer_coupon?.code) {
      const { subject, html } = referrerTemplate(
        referrerFirstName,
        referredFirstName,
        referral.referrer_coupon.code,
        referral.referrer_coupon.expires_at,
      );

      await resend.emails.send({
        from: `Bocaditos Yomi's <${fromEmail}>`,
        to: [referrer.email],
        subject,
        html,
      });
    }

    // ─── Email al referido ───────────────────────────────────────
    if (referral.referred_coupon?.code) {
      const { subject, html } = referredTemplate(
        referredFirstName,
        referrerFirstName,
        referral.referred_coupon.code,
        referral.referred_coupon.expires_at,
      );

      await resend.emails.send({
        from: `Bocaditos Yomi's <${fromEmail}>`,
        to: [referred.email],
        subject,
        html,
      });
    }

    return json({
      success: true,
      referrer_emailed: referrer.email,
      referred_emailed: referred.email,
    });
  } catch (error) {
    console.error("[send-referral-email]", error);
    return json({ error: error.message }, 500);
  }
});
