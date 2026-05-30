// src/actions/avatar.ts

import { supabase } from "@/supabase/client";

export const uploadAvatar = async (file: File): Promise<string> => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("No hay sesión activa");

  // Validar tipo y tamaño
  if (!file.type.startsWith("image/"))
    throw new Error("Solo se permiten imágenes");
  if (file.size > 2 * 1024 * 1024)
    throw new Error("La imagen no puede superar 2MB");

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${user.id}/avatar.${ext}`;

  // Subir al bucket
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) throw new Error("Error al subir la imagen");

  // Obtener URL pública
  const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);

  const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`; // cache busting

  // Guardar en tabla users
  const { error: updateError } = await supabase
    .from("users")
    .update({ avatar_url: urlData.publicUrl })
    .eq("id", user.id);

  if (updateError) throw new Error("Error al guardar el avatar");

  return avatarUrl;
};

export const removeAvatar = async (): Promise<void> => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("No hay sesión activa");

  // Obtener avatar actual para saber la extensión
  const { data: userData } = await supabase
    .from("users")
    .select("avatar_url")
    .eq("id", user.id)
    .single();

  if (userData?.avatar_url) {
    const filename = userData.avatar_url.split("/").pop()?.split("?")[0];
    if (filename) {
      await supabase.storage.from("avatars").remove([`${user.id}/${filename}`]);
    }
  }

  await supabase.from("users").update({ avatar_url: null }).eq("id", user.id);
};