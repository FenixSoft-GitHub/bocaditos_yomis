import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteDelivery } from "@/actions";

export const useDeleteDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDelivery,
    onSuccess: () => {
      toast.success("Delivery eliminado éxitosamente", {
        position: "bottom-right",
      });
      queryClient.invalidateQueries({ queryKey: ["deliverys"] });
    },
  });
};
