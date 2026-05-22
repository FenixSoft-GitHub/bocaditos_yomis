import { supabase } from "@/supabase/client";
import { UserProfile, UserRole } from "@/interfaces/user.interface";

export const _getUsers = async (): Promise<UserProfile[]> => {
  const { data, error } = await supabase
    .from("users")
    .select("id, full_name, email, phone, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data.map((user) => ({
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    created_at: user.created_at,
    phone: user.phone ?? null,
  })) as UserProfile[];
};

export const _getUserRoles = async (): Promise<UserRole[]> => {
  const { data, error } = await supabase
    .from("user_role")
    .select("id, user_id, role, created_at");

  if (error) throw new Error(error.message);
  return data as UserRole[];
};

export const getAllUsersWithRoles = async (): Promise<UserProfile[]> => {
  try {
    const [usersData, rolesData] = await Promise.all([
      _getUsers(),
      _getUserRoles(),
    ]);

    const rolesMap = new Map<string, string>();
    rolesData.forEach((roleEntry) => {
      rolesMap.set(roleEntry.user_id, roleEntry.role);
    });

    return usersData.map((user) => ({
      ...user,
      role: rolesMap.get(user.id) ?? "customer",
    }));
  } catch (error) {
    console.error("Error in getAllUsersWithRoles:", error);
    return [];
  }
};

export const updateUserRole = async (
  authUserId: string,
  newRole: string,
): Promise<UserRole | null> => {
  try {
    const { data, error } = await supabase
      .from("user_role")
      .upsert({ user_id: authUserId, role: newRole }, { onConflict: "user_id" })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as UserRole;
  } catch (error) {
    console.error("Error in updateUserRole:", error);
    return null;
  }
};