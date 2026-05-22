// src/components/reviews/ReviewSection.tsx

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema, ReviewFormValues } from "@/lib/validators";
import { useCreateReview, useGetReviewsByProduct } from "@/hooks";
import { useUser } from "@/hooks";
import { useCanReview } from "@/hooks/reviews/useCanReview";
import { formatDateLong } from "@/helpers";
import { useState } from "react";
import {
  Send,
  Star,
  ChevronDown,
  ShieldCheck,
  ShoppingBag,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { StarRating } from "./StarRating";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

// ── Estrellas interactivas para el formulario ──────────────────────────────

const StarPicker = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (val: number) => void;
}) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          whileTap={{ scale: 0.85 }}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`${star} estrella${star > 1 ? "s" : ""}`}
          className="text-dorado transition-transform hover:scale-110"
        >
          <Star
            className={`size-7 transition-colors ${
              star <= (hovered || value)
                ? "fill-dorado text-dorado"
                : "fill-transparent text-dorado/30"
            }`}
          />
        </motion.button>
      ))}
      <span className="ml-2 text-sm text-choco/50 dark:text-cream/50">
        {(hovered || value) === 1 && "Muy malo"}
        {(hovered || value) === 2 && "Malo"}
        {(hovered || value) === 3 && "Regular"}
        {(hovered || value) === 4 && "Bueno"}
        {(hovered || value) === 5 && "Excelente"}
      </span>
    </div>
  );
};

// ── Componente principal ───────────────────────────────────────────────────

interface Props {
  productId: string;
}

