import { OrderInput } from "@/interfaces";
import { supabase } from "@/supabase/client";

export const createOrder = async (order: OrderInput) => {
  // 1. Obtener el usuario autenticado + Cliente de tabla customer
  const { data, error: errorUser } = await supabase.auth.getUser();

  if (errorUser) {
    console.log(errorUser);
    throw new Error(errorUser.message);
  }

  const userId = data.user.id;

  const { data: customer, error: errorCustomer } = await supabase
    .from("users")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (errorCustomer) {
    console.log(errorCustomer);
    throw new Error(errorCustomer.message);
  }

  const customerId = customer.id;

  // 2. Verificar que haya stock suficiente para cada variante en el carrito
  for (const item of order.cartItems) {
    const { data: productData, error: productError } = await supabase
      .from("products")
      .select("stock")
      .eq("id", item.productId)
      .single();

    if (productError) {
      console.log(productError);
      throw new Error(productError.message);
    }

    const stock = productData.stock || 0; // Asegurarse de que el stock sea un número

    if (stock < item.quantity) {
      throw new Error("No hay stock suficiente los artículos seleccionados");
    }
  }

  // 3. Guardar la dirección del envío
  const { data: addressData, error: addressError } = await supabase
    .from("addresses")
    .insert({
      address_1: order.address.addressLine1,
      address_2: order.address.addressLine2,
      city: order.address.city,
      state: order.address.state,
      postal_code: order.address.postalCode,
      country: order.address.country,
      user_id: customerId,
    })
    .select()
    .single();

  if (addressError) {
    console.log(addressError);
    throw new Error(addressError.message);
  }

  // 4. Crear la orden
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: customerId,
      address_id: addressData.id,
      total_amount: order.totalAmount,
      status: "Pending",
      promo_code_id: order.promo_code_id,
      delivery_option_id: order.delivery_option_id,
    })
    .select()
    .single();

  if (orderError) {
    console.log(orderError);
    throw new Error(orderError.message);
  }

  // 5. Guardar los detalles de la orden
  const orderItems = order.cartItems.map((item) => ({
    order_id: orderData.id,
    product_id: item.productId,
    quantity: item.quantity,
    unit_price: item.price,
  }));

  const { error: orderItemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (orderItemsError) {
    console.log(orderItemsError);
    throw new Error(orderItemsError.message);
  }

  // 6. Actualizar el stock de  los productos
  for (const item of order.cartItems) {
    // Obtener el stock actual
    const { data: productData } = await supabase
      .from("products")
      .select("stock")
      .eq("id", item.productId)
      .single();

    if (!productData) {
      throw new Error("No se encontró el producto");
    }

    if (productData.stock === null) {
      throw new Error("El stock del producto no es válido");
    }

    const newStock = productData.stock - item.quantity;

    const { error: updatedStockError } = await supabase
      .from("products")
      .update({
        stock: newStock,
      })
      .eq("id", item.productId);

    if (updatedStockError) {
      console.log(updatedStockError);
      throw new Error(`No se pudo actualizar el stock de la variante`);
    }
  }

  return orderData;
};

export const getOrdersByCustomerId = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.log(error);
    throw new Error(error.message);
  }

  const { data: customer, error: customerError } = await supabase
    .from("users")
    .select("id")
    .eq("user_id", data.user.id)
    .single();

  if (customerError) {
    console.log(customerError);
    throw new Error(customerError.message);
  }

  const customerId = customer.id;

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("id, total_amount, status, created_at")
    .eq("user_id", customerId)
    .order("created_at", {
      ascending: false,
    });

  if (ordersError) {
    console.log(ordersError);
    throw new Error(ordersError.message);
  }

  return orders;
};

export const getOrderById = async (orderId: string) => {
  const { data, error: errorUser } = await supabase.auth.getUser();

  if (errorUser) {
    console.log(errorUser);
    throw new Error(errorUser.message);
  }

  const { data: user, error: customerError } = await supabase
    .from("users")
    .select("id")
    .eq("user_id", data.user.id)
    .single();

  if (customerError) {
    console.log(customerError);
    throw new Error(customerError.message);
  }

  const userId = user.id;

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      "*, addresses(*), users(full_name, email), order_items(quantity, unit_price, subtotal, products(name, image_url)), promo_codes(code), delivery_options(name)"
    )
    .eq("id", orderId)
    .eq("user_id", userId)
    .single();

  if (error) {
    console.log(error);
    throw new Error(error.message);
  }

  return {
    user: {
      email: order?.users?.email,
      full_name: order.users?.full_name,
    },
    totalAmount: order.total_amount,
    status: order.status,
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
      productImage: item.products.image_url[0],
    })),
  };
};

/* ********************************** */
/*            ADMINISTRADOR           */
/* ********************************** */
export const getAllOrders = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, total_amount, status, created_at, users(full_name, email), promo_codes(code), delivery_options(name)"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
    throw new Error(error.message);
  }

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

  if (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const getOrderByIdAdmin = async (id: string) => {
  const { data: order, error } = await supabase
    .from("orders")
    .select(
      "*, addresses(*), users(full_name, email), order_items(quantity, unit_price, subtotal, products(name, image_url))"
    )
    .eq("id", id)
    .single();

  if (error) {
    console.log(error);
    throw new Error(error.message);
  }

  return {
    customer: {
      email: order?.users?.email,
      full_name: order.users?.full_name,
    },
    totalAmount: order.total_amount,
    status: order.status,
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
  };
};

export const getDeliveryOptions = async () => {
  const { data: delivery, error } = await supabase
    .from("delivery_options")
    .select("id, name, price");
  if (error) throw new Error(error.message);
  return delivery || [];
};

export const getPromoCodes = async () => {
  const { data: promoCodes, error } = await supabase
    .from("promo_codes")
    .select("id, code, discount_percent");
  if (error) throw new Error(error.message);
  return promoCodes || [];
};
