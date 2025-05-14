import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/actions";

export const useCategories = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
    retry: false,
  });

  return {
    categories: data,
    isLoading,
    isError,
  };
};
