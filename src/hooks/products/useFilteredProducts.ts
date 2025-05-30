import { useQuery } from "@tanstack/react-query";
import { getProductsByCategory } from "@/actions";

export const useFilteredProducts = ({
  page,
  category,
  search,
}: {
  page: number;
  category: string;
  search: string;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["filteredProducts", page, category, search],
    queryFn: () => getProductsByCategory({ page, category, search }),
    retry: false,
  });

  return {
    data: data?.products ?? [],
    isLoading,
    totalProducts: data?.count ?? 0,
  };
};