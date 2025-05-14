import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStatusPromo } from "@/actions";
import toast from "react-hot-toast";

export const useChangeStatusPromo = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: updateStatusPromo,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["promo"],
      });
    },
    onError: (error) => {
      console.log(error);
      toast.error("No se pudo actualizar el status de la Promoción", {
        position: "bottom-right",
      });
    },
  });

  return {
    mutate,
    isPending,
  };
};
