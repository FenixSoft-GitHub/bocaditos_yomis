export interface CartItem {
  product_id: string;
  quantity: number;
}

// El cliente envía address_id (ya guardada en BD), no un objeto de dirección
export interface CreateOrderPayload {
  items: CartItem[];
  address_id: string;
  delivery_option_id: string;
  promo_code?: string; // código de texto, ej: "VERANO10"
  notes?: string;
}
