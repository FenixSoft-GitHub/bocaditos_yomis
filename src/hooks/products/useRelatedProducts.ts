// src/hooks/products/useRelatedProducts.ts

import { useQuery } from "@tanstack/react-query";
import { getRelatedProducts } from "@/actions/product";

export const useRelatedProducts = (
  categoryId?: string,
  excludeSlug?: string,
) => {
  return useQuery({
    queryKey: ["related-products", categoryId, excludeSlug],
    queryFn: () => getRelatedProducts(categoryId!, excludeSlug!),
    enabled: !!categoryId && !!excludeSlug,
    staleTime: 1000 * 60 * 5,
  });
};