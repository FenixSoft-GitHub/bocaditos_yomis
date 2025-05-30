import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteDiscount } from "@/actions";


export const useDeleteDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDiscount, // Esta función de acción no cambió sus parámetros
    onSuccess: () => {
      toast.success("Descuento eliminado exitosamente.");
      queryClient.invalidateQueries({ queryKey: ["products"] }); // O cualquier key de query que necesites invalidar
    },
    onError: (error) => {
      toast.error("Error al eliminar el descuento.");
      console.error("Error deleting discount:", error);
    },
  });
};