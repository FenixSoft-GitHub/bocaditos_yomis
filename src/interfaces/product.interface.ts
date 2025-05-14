export interface Category {
  created_at: string | null;
  description: string;
  id: string;
  name: string;
}

export interface Product {
  category_id: string;
  created_at: string | null;
  description: string;
  id: string;
  image_url: string[];
  name: string;
  price: number;
  slug: string;
  stock: number | null;
  updated_at: string | null;
}

export interface ProductCategory {
  categories: Category[];
  created_at: string | null;
  description: string;
  id: string;
  image_url: string[];
  name: string;
  price: number;
  slug: string;
  stock: number | null;
  updated_at: string | null;
}

export interface ProductInput {
  name: string;
  price: number;
  stock: number;
  category_id: string;
  description: string;
  images: File[];
  slug: string;
}

