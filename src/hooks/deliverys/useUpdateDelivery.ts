import { updateDelivery } from "@/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateDelivery = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: { name: string; price: number; estimated_time: string };
    }) => updateDelivery(id, values),

    onSuccess: () => {
      toast.success("Delivery actualizado correctamente", {
        position: "bottom-right",
      });
      queryClient.invalidateQueries({ queryKey: ["deliverys"] });

      if (onSuccessCallback) {
        onSuccessCallback();
      };
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
