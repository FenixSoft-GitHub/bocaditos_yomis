// src/hooks/useDeleteCategory.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "@/actions/category";
import toast from "react-hot-toast";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.success("Categoría eliminada éxitosamente", {
        position: "bottom-right"
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
