import { updatePromo } from "@/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdatePromo = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: {
        code: string;
        discount_percent: number;
        is_active: boolean;
        valid_from: string;
        valid_until: string;
        created_at: string;
        id: string;
      };
    }) => updatePromo(id, values),

    onSuccess: () => {
      toast.success("Promoción actualizada, OK", {
        position: "bottom-right",
      });
      queryClient.invalidateQueries({ queryKey: ["promo"] });

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
