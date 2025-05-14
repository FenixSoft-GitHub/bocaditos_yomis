
import { useQuery } from "@tanstack/react-query";
import { getProductBySlug } from "@/actions";

export const useProduct = (slug: string) => {
    const { data, isLoading, isError } = useQuery({
      queryKey: ["product", slug],
      queryFn: () => getProductBySlug(slug),
      retry: false,
      enabled: !!slug,
    });

    return {
        product: data,
        isLoading,
        isError,
    };
};
