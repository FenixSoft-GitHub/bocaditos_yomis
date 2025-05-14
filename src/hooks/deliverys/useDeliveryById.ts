import { getDeliveryById } from "@/actions";
import { useQuery } from "@tanstack/react-query";

export const useDeliveryById = (id?: string) => {
  return useQuery({
    queryKey: ["delivery", id],
    queryFn: () => getDeliveryById(id!),
    enabled: !!id,
  });
};
