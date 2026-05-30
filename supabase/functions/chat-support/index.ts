import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = (context: string, userName: string) => `
Eres el asistente virtual de Bocaditos Yomi's, una tienda de bocaditos y snacks artesanales venezolanos.
Tu nombre es Yomi y tu personalidad es amigable, cálida y profesional.

INFORMACIÓN DEL NEGOCIO:
- Vendemos bocaditos artesanales venezolanos: tequeños, empanadas, pastelitos y más
- Aceptamos pagos por pago móvil, transferencia bancaria y USDT
- Hacemos entregas a domicilio según las opciones de delivery disponibles
- Los pedidos se realizan desde nuestra tienda en línea

CONTEXTO ACTUAL DEL NEGOCIO (productos, categorías y pedidos del cliente):
${context}

CLIENTE:
${userName !== "Visitante" ? `Estás hablando con ${userName}, un cliente registrado.` : "Estás hablando con un visitante no registrado."}

INSTRUCCIONES:
- Responde SIEMPRE en español
- Sé conciso — máximo 3 párrafos por respuesta
- Si te preguntan por productos, menciona nombre y precio
- Si te preguntan por el estado de un pedido, usa la información de contexto
- Si no puedes resolver algo, ofrece escalar a WhatsApp con: [ESCALAR_WHATSAPP]
- NO inventes información que no esté en el contexto
- NO menciones que eres una IA a menos que te lo pregunten directamente
- Para saludos simples responde brevemente y pregunta en qué puedes ayudar

CASOS PARA ESCALAR A WHATSAPP (incluye [ESCALAR_WHATSAPP] en tu respuesta):
- Reclamos o quejas sobre productos recibidos
- Problemas con pagos no reflejados
- Pedidos con más de 3 días sin actualización
- El cliente lo solicita explícitamente
- Preguntas que no puedes resolver con el contexto disponible
`;

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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const body = await req.json();
    const { session_key, message, user_id } = body;

    if (!session_key || !message?.trim()) {
      return json({ error: "session_key y message son requeridos" }, 400);
    }

    // ─── 1. Obtener o crear sesión ───────────────────────────────
    let session: any = null;

    const { data: existingSession } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("session_key", session_key)
      .single();

    if (existingSession) {
      session = existingSession;
    } else {
      const { data: newSession, error: sessionError } = await supabase
        .from("chat_sessions")
        .insert({
          session_key,
          user_id: user_id ?? null,
          status: "open",
        })
        .select()
        .single();

      if (sessionError || !newSession) {
        throw new Error("Error al crear sesión de chat");
      }
      session = newSession;
    }

    // ─── 2. Guardar mensaje del usuario ─────────────────────────
    await supabase.from("chat_messages").insert({
      session_id: session.id,
      role: "user",
      content: message.trim(),
    });

    // ─── 3. Obtener historial (últimos 10 mensajes) ──────────────
    const { data: history } = await supabase
      .from("chat_messages")
      .select("role, content")
      .eq("session_id", session.id)
      .neq("role", "system")
      .order("created_at", { ascending: true })
      .limit(10);

    // ─── 4. Obtener contexto del negocio ────────────────────────
    const { data: contextData } = await supabase.rpc(
      "get_chat_business_context",
      {
        p_user_id: user_id ?? null,
      },
    );

    const contextString = JSON.stringify(contextData, null, 2);

    // ─── 5. Obtener nombre del usuario ───────────────────────────
    let userName = "Visitante";
    if (user_id) {
      const { data: userData } = await supabase
        .from("users")
        .select("full_name")
        .eq("id", user_id)
        .single();
      if (userData?.full_name) userName = userData.full_name.split(" ")[0];
    }

    // ─── 6. Llamar a Claude API ──────────────────────────────────
    const claudeResponse = await fetch(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": Deno.env.get("ANTHROPIC_API_KEY")!,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1024,
          system: SYSTEM_PROMPT(contextString, userName),
          messages: (history ?? []).map((m: any) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.content,
          })),
        }),
      },
    );

    if (!claudeResponse.ok) {
      const err = await claudeResponse.text();
      throw new Error(`Claude API error: ${err}`);
    }

    const claudeData = await claudeResponse.json();
    const assistantMessage: string = claudeData.content?.[0]?.text ?? "";

    // ─── 7. Detectar si debe escalar a WhatsApp ──────────────────
    const shouldEscalate = assistantMessage.includes("[ESCALAR_WHATSAPP]");
    const cleanMessage = assistantMessage
      .replace("[ESCALAR_WHATSAPP]", "")
      .trim();

    // ─── 8. Guardar respuesta del asistente ──────────────────────
    await supabase.from("chat_messages").insert({
      session_id: session.id,
      role: "assistant",
      content: cleanMessage,
    });

    // ─── 9. Actualizar estado si escala ──────────────────────────
    if (shouldEscalate) {
      await supabase
        .from("chat_sessions")
        .update({
          status: "escalated",
          escalated_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.id);
    } else {
      await supabase
        .from("chat_sessions")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", session.id);
    }

    return json({
      message: cleanMessage,
      session_id: session.id,
      should_escalate: shouldEscalate,
    });
  } catch (error) {
    console.error("[chat-support]", error);
    return json({ error: error.message }, 500);
  }
});
