export interface UserProfile {
  id: string; // ID de la tabla 'users'
  full_name: string; //
  email: string; //
  user_id: string; // ID de auth.users (relacion con Supabase Auth)
  created_at: string; //
  phone?: string | null; // Campo opcional, puede ser null
  role?: string; // Agregaremos este campo al combinar con user_role
}

export interface UserRole {
  id: number; // ID de la tabla 'user_role'
  user_id: string; // ID de auth.users
  role: string; // Ej: 'customer', 'admin'
  created_at: string; //
}
