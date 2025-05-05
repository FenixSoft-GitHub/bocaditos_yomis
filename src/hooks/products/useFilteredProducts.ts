import { useQuery } from "@tanstack/react-query";
import { getProductsByCategory } from "@/actions";

export const useFilteredProducts = ({
  page,
  category,
}: {
  page: number;
  category: string;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["filteredProducts", page, category],
    queryFn: () => getProductsByCategory({ page, category }),
    retry: false,
  });

  return {
    data: data?.products ?? [],
    isLoading,
    totalProducts: data?.count ?? 0,
  };
};
