import { CanReviewResult, Review } from "@/interfaces/reviews.interfaces";
import { ReviewFormValues } from "@/lib/validators";
import { supabase } from "@/supabase/client";

export async function getReviewsByProduct(
  productId: string,
): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("rating, comment, created_at, verified_purchase, users(full_name)")
    .eq("product_id", productId)
    .order("verified_purchase", { ascending: false }) // verificadas primero
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error cargando reseñas:", error.message);
    return [];
  }

  return data.map((r) => ({
    rating: r.rating,
    comment: r.comment,
    created_at: r.created_at,
    verified_purchase: r.verified_purchase ?? false,
    user_name:
      (r.users as { full_name?: string } | null)?.full_name ?? "Anónimo",
  }));
}

// ── Verificar si el usuario puede reseñar ─────────────────────────────────

export async function canReview(productId: string): Promise<CanReviewResult> {
  const { data, error } = await supabase.rpc("can_review", {
    p_product_id: productId,
  });

  if (error) {
    console.error("Error verificando compra:", error.message);
    return {
      can_review: false,
      has_bought: false,
      has_review: false,
      reason: "not_authenticated",
    };
  }

  return data as unknown as CanReviewResult;
}

// ── Crear reseña ───────────────────────────────────────────────────────────

export const createReview = async (
  review: Omit<ReviewFormValues, "user_id">,
) => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Usuario no autenticado");

  // Verificar si tiene compra verificada para marcarla
  const status = await canReview(review.product_id);
  const verified = status.has_bought;

  const { data, error } = await supabase
    .from("reviews")
    .upsert(
      [
        {
          user_id: user.id,
          product_id: review.product_id,
          rating: review.rating,
          comment: review.comment,
          verified_purchase: verified,
        },
      ],
      { onConflict: "user_id,product_id" },
    )
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};