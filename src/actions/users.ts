// src/actions/users.ts

import { supabase } from "@/supabase/client";
import { UserProfile, UserRole } from "@/interfaces/user.interface";

export const _getUsers = async (): Promise<UserProfile[]> => {
  const { data, error } = await supabase
    .from("users")
    .select(`id, full_name, email, user_id, created_at, phone`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error.message);
    throw new Error(error.message);
  }
  // Convertimos a UserProfile[], asegurando que 'role' no esté presente en esta etapa.
  return data.map((user) => ({
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    user_id: user.user_id,
    created_at: user.created_at,
    phone: user.phone, // 'phone' puede ser null
  })) as UserProfile[];
};

export const _getUserRoles = async (): Promise<UserRole[]> => {
  const { data, error } = await supabase
    .from("user_role")
    .select(`id, user_id, role, created_at`);

  if (error) {
    console.error("Error fetching user roles:", error.message);
    throw new Error(error.message);
  }
  return data as UserRole[];
};

export const getAllUsersWithRoles = async (): Promise<UserProfile[]> => {
  try {
    const [usersData, rolesData] = await Promise.all([
      _getUsers(),
      _getUserRoles(),
    ]);

    // Crear un mapa de roles por user_id para una búsqueda eficiente
    const rolesMap = new Map<string, string>();
    rolesData.forEach((roleEntry) => {
      rolesMap.set(roleEntry.user_id, roleEntry.role);
    });

    // Combinar los datos de usuarios con sus roles
    const usersWithRoles: UserProfile[] = usersData.map((user) => ({
      ...user,
      role: rolesMap.get(user.user_id) || "customer", // Asigna el rol o 'customer' por defecto
    }));

    return usersWithRoles;
  } catch (error) {
    console.error("Error in getAllUsersWithRoles (combined fetch):", error);
    return [];
  }
};

export const updateUserRole = async (
  authUserId: string,
  newRole: string
): Promise<UserRole | null> => {
  try {
    // Paso CRÍTICO: Verificar el usuario autenticado
    const {
      data: { user },
    } = await supabase.auth.getUser(); // O supabase.auth.getSession()
    console.log("Usuario autenticado al inicio de updateUserRole:", user);
    console.log("UID del usuario autenticado:", user?.id);

    const { data, error } = await supabase
      .from("user_role")
      .upsert(
        { user_id: authUserId, role: newRole }, // Datos a insertar/actualizar
        { onConflict: "user_id" } // Columna única para resolver conflictos
      )
      .select()
      .single(); // Espera una sola fila de vuelta (la insertada o actualizada)

    if (error) {
      console.error("Error upserting user role:", error.message);
      throw new Error(error.message);
    }

    return data as UserRole;
  } catch (error) {
    console.error("Error in updateUserRole:", error);
    return null;
  }
};
