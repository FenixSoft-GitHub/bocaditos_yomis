import { supabase } from "@/supabase/client";
import { DiscountFormValues } from "@/lib/validators";

// 1. Crear un descuento nuevo
export async function createDiscount(
  data: DiscountFormValues & { product_id: string }
) {
  const startsAtISO =
    data.starts_at instanceof Date ? data.starts_at.toISOString() : ""; // Asegurar que es un Date object
  const endsAtISO =
    data.ends_at instanceof Date ? data.ends_at.toISOString() : ""; // Asegurar que es un Date object

  const { data: insertedData, error } = await supabase
    .from("discounts")
    .insert([
      {
        product_id: data.product_id,
        discount_type: data.discount_type, // Directamente del data, Zod ya lo validó
        value: data.value, // Directamente del data, Zod ya lo validó
        starts_at: startsAtISO,
        ends_at: endsAtISO,
      },
    ])
    .select("id")
    .single();

  if (error) {
    console.error("Error al crear descuento en Supabase:", error);
    throw new Error("Error al crear descuento: " + error.message);
  }
  return insertedData;
}

// 2. Actualizar un descuento existente
export async function updateDiscount(
  discountId: string,
  data: DiscountFormValues & { product_id?: string }
) {
  const startsAtISO =
    data.starts_at instanceof Date ? data.starts_at.toISOString() : "";
  const endsAtISO =
    data.ends_at instanceof Date ? data.ends_at.toISOString() : "";

  const updateObject: {
    discount_type?: "percentage" | "fixed";
    value?: number;
    starts_at?: string;
    ends_at?: string;
    product_id?: string;
  } = {};

  if (data.discount_type !== undefined)
    updateObject.discount_type = data.discount_type;
  if (data.value !== undefined) updateObject.value = data.value;
  if (data.starts_at !== undefined) updateObject.starts_at = startsAtISO;
  if (data.ends_at !== undefined) updateObject.ends_at = endsAtISO;
  if (data.product_id !== undefined) updateObject.product_id = data.product_id;

  const { error, data: updatedDiscount } = await supabase
    .from("discounts")
    .update(updateObject) // Envía solo los campos definidos
    .eq("id", discountId)
    .select()
    .single();

  if (error) {
    console.error("Error al actualizar descuento en Supabase:", error);
    throw new Error("Error al actualizar descuento: " + error.message);
  }
  return updatedDiscount;
}

// 3. Obtener el descuento activo de un producto
export async function getActiveDiscountByProduct(productId: string) {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("discounts")
    .select("*")
    .eq("product_id", productId)
    .lte("starts_at", now)
    .gte("ends_at", now)
    .maybeSingle(); // Usar maybeSingle() en lugar de single() para manejar el caso donde no hay descuento sin lanzar un error PGRST116

  if (error && error.code !== "PGRST116") { // PGRST116 es "No rows found"
    console.error("Error al obtener descuento en Supabase:", error);
    throw new Error("Error al obtener descuento: " + error.message);
  }

  return data; // Retorna null si no se encuentra ningún descuento activo
}

export async function deleteDiscount(discountId: string) {
  const { error } = await supabase
    .from("discounts")
    .delete()
    .eq("id", discountId);

  if (error) {
    console.error("Error al eliminar descuento en Supabase:", error);
    throw new Error("Error al eliminar descuento: " + error.message);
  }
  return { success: true }; // Retorna algo para indicar éxito
}