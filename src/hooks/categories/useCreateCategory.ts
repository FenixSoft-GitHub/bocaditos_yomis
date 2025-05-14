import { createCategory } from "@/actions";
import { CategoryFormValues } from "@/lib/validators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";


export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newCategory: CategoryFormValues) =>
      createCategory(newCategory),
    onSuccess: () => {
      toast.success("Categoría creada exitosamente", {
        position: "bottom-right"
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] }); // Opcional: recarga la lista
    },
  });
};
