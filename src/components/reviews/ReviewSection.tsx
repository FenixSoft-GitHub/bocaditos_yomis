import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema, ReviewFormValues } from "@/lib/validators";
import { useCreateReview, useGetReviewsByProduct } from "@/hooks";
import { useUser } from "@/hooks";
import { formatDateLong } from "@/helpers";
import { useState } from "react";
import { Send, Star, ChevronDown } from "lucide-react";
import { StarRating } from "./StarRating";

interface Props {
  productId: string;
}

export const ReviewSection = ({ productId }: Props) => {
  const user = useUser();
  const [visibleCount, setVisibleCount] = useState(6);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      product_id: productId,
      user_id: user.session?.user?.id || "",
      rating: 5,
      comment: "",
    },
  });

  const { data: reviews, isLoading } = useGetReviewsByProduct(productId);
  const { mutate: createReview, isPending } = useCreateReview();

  const onSubmit = (data: ReviewFormValues) => {
    createReview(
      {
        user_id: data.user_id,
        product_id: data.product_id,
        comment: data.comment,
        rating: data.rating,
      },
      { onSuccess: () => reset({ ...data, comment: "" }) },
    );
  };

  if (!reviews) return null;

  return (
    <div className="px-4 md:px-12 lg:px-24 py-10 text-choco dark:text-cream">
      <h3 className="text-xl font-semibold mb-6">Reseñas de clientes</h3>

      {isLoading ? (
        <p className="text-sm text-choco/50 dark:text-cream/50">
          Cargando reseñas...
        </p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-choco/50 dark:text-cream/50">
          Aún no hay reseñas. ¡Sé el primero!
        </p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {reviews.slice(0, visibleCount).map((review, index) => (
            <li
              key={index}
              className="border border-cocoa/20 dark:border-cream/10 p-4 rounded-xl bg-cream dark:bg-oscuro shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{review.user_name}</p>
                <span className="text-xs text-choco/40 dark:text-cream/40">
                  {formatDateLong(review.created_at as string)}
                </span>
              </div>
              <StarRating rating={review.rating ?? 0} />
              <p className="text-sm text-choco/80 dark:text-cream/80">
                {review.comment}
              </p>
            </li>
          ))}
        </ul>
      )}

      {visibleCount < reviews.length && (
        <div className="text-center mb-8">
          <button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-cocoa/30 dark:border-cream/20 text-sm font-medium hover:bg-cocoa/10 dark:hover:bg-cream/10 transition-colors"
          >
            <ChevronDown className="size-4" /> Ver más reseñas
          </button>
        </div>
      )}

      {user.session ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 border-t border-cocoa/20 dark:border-cream/10 pt-8"
        >
          <h4 className="font-semibold">Deja tu reseña</h4>
          <div className="flex items-center gap-2">
            <Star className="size-4 text-dorado" />
            <select
              {...register("rating", { valueAsNumber: true })}
              className="px-3 py-2 border border-cocoa/30 dark:border-cream/20 rounded-lg bg-fondo dark:bg-fondo-dark text-sm focus:outline-none focus:ring-2 focus:ring-choco/20"
            >
              {[5, 4, 3, 2, 1].map((val) => (
                <option key={val} value={val}>
                  {val} estrella{val > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <textarea
              {...register("comment")}
              placeholder="Cuéntanos tu experiencia..."
              className="w-full md:w-1/2 p-3 border border-cocoa/30 dark:border-cream/20 rounded-lg bg-fondo dark:bg-fondo-dark text-sm focus:outline-none focus:ring-2 focus:ring-choco/20 resize-none"
              rows={4}
            />
          </div>
          {errors.comment && (
            <p className="text-xs text-red-500">{errors.comment.message}</p>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-choco text-cream dark:bg-cream dark:text-oscuro hover:bg-cocoa dark:hover:bg-butter font-medium text-sm transition-all disabled:opacity-50"
          >
            <Send className="size-4" />
            {isPending ? "Enviando..." : "Enviar reseña"}
          </button>
        </form>
      ) : (
        <p className="text-sm text-choco/50 dark:text-cream/50 border-t border-cocoa/20 dark:border-cream/10 pt-6">
          <a
            href="/login"
            className="underline hover:text-choco dark:hover:text-cream transition-colors"
          >
            Inicia sesión
          </a>{" "}
          para dejar una reseña.
        </p>
      )}
    </div>
  );
};