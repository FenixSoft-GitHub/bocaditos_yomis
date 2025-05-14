import { createProduct } from "@/actions";
import { ProductInput } from "@/interfaces";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newProduct: ProductInput) => createProduct(newProduct),
    onSuccess: () => {
      toast.success("Producto creado exitosamente", {
        position: "bottom-right",
      });
      queryClient.invalidateQueries({ queryKey: ["products"] }); // Opcional: recarga la lista
    },
    onError: (error) => {
      toast.error(`Error al crear el producto: ${error.message}`, {
        position: "bottom-right",
      });
    },
  });
};
