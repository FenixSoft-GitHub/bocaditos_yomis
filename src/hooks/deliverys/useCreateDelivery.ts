import { createDelivery } from "@/actions";
import { DeliveryOptionFormValues } from "@/lib/validators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newDelivery: DeliveryOptionFormValues) =>
      createDelivery(newDelivery),
    onSuccess: () => {
      toast.success("Delivery creado exitosamente", {
        position: "bottom-right",
      });
      queryClient.invalidateQueries({ queryKey: ["deliverys"] }); // Opcional: recarga la lista
    },
  });
};
