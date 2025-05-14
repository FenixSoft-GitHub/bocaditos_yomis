import { useQuery } from "@tanstack/react-query";
import { getProductsPages } from "@/actions";

export const useProductPages = ({ page = 1 }: {page?: number}) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["products", page],
    queryFn: () => getProductsPages(page),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  return {
    products: data?.products,
    error,
    isLoading,
    totalProducts: data?.count ?? 0,
    // totalPages: Math.ceil((data?.count || 0) / 8), // Assuming 8 items per page
  };
};
