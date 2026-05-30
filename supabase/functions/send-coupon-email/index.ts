import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type CouponType = "welcome" | "birthday" | "review";

interface EmailPayload {
  to: string;
  full_name: string;
  coupon_code: string;
  coupon_type: CouponType;
  discount: number;
  min_order: number;
  expires_at: string;
}

// ============================================
// HELPERS
// ============================================

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-VE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDiscount(discount: number): string {
  return `${discount}%`;
}

// ============================================
// TEMPLATES
// ============================================

function getEmailContent(payload: EmailPayload): {
  subject: string;
  html: string;
} {
  const {
    full_name,
    coupon_code,
    coupon_type,
    discount,
    min_order,
    expires_at,
  } = payload;
  const firstName = full_name.split(" ")[0];
  const expiresFormatted = formatDate(expires_at);
  const discountFormatted = formatDiscount(discount);
  const minOrderText =
    min_order > 0
      ? `Válido en compras mayores a $${min_order}.`
      : "Sin monto mínimo.";

  const baseStyles = `
    font-family: 'Georgia', serif;
    max-width: 600px;
    margin: 0 auto;
    background-color: #fdfaf6;
    border-radius: 12px;
    overflow: hidden;
  `;

  const headerGradients: Record<CouponType, string> = {
    welcome: "linear-gradient(135deg, #92400e, #d97706)",
    birthday: "linear-gradient(135deg, #7c3aed, #db2777)",
    review: "linear-gradient(135deg, #065f46, #059669)",
  };

  const emojis: Record<CouponType, string> = {
    welcome: "🎉",
    birthday: "🎂",
    review: "⭐",
  };

  const subjects: Record<CouponType, string> = {
    welcome: `¡Bienvenido/a ${firstName}! Aquí está tu regalo de primera compra`,
    birthday: `¡Feliz cumpleaños ${firstName}! 🎂 Un regalo especial para ti`,
    review: `¡Gracias por tu reseña ${firstName}! Te ganaste un descuento`,
  };

  const headlines: Record<CouponType, string> = {
    welcome: `¡Gracias por tu primera compra, ${firstName}!`,
    birthday: `¡Feliz cumpleaños, ${firstName}!`,
    review: `¡Gracias por compartir tu opinión, ${firstName}!`,
  };

  const messages: Record<CouponType, string> = {
    welcome: `
      Nos alegra que hayas confiado en nosotros. Como agradecimiento por ser parte 
      de la familia Bocaditos Yomi's, te regalamos un <strong>${discountFormatted} de descuento</strong> 
      en tu próxima compra.
    `,
    birthday: `
      En este día tan especial queremos celebrarlo contigo. Te regalamos un 
      <strong>${discountFormatted} de descuento</strong> para que te des un gusto 
      con tus bocaditos favoritos. ¡Que lo disfrutes!
    `,
    review: `
      Tu opinión nos ayuda a mejorar y a que otros clientes tomen mejores decisiones. 
      Como agradecimiento, aquí tienes un <strong>${discountFormatted} de descuento</strong> 
      en tu próxima compra.
    `,
  };

  const subject = subjects[coupon_type];
  const emoji = emojis[coupon_type];
  const headline = headlines[coupon_type];
  const message = messages[coupon_type];
  const headerGradient = headerGradients[coupon_type];

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin:0; padding:20px; background-color:#f5f0e8;">
      <div style="${baseStyles}">

        <!-- HEADER -->
        <div style="background: ${headerGradient}; padding: 40px 32px; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 12px;">${emoji}</div>
          <h1 style="
            color: #ffffff;
            font-size: 26px;
            font-weight: bold;
            margin: 0;
            line-height: 1.3;
          ">${headline}</h1>
        </div>

        <!-- BODY -->
        <div style="padding: 36px 32px;">

          <p style="
            color: #44403c;
            font-size: 16px;
            line-height: 1.7;
            margin: 0 0 28px;
          ">${message}</p>

          <!-- CUPÓN -->
          <div style="
            background: #fff8ed;
            border: 2px dashed #d97706;
            border-radius: 12px;
            padding: 28px;
            text-align: center;
            margin-bottom: 28px;
          ">
            <p style="
              color: #92400e;
              font-size: 13px;
              font-weight: 600;
              letter-spacing: 2px;
              text-transform: uppercase;
              margin: 0 0 12px;
            ">Tu código de descuento</p>

            <div style="
              background: #ffffff;
              border: 2px solid #f59e0b;
              border-radius: 8px;
              padding: 16px 24px;
              display: inline-block;
              margin-bottom: 16px;
            ">
              <span style="
                font-family: 'Courier New', monospace;
                font-size: 32px;
                font-weight: bold;
                color: #92400e;
                letter-spacing: 4px;
              ">${coupon_code}</span>
            </div>

            <div style="
              display: flex;
              justify-content: center;
              gap: 24px;
              flex-wrap: wrap;
            ">
              <span style="
                background: #fef3c7;
                color: #92400e;
                padding: 6px 14px;
                border-radius: 20px;
                font-size: 13px;
                font-weight: 600;
              ">🏷️ ${discountFormatted} OFF</span>

              <span style="
                background: #fef3c7;
                color: #92400e;
                padding: 6px 14px;
                border-radius: 20px;
                font-size: 13px;
                font-weight: 600;
              ">📅 Válido hasta ${expiresFormatted}</span>
            </div>

            ${
              min_order > 0
                ? `
            <p style="
              color: #a8a29e;
              font-size: 12px;
              margin: 12px 0 0;
            ">${minOrderText}</p>
            `
                : ""
            }
          </div>

          <!-- CTA -->
          <div style="text-align: center; margin-bottom: 32px;">
            <a href="${Deno.env.get("APP_URL")}/productos" style="
              background: linear-gradient(135deg, #92400e, #d97706);
              color: #ffffff;
              text-decoration: none;
              padding: 14px 36px;
              border-radius: 8px;
              font-size: 16px;
              font-weight: 600;
              display: inline-block;
            ">Ver productos →</a>
          </div>

          <!-- INSTRUCCIONES -->
          <div style="
            background: #f5f5f4;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 24px;
          ">
            <p style="
              color: #57534e;
              font-size: 13px;
              font-weight: 600;
              margin: 0 0 8px;
              text-transform: uppercase;
              letter-spacing: 1px;
            ">¿Cómo usar tu cupón?</p>
            <ol style="
              color: #78716c;
              font-size: 14px;
              line-height: 1.8;
              margin: 0;
              padding-left: 20px;
            ">
              <li>Agrega tus productos favoritos al carrito</li>
              <li>Ve al checkout</li>
              <li>Ingresa el código <strong>${coupon_code}</strong> en el campo de cupón</li>
              <li>¡Listo! El descuento se aplica automáticamente</li>
            </ol>
          </div>

        </div>

        <!-- FOOTER -->
        <div style="
          background: #292524;
          padding: 24px 32px;
          text-align: center;
        ">
          <p style="
            color: #a8a29e;
            font-size: 13px;
            margin: 0 0 8px;
          ">© ${new Date().getFullYear()} Bocaditos Yomi's — Hecho con ❤️</p>
          <p style="
            color: #78716c;
            font-size: 12px;
            margin: 0;
          ">Este cupón es personal e intransferible. Un solo uso por cuenta.</p>
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

  try {
    // Verificar secret interno
    const authHeader = req.headers.get("Authorization");
    const internalSecret = Deno.env.get("INTERNAL_SECRET");

    if (!authHeader || authHeader !== `Bearer ${internalSecret}`) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = (await req.json()) as EmailPayload;

    const {
      to,
      full_name,
      coupon_code,
      coupon_type,
      discount,
      min_order,
      expires_at,
    } = payload;

    if (!to || !coupon_code || !coupon_type) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const fromEmail =
      Deno.env.get("FROM_EMAIL") ?? "noreply@bocaditosyomis.com";

    const { subject, html } = getEmailContent({
      to,
      full_name,
      coupon_code,
      coupon_type,
      discount,
      min_order,
      expires_at,
    });

    const { data, error } = await resend.emails.send({
      from: `Bocaditos Yomi's <${fromEmail}>`,
      to: [to],
      subject,
      html,
    });

    if (error) {
      throw new Error(`Resend error: ${JSON.stringify(error)}`);
    }

    return new Response(JSON.stringify({ success: true, email_id: data?.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("send-coupon-email error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
