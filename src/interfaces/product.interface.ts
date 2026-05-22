export interface Category {
  id: string;
  name: string;
  created_at?: string | null;
  description?: string;
}

export interface Discount {
  id: string;
  product_id: string;
  discount_type: "percentage" | "fixed";
  value: number;
  starts_at: string;
  ends_at: string;
  created_at: string;
}

// Interfaz que representa el producto TAL COMO LO NECESITA TU UI (ProductGrid, CardProduct)
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string[];
  stock: number;
  slug: string;
  category_id: string; // FK directa
  created_at: string | null;
  updated_at: string | null;
  is_active?: boolean;
  // Relaciones transformadas para el frontend:
  categories: Category | null; // Una categoría singular o null
  discount: Discount | null; // Un descuento singular activo o null
}

// Interfaz para la respuesta CRUDA de Supabase antes de la transformación
// Esto es lo que Supabase devuelve cuando haces .select("*, categories(*), discounts(*)")
export interface SupabaseRawProductWithRelations {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string[];
  stock: number;
  created_at: string | null;
  updated_at: string | null;
  slug: string;
  is_active?: boolean;
  categories: Category | null; // <--- CORRECCIÓN CLAVE AQUÍ: Ahora es singular Category o null
  discounts: Discount[] | null; // Supabase devuelve un ARRAY de descuentos
}

// Otras interfaces que tenías
export interface ProductCategory {
  categories: Category[];
  created_at: string | null;
  description: string;
  id: string;
  image_url: string[];
  name: string;
  price: number;
  slug: string;
  stock: number;
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

export interface SearchCategory {
  id: string;
  name: string;
  description: string | null;
  slug: string;
}

export interface SearchPost {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  image_url: string | null;
  published_at: string | null;
  rank: number;
}

export interface SearchResults {
  products: Product[];
  categories: SearchCategory[];
  posts: SearchPost[];
}

export interface RpcSearchResult {
  products: Product[];
  categories: SearchCategory[];
  posts: SearchPost[];
}