import { createPromo } from "@/actions";
import { PromoCodeFormValues } from "@/lib/validators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreatePromo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newPromo: PromoCodeFormValues) => createPromo(newPromo),
    onSuccess: () => {
      toast.success("Promoción creada exitosamente", {
        position: "bottom-right",
      });
      queryClient.invalidateQueries({ queryKey: ["promo"] }); // Opcional: recarga la lista
    },
  });
};
