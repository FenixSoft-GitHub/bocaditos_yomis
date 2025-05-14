import { updateProduct } from "@/actions";
import { ProductFormValues } from "@/lib/validators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface UpdateProductInput {
  id: string;
  data: ProductFormValues;
}

export const useUpdateProduct = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateProductInput) => updateProduct(id, data),

    onSuccess: () => {
      toast.success("Producto actualizado", {
        position: "bottom-right",
      });
      
      queryClient.invalidateQueries({ queryKey: ["products"] });

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