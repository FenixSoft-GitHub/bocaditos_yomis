import { supabase } from "@/supabase/client";

// Obtener todos los productos
export const getProducts = async () => {
  try {
    const { data: products, error } = await supabase
      .from("products")
      .select("*, categories(*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      throw new Error(error.message);
    }

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }
};

// Obtener productos recientes
export const getRecentProducts = async () => {
  try {
    const { data: products, error } = await supabase
      .from("products")
      .select("*, categories(*)")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.log(error.message);
      throw new Error(error.message);
    }

    return products;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// Obtener productos populares
export const getRandomProducts = async () => {
  try {
    const { data: products, error } = await supabase
      .from("products")
      .select("*, categories(*)")
      .order("created_at", { ascending: false })
      .limit(24); // obtén más para tener margen

    if (error) throw new Error(error.message);

    if (!products) return [];

    // Filtrar productos válidos
    const filtered = products.filter(
      (p) => p?.image_url?.length > 0 && p?.name
    );

    // Mezclar aleatoriamente en el cliente
    const randomProducts = filtered
      .sort(() => 0.5 - Math.random())
      .slice(0, 12); // devolver 12 aleatorios

    return randomProducts;
  } catch (error) {
    console.error("Error fetching random products:", error);
    return [];
  }
};

export const getCategories = async () => {
  try {
    const { data: categories, error } = await supabase
      .from("categories")
      .select("name")
      .order("name", { ascending: true });

    if (error) {
      console.log(error.message);
      throw new Error(`Error fetching product brands: ${error.message}`);
    }

    return categories;
  } catch (error) {
    console.error("Error fetching product brands:", error);
    throw error;
  }
};

export const getProductsByCategory = async ({
  page = 1,
  category = "",
}: {
  page: number;
  category: string;
}) => {
  try {
    page = Number(page) || 1;
    const itemsPerPage = 8;
    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    const baseQuery = supabase
      .from("products")
      .select("*, categories!inner(name)", { count: "exact" })
      .range(from, to)
      .order("name", { ascending: true });

    const query = category
      ? baseQuery.eq("categories.name", category)
      : baseQuery;

    const { data: products, error, count } = await query;

    if (error) {
      console.error("Error fetching filtered products:", error.message);
      throw new Error(`Error fetching products: ${error.message}`);
    }

    return {
      products,
      count: count ?? 0,
    };
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    throw error;
  }
};

export const getProductBySlug = async (slug: string) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(*)")
      .eq("slug", slug)
      .single();

    if (error) {
      console.log(error.message);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Error fetching random product:", error);
    throw error;
  }
};

export const searchProducts = async (searchTerm: string) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(*)")
      .ilike("name", `%${searchTerm}%`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error searching products:", error.message);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};
