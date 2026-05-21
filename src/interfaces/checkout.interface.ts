export interface CartItemPayload {
  product_id: string;
  quantity: number;
}

export interface CreateOrderPayload {
  items: CartItemPayload[];
  address_id: string;
  delivery_option_id: string;
  payment_type: "pago_movil" | "transferencia";
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
