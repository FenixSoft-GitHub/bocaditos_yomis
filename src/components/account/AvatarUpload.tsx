// src/components/account/AvatarUpload.tsx

import { useRef, useState } from "react";
import { Camera, Loader2, Trash2, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { uploadAvatar, removeAvatar } from "@/actions/avatar";
import toast from "react-hot-toast";

interface Props {
  currentUrl?: string | null;
  initials?: string;
  onSuccess?: (newUrl: string | null) => void;
  size?: number;
  isActive?: boolean;
}

export const AvatarUpload = ({ currentUrl, initials, onSuccess, size = 14, isActive = false }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [isUploading, setIsUploading] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview inmediato
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    setIsUploading(true);
    try {
      const url = await uploadAvatar(file);
      setPreview(url);
      onSuccess?.(url);
      toast.success("Foto actualizada", { position: "bottom-right" });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Error al subir la imagen";
      toast.error(msg, { position: "bottom-right" });
      setPreview(currentUrl ?? null);
    } finally {
      setIsUploading(false);
      setShowActions(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    setIsUploading(true);
    try {
      await removeAvatar();
      setPreview(null);
      onSuccess?.(null);
      toast.success("Foto eliminada", { position: "bottom-right" });
    } catch {
      toast.error("Error al eliminar la foto", { position: "bottom-right" });
    } finally {
      setIsUploading(false);
      setShowActions(false);
    }
  };

  return (
    <div className="relative shrink-0">
      {/* Avatar */}
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={() => setShowActions((v) => !v)}
        disabled={isUploading}
        aria-label="Cambiar foto de perfil"
        // Busca esta línea en tu archivo AvatarUpload.tsx:
        className={`relative size-${size} rounded-full overflow-hidden bg-choco dark:bg-cream flex items-center justify-center shrink-0 border border-cocoa/20 dark:border-yellow-200 cursor-pointer group`}
      >
        {preview ? (
          <img
            src={preview}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-cream dark:text-oscuro font-bold text-lg select-none">
            {initials || (
              <User className="size-5 text-cream dark:text-oscuro" />
            )}
          </span>
        )}

        {/* Overlay hover */}
        {!isUploading && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
            <Camera className={`size-4 text-white ${!isActive ? 'opacity-100' : 'opacity-0'}`} />
          </div>
        )}

        {/* Spinner */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
            <Loader2 className="size-4 text-white animate-spin" />
          </div>
        )}
      </motion.button>

      {/* Input oculto */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Menú de acciones */}
      <AnimatePresence>
        {showActions && !isUploading && !isActive && (
          <>
            {/* Overlay para cerrar */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowActions(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-16 z-50 bg-cream dark:bg-oscuro border border-cocoa/20 dark:border-cream/10 rounded-xl shadow-xl overflow-hidden min-w-[160px]"
            >
              <button
                onClick={() => {
                  setShowActions(false);
                  inputRef.current?.click();
                }}
                className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-choco dark:text-cream hover:bg-cocoa/10 dark:hover:bg-cream/10 transition-colors"
              >
                <Camera className="size-4" />
                {preview ? "Cambiar foto" : "Subir foto"}
              </button>
              {preview && (
                <button
                  onClick={handleRemove}
                  className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-t border-cocoa/10 dark:border-cream/10"
                >
                  <Trash2 className="size-4" />
                  Eliminar foto
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};