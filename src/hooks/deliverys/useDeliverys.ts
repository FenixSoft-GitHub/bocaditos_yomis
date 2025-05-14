import { useQuery } from "@tanstack/react-query";
import { getDeliverys } from "@/actions";
export const useDeliverys = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["deliverys"],
    queryFn: () => getDeliverys(),
    retry: false,
    // staleTime: 1000 * 60 * 5, // 1 hora
  });

  return {
    deliverys: data,
    isLoading,
  };
};
