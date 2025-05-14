import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deletePromo } from "@/actions";

export const useDeletePromo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePromo,
    onSuccess: () => {
      toast.success("Promoción eliminada éxitosamente", {
        position: "bottom-right",
      });
      queryClient.invalidateQueries({ queryKey: ["promo"] });
    },
  });
};
