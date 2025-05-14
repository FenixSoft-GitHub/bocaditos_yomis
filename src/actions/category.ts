import { CategoryFormValues } from "@/lib/validators";
import { supabase } from "@/supabase/client";

// Obtener todos los productos
export const getCategories = async () => {
  try {
    const { data: categories, error } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      throw new Error(error.message);
    }

    return categories;
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }
};

export const createCategory = async (category: CategoryFormValues) => {
  const { data, error } = await supabase
    .from("categories")
    .insert([
      {
        name: category.name,
        description: category.description ?? "",
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// src/actions/categories.ts (añadir esto también)
export const deleteCategory = async (id: string) => {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error.message);
    throw new Error("Error al eliminar la categoría");
  }
};

export const updateCategory = async (
  id: string,
  values: CategoryFormValues
) => {
  const { error } = await supabase
    .from("categories")
    .update({name: values.name, description: values.description})
    .eq("id", id);

  if (error) throw new Error(error.message);
};

export const getCategoryById = async (id: string) => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
};




