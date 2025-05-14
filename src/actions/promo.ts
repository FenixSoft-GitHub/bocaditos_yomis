import { PromoCodeFormValues } from "@/lib/validators";
import { supabase } from "@/supabase/client";

// Obtener todos los productos
export const getPromo = async () => {
  try {
    const { data: promotions, error } = await supabase
      .from("promo_codes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      throw new Error(error.message);
    }

    return promotions;
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }
};

export const createPromo = async (promo: PromoCodeFormValues) => {
  const { data, error } = await supabase
    .from("promo_codes")
    .insert([
      {
        code: promo.code,
        discount_percent: promo.discount_percent,
        is_active: promo.is_active,
        valid_from: promo.valid_from,
        valid_until: promo.valid_until,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const deletePromo = async (id: string) => {
  const { error } = await supabase
    .from("promo_codes")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error.message);
    throw new Error("Error al eliminar la Promo");
  }
};

export const updatePromo = async (id: string, values: PromoCodeFormValues) => {
  const { error } = await supabase
    .from("promo_codes")
    .update({
      code: values.code,
      discount_percent: values.discount_percent,
      is_active: values.is_active,
      valid_from: values.valid_from,
      valid_until: values.valid_until,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
};

export const getByIdPromo = async (id: string) => {
  const { data, error } = await supabase
    .from("promo_codes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const updateStatusPromo = async ({
  id,
  is_active,
}: {
  id: string;
  is_active: boolean;
}) => {
  const { error } = await supabase
    .from("promo_codes")
    .update({ is_active })
    .eq("id", id);

  if (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

