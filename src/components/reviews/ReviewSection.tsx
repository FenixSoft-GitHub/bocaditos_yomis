import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema, ReviewFormValues } from "@/lib/validators";
import { useCreateReview, useGetReviewsByProduct } from "@/hooks";
import { useUser } from "@/hooks"; // O el hook que uses para obtener el usuario
import { formatDateLong } from "@/helpers";
import { useState } from "react";
import { LuSend } from "react-icons/lu";

interface Props {
  productId: string;
}

export const ReviewSection = ({ productId }: Props) => {
  const user = useUser();
  const [visibleCount, setVisibleCount] = useState(6); // Mostrar 6 reseñas inicialmente

  const showMoreReviews = () => {
    setVisibleCount((prev) => prev + 6); // Carga 6 más cada vez
  };

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
      {
        onSuccess: () => reset({ ...data, comment: "" }),
      }
    );
  };

  if (!reviews) return <div>Producto no encontrado</div>;

  return (
    <div className="px-24 py-12">
      <h3 className="text-lg font-semibold mb-4">Reseñas de clientes</h3>

      {isLoading ? (
        <p className="text-sm text-muted">Cargando reseñas...</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-muted">Aún no hay reseñas.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {reviews.slice(0, visibleCount).map((review, index) => (
            <li
              key={index}
              className="border p-4 rounded-lg bg-white dark:bg-neutral-900 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">{review.user_name}</p>
                <span className="text-xs text-neutral-500">
                  {formatDateLong(review.created_at as string)}
                </span>
              </div>
              <p className="text-yellow-500 mb-1">
                {"★".repeat(review.rating ?? 0)}
              </p>
              <p className="text-sm">{review.comment}</p>
            </li>
          ))}
        </ul>
      )}

      {visibleCount < reviews.length && (
        <div className="text-center mb-8">
          <button
            onClick={showMoreReviews}
            className="px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded"
          >
            Ver más reseñas
          </button>
        </div>
      )}

      {user ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="w-1/4">
            <label className="text-sm font-medium">Calificación</label>
            <select
              {...register("rating", { valueAsNumber: true })}
              className="w-full p-2 border rounded-md"
            >
              {[1, 2, 3, 4, 5].map((val) => (
                <option key={val} value={val}>
                  {val} estrella{val > 1 ? "s" : ""}
                </option>
              ))}
            </select>
            {errors.rating && (
              <p className="text-sm text-red-500">{errors.rating.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1" >
            <label className="text-sm font-medium">Comentario</label>
            <textarea
              {...register("comment")}
              className="w-1/2 p-2 border rounded-md"
              rows={4}
            />
            {errors.comment && (
              <p className="text-sm text-red-500">{errors.comment.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded flex gap-3 items-center"
          >
            <LuSend />
            {isPending ? "Enviando..." : "Enviar reseña"}
          </button>
        </form>
      ) : (
        <p className="text-sm text-muted">
          Debes iniciar sesión para dejar una reseña.
        </p>
      )}
    </div>
  );
};