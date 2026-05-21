import { useQuery } from '@tanstack/react-query';
import { getOrdersByUser } from "@/actions/order";

export const useOrders = () => {
	const { data, isLoading } = useQuery({
		queryKey: ['orders'],
		queryFn: getOrdersByUser,
		retry: false,
	});

	return {
		data,
		isLoading,
	};
};