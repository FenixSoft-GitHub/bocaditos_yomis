// src/hooks/useUser.ts
// Cambio: exponer avatar_url del perfil

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession } from "@/actions";
import { getUserProfile } from "@/actions/auth";

export const useUser = () => {
  const queryClient = useQueryClient();

  const { data: sessionData, isLoading: isSessionLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getSession,
    retry: false,
    refetchOnWindowFocus: true,
  });

  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: ["user-profile", sessionData?.session?.user?.id],
    queryFn: async () => {
      if (!sessionData?.session?.user?.id) return null;
      return getUserProfile(sessionData.session.user.id);
    },
    enabled: !!sessionData?.session?.user?.id,
    retry: false,
  });

  // Invalidar perfil para refrescar el avatar después de subirlo
  const refreshProfile = () => {
    queryClient.invalidateQueries({
      queryKey: ["user-profile", sessionData?.session?.user?.id],
    });
  };

  return {
    session: sessionData?.session,
    user: sessionData?.session?.user ?? null,
    isLoading: isSessionLoading || isProfileLoading,
    userName: profileData?.full_name ?? null,
    avatarUrl: profileData?.avatar_url ?? null,
    refreshProfile,
  };
};