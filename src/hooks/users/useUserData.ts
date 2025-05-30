// src/hooks/useUserData.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsersWithRoles, updateUserRole } from "@/actions/users";
import { UserProfile, UserRole } from "@/interfaces/user.interface";

// Hook para obtener todos los usuarios con sus roles
export const useAllUsersWithRoles = () => {
  return useQuery<UserProfile[], Error>({
    queryKey: ["allUsersWithRoles"],
    queryFn: getAllUsersWithRoles,
  });
};

// Hook para actualizar el rol de un usuario
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UserRole | null,
    Error,
    { authUserId: string; newRole: string }
  >({
    mutationFn: ({ authUserId, newRole }) =>
      updateUserRole(authUserId, newRole),
    onSuccess: (updatedRole) => {
      if (updatedRole) {
        // Invalida la query de todos los usuarios para que se refetch-en
        queryClient.invalidateQueries({ queryKey: ["allUsersWithRoles"] });
      }
    },
    onError: (error) => {
      console.error("Failed to update user role:", error);
    },
  });
};
