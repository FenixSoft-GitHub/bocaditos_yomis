import { getReviewsByProduct } from "@/actions";
import { useQuery } from "@tanstack/react-query";

export const useGetReviewsByProduct = (productId?: string) => {
  return useQuery({
    queryKey: ["review", productId],
    queryFn: () => getReviewsByProduct(productId!),
    enabled: !!productId,
  });
};
