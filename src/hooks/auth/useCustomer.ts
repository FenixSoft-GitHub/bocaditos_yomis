import { useQuery } from '@tanstack/react-query';
import { getUserRole } from '@/actions';

export const useCustomer = (userId: string) => {
	const { data, isLoading } = useQuery({
		queryKey: ['customer', userId],
		queryFn: () => getUserRole(userId),
		enabled: !!userId,
		retry: false,
		refetchOnWindowFocus: true,
	});

	return {
		data,
		isLoading,
	};
};