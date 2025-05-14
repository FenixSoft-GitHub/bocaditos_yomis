import { getCategoryById } from "@/actions";
import { useQuery } from "@tanstack/react-query";

export const useCategoryById = (id?: string) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryById(id!),
    enabled: !!id,
  });
};
