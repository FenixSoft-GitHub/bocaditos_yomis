import { useQuery } from '@tanstack/react-query';
import { getDeliveryOptions } from '@/actions';

export const useDelivery = () => {
    const { data, isLoading } = useQuery({
      queryKey: ["delivery"],
      queryFn: getDeliveryOptions,
      retry: false,
    });

    return {
        data,
        isLoading,
    };
};