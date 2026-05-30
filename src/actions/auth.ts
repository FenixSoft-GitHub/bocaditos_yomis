// src/actions/auth.ts
// Cambio: agregar avatar_url al select de getUserProfile

import { supabase } from "@/supabase/client";

interface IAuthLogin {
  email: string;
  password: string;
}

interface IAuthRegister {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  refCode?: string;
}

export const signUp = async ({
  email,
  password,
  fullName,
  phone,
}: IAuthRegister) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, phone } },
  });

  if (error) throw new Error(error.message);

  const userId = data.user?.id;
  if (!userId) throw new Error("Error al obtener el id del usuario");

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (signInError) throw new Error("Email o contraseña incorrectos");

  const { error: roleError } = await supabase
    .from("user_role")
    .insert({ user_id: userId, role: "customer" });
  if (roleError) throw new Error("Error al registrar el rol del usuario");

  if (phone) {
    await supabase.from("users").update({ phone }).eq("id", userId);
  }

  return data;
};

export const signIn = async ({ email, password }: IAuthLogin) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error("Email o contraseña incorrectos");
  return { data };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error("Error al cerrar sesión");
};

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error("Error al obtener la sesión");
  return data;
};

export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("full_name, email, phone, avatar_url") // ← avatar_url agregado
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    return null;
  }
};

export const getUserRole = async (userId: string) => {
  const { data, error } = await supabase
    .from("user_role")
    .select("role")
    .eq("user_id", userId)
    .single();

  if (error) throw new Error("Error al obtener el rol del usuario");
  return data.role;
};