export const ReviewSection = ({ productId }: Props) => {
  const user = useUser();
  const [visibleCount, setVisibleCount] = useState(6);
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: reviews = [], isLoading } = useGetReviewsByProduct(productId);
  const { data: canReviewData, isLoading: isCheckingPurchase } =
    useCanReview(productId);
  const { mutate: createReview, isPending } = useCreateReview();

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
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

  const currentRating = watch("rating");

  const onSubmit = (data: ReviewFormValues) => {
    createReview(
      {
        user_id: data.user_id,
        product_id: data.product_id,
        comment: data.comment,
        rating: data.rating,
      },
      {
        onSuccess: () => {
          reset({ ...data, comment: "", rating: 5 });
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 4000);
        },
      },
    );
  };

  // ── Stats del resumen ──────────────────────────────────────────────────
  const validRatings = reviews.filter((r) => r.rating !== null);
  const avgRating =
    validRatings.length > 0
      ? validRatings.reduce((s, r) => s + r.rating!, 0) / validRatings.length
      : 0;
  const verifiedCount = reviews.filter((r) => r.verified_purchase).length;

  // Distribución de estrellas
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: validRatings.filter((r) => r.rating === star).length,
    pct:
      validRatings.length > 0
        ? (validRatings.filter((r) => r.rating === star).length /
            validRatings.length) *
          100
        : 0,
  }));

  return (
    <div className="py-10 text-choco dark:text-cream">
      <h3 className="text-xl font-bold mb-8">Reseñas de clientes</h3>

      {/* ── Resumen con distribución ──────────────────────────────────── */}
      {reviews.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-8 mb-10 p-5 rounded-2xl bg-cocoa/5 dark:bg-cream/5 border border-cocoa/10 dark:border-cream/10">
          {/* Promedio */}
          <div className="flex flex-col items-center justify-center gap-1 shrink-0">
            <span className="text-5xl font-bold">{avgRating.toFixed(1)}</span>
            <StarRating rating={avgRating} />
            <span className="text-xs text-choco/50 dark:text-cream/50 mt-1">
              {reviews.length} reseña{reviews.length !== 1 ? "s" : ""}
            </span>
            {verifiedCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                <ShieldCheck className="size-3.5" />
                {verifiedCount} verificada{verifiedCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Barras de distribución */}
          <div className="flex-1 space-y-1.5">
            {distribution.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-4 text-right shrink-0">{star}</span>
                <Star className="size-3 fill-dorado text-dorado shrink-0" />
                <div className="flex-1 h-2 rounded-full bg-cocoa/10 dark:bg-cream/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full rounded-full bg-dorado"
                  />
                </div>
                <span className="w-4 text-choco/40 dark:text-cream/40 shrink-0">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Lista de reseñas ──────────────────────────────────────────── */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 rounded-xl bg-cocoa/5 dark:bg-cream/5 animate-pulse"
            />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-choco/50 dark:text-cream/50 mb-8">
          Aún no hay reseñas. ¡Sé el primero en compartir tu experiencia!
        </p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {reviews.slice(0, visibleCount).map((review, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border border-cocoa/20 dark:border-cream/10 p-4 rounded-xl bg-cream dark:bg-oscuro shadow-sm space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {/* Avatar con inicial */}
                  <div className="size-8 rounded-full bg-cocoa/15 dark:bg-cream/15 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold uppercase">
                      {review.user_name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-tight">
                      {review.user_name}
                    </p>
                    {review.verified_purchase && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <ShieldCheck className="size-3" />
                        Compra verificada
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[10px] text-choco/40 dark:text-cream/40 shrink-0 mt-0.5">
                  {formatDateLong(review.created_at as string)}
                </span>
              </div>

              <StarRating rating={review.rating ?? 0} />

              <p className="text-sm text-choco/80 dark:text-cream/80 leading-relaxed">
                {review.comment}
              </p>
            </motion.li>
          ))}
        </ul>
      )}

      {visibleCount < reviews.length && (
        <div className="text-center mb-10">
          <button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-cocoa/30 dark:border-cream/20 text-sm font-medium hover:bg-cocoa/10 dark:hover:bg-cream/10 transition-colors"
          >
            <ChevronDown className="size-4" />
            Ver más reseñas
          </button>
        </div>
      )}

      {/* ── Formulario / Estado según el usuario ──────────────────────── */}
      <div className="border-t border-cocoa/20 dark:border-cream/10 pt-8">
        {!user ? (
          // No logueado
          <div className="flex items-center gap-3 p-4 rounded-xl bg-cocoa/5 dark:bg-cream/5 border border-cocoa/10 dark:border-cream/10">
            <Lock className="size-5 text-choco/40 dark:text-cream/40 shrink-0" />
            <p className="text-sm text-choco/60 dark:text-cream/60">
              <Link
                to="/login"
                className="font-semibold underline hover:text-choco dark:hover:text-cream transition-colors"
              >
                Inicia sesión
              </Link>{" "}
              para dejar una reseña.
            </p>
          </div>
        ) : isCheckingPurchase ? (
          // Verificando compra
          <div className="h-12 rounded-xl bg-cocoa/5 dark:bg-cream/5 animate-pulse" />
        ) : canReviewData?.has_review ? (
          // Ya dejó reseña
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50">
            <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              Ya dejaste tu reseña para este producto. ¡Gracias!
            </p>
          </div>
        ) : !canReviewData?.has_bought ? (
          // No compró el producto
          <div className="flex items-start gap-3 p-4 rounded-xl bg-cocoa/5 dark:bg-cream/5 border border-cocoa/10 dark:border-cream/10">
            <ShoppingBag className="size-5 text-choco/40 dark:text-cream/40 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-choco dark:text-cream">
                Solo compradores verificados pueden reseñar
              </p>
              <p className="text-xs text-choco/50 dark:text-cream/50 mt-0.5">
                Compra este producto para compartir tu experiencia.
              </p>
            </div>
          </div>
        ) : (
          // Puede reseñar
          <div>
            <h4 className="font-bold text-base mb-5">Deja tu reseña</h4>

            {/* Toast de éxito inline */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 text-sm text-emerald-700 dark:text-emerald-400"
                >
                  <CheckCircle2 className="size-4 shrink-0" />
                  ¡Reseña enviada! Gracias por tu opinión.
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Estrellas interactivas */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-choco/50 dark:text-cream/50">
                  Tu puntuación
                </label>
                <Controller
                  name="rating"
                  control={control}
                  render={({ field }) => (
                    <StarPicker value={field.value} onChange={field.onChange} />
                  )}
                />
              </div>

              {/* Comentario */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-choco/50 dark:text-cream/50">
                  Tu comentario
                </label>
                <textarea
                  {...register("comment")}
                  placeholder="Cuéntanos tu experiencia con este producto..."
                  className="w-full md:w-2/3 p-3 border border-cocoa/30 dark:border-cream/20 rounded-xl bg-fondo dark:bg-fondo-dark text-sm focus:outline-none focus:ring-2 focus:ring-choco/20 dark:focus:ring-cream/20 resize-none transition-colors"
                  rows={4}
                />
                {errors.comment && (
                  <p className="text-xs text-red-500">
                    {errors.comment.message}
                  </p>
                )}
              </div>

              {/* Badge de compra verificada */}
              {canReviewData?.has_bought && (
                <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <ShieldCheck className="size-4" />
                  Tu reseña tendrá el badge de compra verificada
                </div>
              )}

              <button
                type="submit"
                disabled={isPending || !currentRating}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-choco text-cream dark:bg-cream dark:text-oscuro hover:bg-cocoa dark:hover:bg-butter font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                <Send className="size-4" />
                {isPending ? "Enviando..." : "Enviar reseña"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};