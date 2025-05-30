import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateDiscount } from "@/actions";
import { DiscountFormValues } from "@/lib/validators";


export const useUpdateDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // El mutationFn ahora espera un objeto con el id del descuento y los datos del descuento
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: DiscountFormValues & { product_id?: string };
    }) => updateDiscount(id, data),
    onSuccess: () => {
      toast.success("Descuento actualizado exitosamente.");
      queryClient.invalidateQueries({ queryKey: ["products"] }); // O cualquier key de query que necesites invalidar
    },
    onError: (error) => {
      toast.error("Error al actualizar el descuento.");
      console.error("Error updating discount:", error);
    },
  });
};
