// src/pages/account/ProfilePage.tsx
import { useState, useEffect } from "react";
import { useUser } from "@/hooks";
import { supabase } from "@/supabase/client";
import { toast } from "react-hot-toast";
import { User, Phone, Mail, Calendar, Save, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { AvatarUpload } from "@/components/account/AvatarUpload";

const inputClass = `w-full px-4 py-2.5 rounded-lg border text-sm transition-all
  bg-fondo dark:bg-oscuro border-borde
  text-choco dark:text-cream
  placeholder:text-choco/40 dark:placeholder:text-cream/40
  focus:outline-none focus:ring-2 focus:ring-cocoa/40
  disabled:opacity-50 disabled:cursor-not-allowed`;

interface ProfileForm {
  full_name: string;
  phone: string;
  birth_date: string;
}

export default function ProfilePage() {
  const { user, userName, avatarUrl, refreshProfile } = useUser();
  const [form, setForm] = useState<ProfileForm>({
    full_name: "",
    phone: "",
    birth_date: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [original, setOriginal] = useState<ProfileForm | null>(null);

  // Cargar perfil actual
  useEffect(() => {
    if (!user?.id) return;

    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("users")
          .select("full_name, phone, birth_date")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        const profile: ProfileForm = {
          full_name: data.full_name ?? "",
          phone: data.phone ?? "",
          birth_date: data.birth_date ?? "",
        };

        setForm(profile);
        setOriginal(profile);
      } catch {
        toast.error("Error al cargar el perfil");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user?.id]);

  // Detectar cambios
  useEffect(() => {
    if (!original) return;
    setIsDirty(
      form.full_name !== original.full_name ||
        form.phone !== original.phone ||
        form.birth_date !== original.birth_date,
    );
  }, [form, original]);

  const handleChange = (field: keyof ProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user?.id || !isDirty) return;

    if (!form.full_name.trim()) {
      toast.error("El nombre es requerido");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({
          full_name: form.full_name.trim(),
          phone: form.phone.trim() || null,
          birth_date: form.birth_date || null,
        })
        .eq("id", user.id);

      if (error) throw error;

      setOriginal(form);
      setIsDirty(false);
      refreshProfile();
      toast.success("Perfil actualizado correctamente");
    } catch {
      toast.error("Error al guardar los cambios");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 rounded bg-cocoa/10 animate-pulse" />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-12 rounded-lg bg-cocoa/10 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-lg justify-center mx-auto mb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-choco dark:text-cream">
          Mi perfil
        </h1>
        <p className="text-sm text-choco/50 dark:text-cream/50 mt-1">
          Actualiza tu información personal
        </p>
      </div>

      {/* Avatar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 p-5 rounded-2xl border border-borde bg-oscuro/50"
      >
        <AvatarUpload currentUrl={avatarUrl} />
        <div>
          <p className="font-semibold text-choco dark:text-cream">
            {userName ?? form.full_name}
          </p>
          <p className="text-sm text-choco/50 dark:text-cream/50">
            {user?.email}
          </p>
        </div>
      </motion.div>

      {/* Formulario */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="space-y-4 p-5 rounded-2xl border border-borde bg-oscuro/50"
      >
        {/* Nombre */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-medium text-choco/70 dark:text-cream/70">
            <User size={14} />
            Nombre completo
          </label>
          <input
            type="text"
            value={form.full_name}
            onChange={(e) => handleChange("full_name", e.target.value)}
            placeholder="Juan Pérez"
            autoComplete="name"
            className={inputClass}
          />
        </div>

        {/* Email — solo lectura */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-medium text-choco/70 dark:text-cream/70">
            <Mail size={14} />
            Correo electrónico
          </label>
          <input
            type="email"
            value={user?.email ?? ""}
            disabled
            className={inputClass}
          />
          <p className="text-xs text-choco/40 dark:text-cream/40">
            El correo no puede modificarse
          </p>
        </div>

        {/* Teléfono */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-medium text-choco/70 dark:text-cream/70">
            <Phone size={14} />
            Teléfono
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="0414-1234567"
            autoComplete="tel"
            className={inputClass}
          />
        </div>

        {/* Fecha de cumpleaños */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-medium text-choco/70 dark:text-cream/70">
            <Calendar size={14} />
            Fecha de cumpleaños
            <span className="text-xs font-normal text-cocoa dark:text-dorado">
              🎂 Recibe un cupón especial
            </span>
          </label>
          <input
            type="date"
            value={form.birth_date}
            onChange={(e) => handleChange("birth_date", e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className={inputClass}
          />
          <p className="text-xs text-choco/40 dark:text-cream/40">
            El año no se usa — solo el día y mes para enviarte tu regalo
          </p>
        </div>

        {/* Botón guardar */}
        <button
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
            bg-cocoa text-white font-semibold text-sm
            hover:bg-cocoa/90 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Guardando...
            </>
          ) : (
            <>
              <Save size={16} /> Guardar cambios
            </>
          )}
        </button>
      </motion.div>

      {/* Info cupón cumpleaños */}
      {!form.birth_date && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-start gap-3 p-4 rounded-xl
            bg-amber-500/10 border border-amber-500/30"
        >
          <span className="text-2xl">🎂</span>
          <div>
            <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
              ¡Agrega tu fecha de cumpleaños!
            </p>
            <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-0.5">
              Recibirás un cupón de 15% de descuento automáticamente el día de
              tu cumpleaños cada año.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
