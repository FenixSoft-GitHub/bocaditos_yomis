import { supabase } from "@/supabase/client";
import type {
  CreateOrderPayload,
  CreateOrderResponse,
  SubmitReceiptPayload,
} from "@/interfaces/checkout.interface";

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getAuthToken(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("No hay sesión activa");
  return token;
}

function getSupabaseUrl(): string {
  const url = import.meta.env.VITE_PROJECT_URL_SUPABASE;
  if (!url) throw new Error("VITE_PROJECT_URL_SUPABASE no está definida");
  return url;
}

// ─── Checkout ─────────────────────────────────────────────────────────────────

export const createOrderEdgeFunction = async (
  payload: CreateOrderPayload,
): Promise<CreateOrderResponse> => {
  const token = await getAuthToken();
  const supabaseUrl = getSupabaseUrl();

  const res = await fetch(`${supabaseUrl}/functions/v1/create-order`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Error al crear la orden");
  return data;
};

export const submitPaymentReceipt = async (
  payload: SubmitReceiptPayload,
): Promise<void> => {
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;
  if (!user) throw new Error("No hay sesión activa");

  let receipt_url: string | null = null;

  // Subir imagen si existe
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

  // Guardar comprobante en BD
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

  // ── Obtener datos para el email ───────────────────────────────────────────
  const { data: userData } = await supabase
    .from("users")
    .select("full_name, email")
    .eq("id", user.id)
    .single();

  const { data: receiptData } = await supabase
    .from("payment_receipts")
    .select("reference_number, amount, payment_methods(bank_name)")
    .eq("order_id", payload.order_id)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  const supabaseUrl = import.meta.env.VITE_PROJECT_URL_SUPABASE;

  // ── Enviar emails (cliente + admin) ──────────────────────────────────────
  await fetch(`${supabaseUrl}/functions/v1/send-email`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "receipt_received",
      payload: {
        clientName: userData?.full_name ?? "Cliente",
        clientEmail: userData?.email ?? user.email,
        orderId: payload.order_id,
        amount: payload.amount,
        referenceNumber: payload.reference_number,
        bankName:
          (receiptData?.payment_methods as { bank_name?: string } | null)
            ?.bank_name ?? "",
      },
    }),
  });
};

// export const submitPaymentReceipt = async (
//   payload: SubmitReceiptPayload,
// ): Promise<void> => {
//   const { data: authData } = await supabase.auth.getUser();
//   const user = authData?.user;
//   if (!user) throw new Error("No hay sesión activa");

//   let receipt_url: string | null = null;

//   // Subir imagen si existe
//   if (payload.receipt_file) {
//     const ext = payload.receipt_file.name.split(".").pop();
//     const path = `${user.id}/${payload.order_id}.${ext}`;

//     const { error: uploadError } = await supabase.storage
//       .from("receipts")
//       .upload(path, payload.receipt_file, { upsert: true });

//     if (uploadError) throw new Error("Error al subir el comprobante");

//     const { data: urlData } = supabase.storage
//       .from("receipts")
//       .getPublicUrl(path);

//     receipt_url = urlData.publicUrl;
//   }

//   const { error } = await supabase.from("payment_receipts").insert({
//     order_id: payload.order_id,
//     user_id: user.id,
//     payment_method_id: payload.payment_method_id,
//     reference_number: payload.reference_number,
//     amount: payload.amount,
//     payment_date: payload.payment_date,
//     receipt_url,
//     status: "pending",
//   });

//   if (error) throw new Error("Error al registrar el comprobante");
// };

export const getPaymentMethods = async (type?: string) => {
  let query = supabase
    .from("payment_methods")
    .select("*")
    .eq("is_active", true);

  if (type) query = query.eq("type", type);

  const { data, error } = await query;
  if (error) throw new Error("Error al obtener métodos de pago");
  return data ?? [];
};

// ─── Órdenes del cliente ──────────────────────────────────────────────────────

