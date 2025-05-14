import { updateCategory } from "@/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateCategory = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: { name: string; description?: string };
    }) => updateCategory(id, values),

    onSuccess: () => {
      toast.success("Categoría actualizada correctamente", {
        position: "bottom-right",
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });

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
