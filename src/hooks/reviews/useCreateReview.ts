import { createReview } from "@/actions";
import { ReviewFormValues } from "@/lib/validators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newReview: ReviewFormValues) => createReview(newReview),
    onSuccess: () => {
      toast.success("Review creado exitosamente", {
        position: "bottom-right",
      });
      queryClient.invalidateQueries({ queryKey: ["review"] }); // Opcional: recarga la lista
    },

    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Error desconocido";

      toast.error(`Error al actualizar: ${message}`, {
        position: "bottom-right",
      });
    },
  });
};
