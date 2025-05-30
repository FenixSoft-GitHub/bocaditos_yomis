// src/types/product.ts

export type Category = {
  id: string;
  name: string;
  // agrega más campos si tu tabla categories tiene más
};

export type Discount = {
  id: string;
  product_id: string;
  discount_type: string; // ajusta según tus valores reales
  value: number;
  starts_at: string;
  ends_at: string;
  created_at: string;
};

export type Product = {  
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string[];
  price: number;
  stock: number | null;
  category_id: string;
  created_at: string | null;
  updated_at: string | null;
  categories: Category;
  discounts: Discount[];
};


export type ProductWithDiscount = Product & {
  activeDiscount: Discount | null;
};
  