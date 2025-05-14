import { getByIdPromo } from "@/actions";
import { useQuery } from "@tanstack/react-query";

export const useByIdPromo = (id?: string) => {
  return useQuery({
    queryKey: ["promo", id],
    queryFn: () => getByIdPromo(id!),
    enabled: !!id,
  });
};
  