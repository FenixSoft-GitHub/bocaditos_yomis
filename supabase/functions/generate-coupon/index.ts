import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AutoCoupon {
  id: string;
  user_id: string;
  code: string;
  type: "welcome" | "birthday" | "review";
  discount: number;
  min_order: number;
  expires_at: string;
  email_sent: boolean;
}

interface UserData {
  full_name: string;
  email: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verificar secret interno para que solo Supabase llame esta función
    const authHeader = req.headers.get("Authorization");
    const internalSecret = Deno.env.get("INTERNAL_SECRET");
    
    if (!authHeader || authHeader !== `Bearer ${internalSecret}`) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const body = await req.json();
    const { coupon_id } = body;

    if (!coupon_id) {
      return new Response(JSON.stringify({ error: "coupon_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Obtener cupón
    const { data: coupon, error: couponError } = await supabase
      .from("auto_coupons")
      .select("*")
      .eq("id", coupon_id)
      .eq("email_sent", false)
      .single();

    if (couponError || !coupon) {
      return new Response(
        JSON.stringify({ error: "Coupon not found or email already sent" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const typedCoupon = coupon as AutoCoupon;

    // Obtener datos del usuario desde public.users
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("full_name, email")
      .eq("id", typedCoupon.user_id)
      .single();

    if (userError || !userData) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const user = userData as UserData;

    // Llamar a send-coupon-email
    const emailResponse = await fetch(
      `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-coupon-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${internalSecret}`,
        },
        body: JSON.stringify({
          to: user.email,
          full_name: user.full_name,
          coupon_code: typedCoupon.code,
          coupon_type: typedCoupon.type,
          discount: typedCoupon.discount,
          min_order: typedCoupon.min_order,
          expires_at: typedCoupon.expires_at,
        }),
      },
    );

    if (!emailResponse.ok) {
      const emailError = await emailResponse.text();
      throw new Error(`send-coupon-email failed: ${emailError}`);
    }

    // Marcar email como enviado
    const { error: updateError } = await supabase
      .from("auto_coupons")
      .update({ email_sent: true })
      .eq("id", typedCoupon.id);

    if (updateError) {
      throw new Error(`Failed to mark email_sent: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        coupon_code: typedCoupon.code,
        email_sent_to: user.email,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("generate-coupon error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
