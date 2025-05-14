import { DeliveryOptionFormValues } from "@/lib/validators";
import { supabase } from "@/supabase/client";

// Obtener todos los productos
export const getDeliverys = async () => {
  try {
    const { data: deliverys, error } = await supabase
      .from("delivery_options")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      throw new Error(error.message);
    }

    return deliverys;
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }
};

export const createDelivery = async (delivery: DeliveryOptionFormValues) => {
  const { data, error } = await supabase
    .from("delivery_options")
    .insert([
      {
        name: delivery.name,
        price: delivery.price,
        estimated_time: delivery.estimated_time,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// src/actions/categories.ts (añadir esto también)
export const deleteDelivery = async (id: string) => {
  const { error } = await supabase
    .from("delivery_options")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error.message);
    throw new Error("Error al eliminar la delivery");
  }
};

export const updateDelivery = async (id: string, values: DeliveryOptionFormValues) => {
  const { error } = await supabase
    .from("delivery_options")
    .update({
      name: values.name,
      price: values.price,
      estimated_time: values.estimated_time,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
};

export const getDeliveryById = async (id: string) => {
  const { data, error } = await supabase
    .from("delivery_options")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
};
