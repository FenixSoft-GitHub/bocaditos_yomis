// src/actions/wishlist.ts

import { supabase } from "@/supabase/client";
import {
  Product,
  SupabaseRawProductWithRelations,
} from "@/interfaces/product.interface";
import { isDiscountActive } from "@/lib/discount";

// ── Helpers ────────────────────────────────────────────────────────────────

const transformProduct = (raw: SupabaseRawProductWithRelations): Product => {
  const activeDiscount = raw.discounts
    ? raw.discounts.find(isDiscountActive) || null
    : null;
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    price: raw.price,
    image_url: raw.image_url,
    stock: raw.stock,
    slug: raw.slug,
    category_id: raw.category_id,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    categories: raw.categories || null,
    discount: activeDiscount,
  };
};

// ── Obtener IDs de favoritos del usuario ──────────────────────────────────

export const getWishlistIds = async (): Promise<string[]> => {
  const { data, error } = await supabase.from("wishlists").select("product_id");

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => row.product_id);
};

// ── Obtener productos completos de la wishlist ────────────────────────────

export const getWishlistProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("wishlists")
    .select("product_id, products(*, categories(*), discounts(*))")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  if (!data) return [];

  return data
    .map((row) => row.products as unknown as SupabaseRawProductWithRelations)
    .filter(Boolean)
    .map(transformProduct);
};

// ── Toggle favorito (add/remove) ──────────────────────────────────────────

export const toggleWishlist = async (
  productId: string,
): Promise<"added" | "removed"> => {
  const { data, error } = await supabase.rpc("toggle_wishlist", {
    p_product_id: productId,
  });

  if (error) throw new Error(error.message);

  const result = data as unknown as { action: "added" | "removed" };
  return result.action;
};
