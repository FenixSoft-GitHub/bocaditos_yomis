import { supabase } from "@/supabase/client";

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface CartItemPayload {
  product_id: string;
  quantity: number;
}

export interface CreateOrderPayload {
  items: CartItemPayload[];
  address_id: string;
  delivery_option_id: string;
  payment_type: "pago_movil" | "transferencia" | "pagadito";
  promo_code?: string;
  notes?: string;
}

export interface CreateOrderResponse {
  order_id: string;
  total_amount: number;
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  payment_methods: PaymentMethod[];
}

export interface PaymentMethod {
  id: string;
  type: string;
  bank_name: string;
  account_name: string;
  id_number: string;
  phone: string | null;
  account_number: string | null;
}

export interface SubmitReceiptPayload {
  order_id: string;
  payment_method_id: string;
  reference_number: string;
  amount: number;
  payment_date: string;
  receipt_file?: File;
}

// ─── Funciones ────────────────────────────────────────────────────────────────

// Obtener el JWT del usuario actual
async function getAuthToken(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("No hay sesión activa");
  return token;
}

// Crear orden y obtener datos bancarios
export async function createOrder(
  payload: CreateOrderPayload,
): Promise<CreateOrderResponse> {
  const token = await getAuthToken();
  const supabaseUrl = import.meta.env.VITE_PROJECT_URL_SUPABASE;
  console.log("supabaseUrl:", supabaseUrl);

  const res = await fetch(`${supabaseUrl}/functions/v1/create-order`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  console.log("create-order response:", res.status, data);
  if (!res.ok) throw new Error(data.error ?? "Error al crear la orden");
  return data;
}

// Subir comprobante de pago
export async function submitPaymentReceipt(
  payload: SubmitReceiptPayload,
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No hay sesión activa");

  let receipt_url: string | null = null;

  // 1. Subir imagen si existe
  if (payload.receipt_file) {
    const ext = payload.receipt_file.name.split(".").pop();
    const path = `${user.id}/${payload.order_id}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("receipts")
      .upload(path, payload.receipt_file, { upsert: true });

    if (uploadError) throw new Error("Error al subir el comprobante");

    const { data: urlData } = supabase.storage
      .from("receipts")
      .getPublicUrl(path);

    receipt_url = urlData.publicUrl;
  }

  // 2. Guardar en BD
  const { error } = await supabase.from("payment_receipts").insert({
    order_id: payload.order_id,
    user_id: user.id,
    payment_method_id: payload.payment_method_id,
    reference_number: payload.reference_number,
    amount: payload.amount,
    payment_date: payload.payment_date,
    receipt_url,
    status: "pending",
  });

  if (error) throw new Error("Error al registrar el comprobante");
}

// Obtener métodos de pago activos
export async function getPaymentMethods(
  type?: string,
): Promise<PaymentMethod[]> {
  let query = supabase
    .from("payment_methods")
    .select("*")
    .eq("is_active", true);

  if (type) query = query.eq("type", type);

  const { data, error } = await query;
  if (error) throw new Error("Error al obtener métodos de pago");
  return data ?? [];
}
