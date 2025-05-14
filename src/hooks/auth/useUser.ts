import { useQuery } from '@tanstack/react-query';
import { getSession } from '@/actions';
import { getUserProfile } from '@/actions/auth';  

export const useUser = () => {
  const { data: sessionData, isLoading: isSessionLoading } = useQuery({
    queryKey: ['user'],
    queryFn: getSession,
    retry: false,
    refetchOnWindowFocus: true,
  });

  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: ['user-profile', sessionData?.session?.user?.id],
    queryFn: async () => {
      if (!sessionData?.session?.user?.id) return null;

      return getUserProfile(sessionData.session.user.id);
    },
    enabled: !!sessionData?.session?.user?.id,
    retry: false,
  });

  return {
    session: sessionData?.session,
    isLoading: isSessionLoading || isProfileLoading,
    userName: profileData?.full_name,
  };
};