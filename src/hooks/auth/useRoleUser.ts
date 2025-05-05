import { useQuery } from '@tanstack/react-query';
import { getUserRole } from '@/actions';

export const useRoleUser = (userId: string) => {
	const { data, isLoading } = useQuery({
		queryKey: ['role-user'],
		queryFn: async() => getUserRole(userId),
		enabled: !!userId,
	});

	return {
		data,
		isLoading,
	};
};