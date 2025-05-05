import { useQuery } from "@tanstack/react-query";
import { getPromoCodes } from "@/actions";

export const usePromoCode = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["promo_codes"],
    queryFn: getPromoCodes,
    retry: false,
  });

  return {
    data,
    isLoading,
  };
};
