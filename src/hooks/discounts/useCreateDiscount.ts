import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createDiscount } from "@/actions";
import { DiscountFormValues } from "@/lib/validators";

// Crear nuevo descuento
export const useCreateDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DiscountFormValues & { product_id: string }) =>
      createDiscount(data),
    onSuccess: () => {
      toast.success("Descuento creado exitosamente.", {
        position: "bottom-right",
      });
      queryClient.invalidateQueries({ queryKey: ["products"] }); 
    },
    onError: (error) => {
      toast.error("Error al crear el descuento.");
      console.error("Error creating discount:", error);
    },
  });
};