export const getOrdersByUser = async () => {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) throw new Error("No hay sesión activa");

  const { data, error } = await supabase
    .from("orders")
    .select("id, total_amount, status, created_at, payment_type")
    .eq("user_id", authData.user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

export const getOrderById = async (orderId: string) => {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) throw new Error("No hay sesión activa");

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      addresses (*),
      users (full_name, email),
      order_items (
        quantity,
        unit_price,
        subtotal,
        products (name, image_url)
      ),
      promo_codes (code),
      delivery_options (name)
    `,
    )
    .eq("id", orderId)
    .eq("user_id", authData.user.id)
    .single();

  if (error) throw new Error(error.message);

  return {
    user: {
      email: order.users?.email,
      full_name: order.users?.full_name,
    },
    totalAmount: order.total_amount,
    status: order.status,
    payment_type: order.payment_type,
    created_at: order.created_at,
    promoCode: order.promo_codes?.code,
    deliveryOption: order.delivery_options?.name,
    address: {
      address_1: order.addresses?.address_1,
      address_2: order.addresses?.address_2,
      city: order.addresses?.city,
      state: order.addresses?.state,
      postalCode: order.addresses?.postal_code,
      country: order.addresses?.country,
    },
    orderItems: order.order_items.map((item) => ({
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: item.subtotal,
      productName: item.products?.name,
      productImage: item.products?.image_url[0],
    })),
  };
};

// ─── Admin ────────────────────────────────────────────────────────────────────

export const getAllOrders = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      total_amount,
      status,
      payment_type,
      created_at,
      users (full_name, email),
      promo_codes (code),
      delivery_options (name)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

export const updateOrderStatus = async ({
  id,
  status,
}: {
  id: string;
  status: string;
}) => {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(error.message);
};

export const getOrderByIdAdmin = async (id: string) => {
  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      addresses (*),
      users (full_name, email),
      order_items (
        quantity,
        unit_price,
        subtotal,
        products (name, image_url)
      ),
      delivery_options (name)
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return {
    customer: {
      email: order.users?.email,
      full_name: order.users?.full_name,
    },
    totalAmount: order.total_amount,
    status: order.status,
    payment_type: order.payment_type,
    created_at: order.created_at,
    address: {
      address_1: order.addresses?.address_1,
      address_2: order.addresses?.address_2,
      city: order.addresses?.city,
      state: order.addresses?.state,
      postalCode: order.addresses?.postal_code,
      country: order.addresses?.country,
    },
    orderItems: order.order_items.map((item) => ({
      quantity: item.quantity,
      price: item.unit_price,
      productName: item.products?.name,
      productImage: item.products?.image_url[0],
    })),
    delivery_options: order.delivery_options?.name,
  };
};

// import { OrderInput } from "@/interfaces";
// import { supabase } from "@/supabase/client";

// export const createOrder = async (order: OrderInput) => {
//   // 1. Obtener el usuario autenticado + Cliente de tabla customer
//   const { data, error: errorUser } = await supabase.auth.getUser();

//   if (errorUser) {
//     console.log(errorUser);
//     throw new Error(errorUser.message);
//   }

//   const userId = data.user.id;

//   const { data: customer, error: errorCustomer } = await supabase
//     .from("users")
//     .select("id")
//     .eq("user_id", userId)
//     .single();

//   if (errorCustomer) {
//     console.log(errorCustomer);
//     throw new Error(errorCustomer.message);
//   }

//   const customerId = customer.id;

//   // 2. Verificar que haya stock suficiente para cada variante en el carrito
//   for (const item of order.cartItems) {
//     const { data: productData, error: productError } = await supabase
//       .from("products")
//       .select("stock")
//       .eq("id", item.productId)
//       .single();

//     if (productError) {
//       console.log(productError);
//       throw new Error(productError.message);
//     }

//     const stock = productData.stock || 0; // Asegurarse de que el stock sea un número

//     if (stock < item.quantity) {
//       throw new Error("No hay stock suficiente los artículos seleccionados");
//     }
//   }

//   // 3. Guardar la dirección del envío
//   const { data: addressData, error: addressError } = await supabase
//     .from("addresses")
//     .insert({
//       address_1: order.address.addressLine1,
//       address_2: order.address.addressLine2,
//       city: order.address.city,
//       state: order.address.state,
//       postal_code: order.address.postalCode,
//       country: order.address.country,
//       user_id: customerId,
//     })
//     .select()
//     .single();

//   if (addressError) {
//     console.log(addressError);
//     throw new Error(addressError.message);
//   }

//   // 4. Crear la orden
//   const { data: orderData, error: orderError } = await supabase
//     .from("orders")
//     .insert({
//       user_id: customerId,
//       address_id: addressData.id,
//       total_amount: order.totalAmount,
//       status: "Pending",
//       promo_code_id: order.promo_code_id,
//       delivery_option_id: order.delivery_option_id,
//     })
//     .select()
//     .single();

//   if (orderError) {
//     console.log(orderError);
//     throw new Error(orderError.message);
//   }

//   // 5. Guardar los detalles de la orden
//   const orderItems = order.cartItems.map((item) => ({
//     order_id: orderData.id,
//     product_id: item.productId,
//     quantity: item.quantity,
//     unit_price: item.price,
//   }));

//   const { error: orderItemsError } = await supabase
//     .from("order_items")
//     .insert(orderItems);

//   if (orderItemsError) {
//     console.log(orderItemsError);
//     throw new Error(orderItemsError.message);
//   }

//   // 6. Actualizar el stock de  los productos
//   for (const item of order.cartItems) {
//     // Obtener el stock actual
//     const { data: productData } = await supabase
//       .from("products")
//       .select("stock")
//       .eq("id", item.productId)
//       .single();

//     if (!productData) {
//       throw new Error("No se encontró el producto");
//     }

//     if (productData.stock === null) {
//       throw new Error("El stock del producto no es válido");
//     }

//     const newStock = productData.stock - item.quantity;

//     const { error: updatedStockError } = await supabase
//       .from("products")
//       .update({
//         stock: newStock,
//       })
//       .eq("id", item.productId);

//     if (updatedStockError) {
//       console.log(updatedStockError);
//       throw new Error(`No se pudo actualizar el stock de la variante`);
//     }
//   }

//   return orderData;
// };

// export const getOrdersByCustomerId = async () => {
//   const { data, error } = await supabase.auth.getUser();

//   if (error) {
//     console.log(error);
//     throw new Error(error.message);
//   }

//   const { data: customer, error: customerError } = await supabase
//     .from("users")
//     .select("id")
//     .eq("user_id", data.user.id)
//     .single();

//   if (customerError) {
//     console.log(customerError);
//     throw new Error(customerError.message);
//   }

//   const customerId = customer.id;

//   const { data: orders, error: ordersError } = await supabase
//     .from("orders")
//     .select("id, total_amount, status, created_at")
//     .eq("user_id", customerId)
//     .order("created_at", {
//       ascending: false,
//     });

//   if (ordersError) {
//     console.log(ordersError);
//     throw new Error(ordersError.message);
//   }

//   return orders;
// };

// export const getOrderById = async (orderId: string) => {
//   const { data, error: errorUser } = await supabase.auth.getUser();

//   if (errorUser) {
//     console.log(errorUser);
//     throw new Error(errorUser.message);
//   }

//   const { data: user, error: customerError } = await supabase
//     .from("users")
//     .select("id")
//     .eq("user_id", data.user.id)
//     .single();

//   if (customerError) {
//     console.log(customerError);
//     throw new Error(customerError.message);
//   }

//   const userId = user.id;

//   const { data: order, error } = await supabase
//     .from("orders")
//     .select(
//       "*, addresses(*), users(full_name, email), order_items(quantity, unit_price, subtotal, products(name, image_url)), promo_codes(code), delivery_options(name)"
//     )
//     .eq("id", orderId)
//     .eq("user_id", userId)
//     .single();

//   if (error) {
//     console.log(error);
//     throw new Error(error.message);
//   }

//   return {
//     user: {
//       email: order?.users?.email,
//       full_name: order.users?.full_name,
//     },
//     totalAmount: order.total_amount,
//     status: order.status,
//     created_at: order.created_at,
//     promoCode: order.promo_codes?.code,
//     deliveryOption: order.delivery_options?.name,
//     address: {
//       address_1: order.addresses?.address_1,
//       address_2: order.addresses?.address_2,
//       city: order.addresses?.city,
//       state: order.addresses?.state,
//       postalCode: order.addresses?.postal_code,
//       country: order.addresses?.country,
//     },
//     orderItems: order.order_items.map((item) => ({
//       quantity: item.quantity,
//       unit_price: item.unit_price,
//       subtotal: item.subtotal,
//       productName: item.products?.name,
//       productImage: item.products.image_url[0],
//     })),
//   };
// };

// /* ********************************** */
// /*            ADMINISTRADOR           */
// /* ********************************** */
// export const getAllOrders = async () => {
//   const { data, error } = await supabase
//     .from("orders")
//     .select(
//       "id, total_amount, status, created_at, users(full_name, email), promo_codes(code), delivery_options(name)"
//     )
//     .order("created_at", { ascending: false });

//   if (error) {
//     console.log(error);
//     throw new Error(error.message);
//   }

//   return data;
// };

// export const updateOrderStatus = async ({
//   id,
//   status,
// }: {
//   id: string;
//   status: string;
// }) => {
//   const { error } = await supabase
//     .from("orders")
//     .update({ status })
//     .eq("id", id);

//   if (error) {
//     console.log(error);
//     throw new Error(error.message);
//   }
// };

// export const getOrderByIdAdmin = async (id: string) => {
//   const { data: order, error } = await supabase
//     .from("orders")
//     .select(
//       "*, addresses(*), users(full_name, email), order_items(quantity, unit_price, subtotal, products(name, image_url)), delivery_options(name)"
//     )
//     .eq("id", id)
//     .single();

//   if (error) {
//     console.log(error);
//     throw new Error(error.message);
//   }

//   return {
//     customer: {
//       email: order?.users?.email,
//       full_name: order.users?.full_name,
//     },
//     totalAmount: order.total_amount,
//     status: order.status,
//     created_at: order.created_at,
//     address: {
//       address_1: order.addresses?.address_1,
//       address_2: order.addresses?.address_2,
//       city: order.addresses?.city,
//       state: order.addresses?.state,
//       postalCode: order.addresses?.postal_code,
//       country: order.addresses?.country,
//     },
//     orderItems: order.order_items.map((item) => ({
//       quantity: item.quantity,
//       price: item.unit_price,
//       productName: item.products?.name,
//       productImage: item.products?.image_url[0],
//     })),
//     delivery_options: order.delivery_options?.name
//   };
// };
