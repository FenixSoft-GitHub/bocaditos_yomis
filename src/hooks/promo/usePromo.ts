import { useQuery } from "@tanstack/react-query";
import { getPromo } from "@/actions";
export const usePromo = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["promo"],
    queryFn: () => getPromo(),
    staleTime: 1000 * 60 * 5, // 1 hora
  });

  return {
    promotions: data,
    isLoading,
  };
};
