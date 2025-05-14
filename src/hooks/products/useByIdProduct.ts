import { getByIdProduct } from "@/actions";
import { useQuery } from "@tanstack/react-query";

export const useByIdProduct = (id?: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getByIdProduct(id!),
    enabled: !!id,
  });
};
