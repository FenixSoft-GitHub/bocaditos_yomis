export interface Category {
  created_at: string | null;
  description: string;
  id: string;
  name: string;
}

export interface Discount {
  id: string;
  product_id: string;
  discount_type: "percentage" | "fixed"; // Ajustado a tipos literales
  value: number;
  starts_at: string; // Supabase devuelve como string ISO
  ends_at: string;   // Supabase devuelve como string ISO
  created_at: string;
}

// Interfaz que representa el producto TAL COMO LO NECESITA TU UI (ProductGrid, CardProduct)
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string[];
  stock: number | null;
  slug: string;
  category_id: string; // FK directa
  created_at: string | null;
  updated_at: string | null;
  
  // Relaciones transformadas para el frontend:
  categories: Category | null; // Una categoría singular o null
  discount: Discount | null;   // Un descuento singular activo o null
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
  stock: number | null;
  created_at: string | null;
  updated_at: string | null;
  slug: string;
  categories: Category | null; // <--- CORRECCIÓN CLAVE AQUÍ: Ahora es singular Category o null
  discounts: Discount[] | null;  // Supabase devuelve un ARRAY de descuentos
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