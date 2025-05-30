import { ReviewFormValues } from "@/lib/validators";
import { supabase } from "@/supabase/client";

export async function getReviewsByProduct(productId: string) {
  const { data, error } = await supabase
    .from("reviews")
    .select("rating, comment, created_at, users(full_name)")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error cargando reseñas:", error.message);
    return [];
  }

  return data.map((r) => ({
    rating: r.rating,
    comment: r.comment,
    created_at: r.created_at,
    user_name: r.users?.full_name ?? "Anónimo",
  }));
}

export const createReview = async (
  review: Omit<ReviewFormValues, "user_id">
) => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) throw new Error("Usuario no autenticado");
  
  const userId = user.id;

  const { data: customer, error: errorCustomer } = await supabase
    .from("users")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (errorCustomer) {
    console.log(errorCustomer);
    throw new Error(errorCustomer.message);
  }

  const customerId = customer.id;

  const { data, error } = await supabase
    .from("reviews")
    .upsert(
      [
        {
          user_id: customerId,
          product_id: review.product_id,
          rating: review.rating,
          comment: review.comment,
        },
      ],
      {
        onConflict: "user_id,product_id",
      }
    )
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};
