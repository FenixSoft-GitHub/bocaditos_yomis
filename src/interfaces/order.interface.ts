export interface OrderInput {
  address: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode?: string;
    country: string;
  };
  cartItems: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  delivery_option_id?: string;
  promo_code_id?: string;
}

// address_id: string;
// created_at: string;
// delivery_option_id: string | null;
// id: string;
// promo_code_id: string | null;
// status: string;
// total_amount: number;
// user_id: string;

export interface OrderItemSingle {
	created_at: string;
	id: string;
	status: string;
	total_amount: number;
}

export interface OrderWithCustomer {
	id: string;
	status: string;
	total_amount: number;
	created_at: string;
	users: {
		full_name: string;
		email: string;
	} | null;
}