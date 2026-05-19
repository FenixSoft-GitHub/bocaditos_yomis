import { FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { ProductFormValues } from "@/lib/validators";
import { useEffect, useState } from "react";
import { XCircle } from "lucide-react";
import toast from "react-hot-toast";

interface ImagePreview {
  file?: File;
  previewUrl: string;
  isExisting?: boolean; // Para distinguir imágenes existentes de nuevas
}

interface Props {
  setValue: UseFormSetValue<ProductFormValues>;
  watch: UseFormWatch<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  disabled: boolean;
}

const MAX_IMAGES = 8; // Límite máximo de imágenes por producto

const validateImageFile = (
  file: File,
): { isValid: boolean; error?: string } => {
  // 1. Validar tipo de archivo (solo imágenes)
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Formato no soportado: ${file.type}. Usa JPG, PNG, WEBP o AVIF`,
    };
  }

  // 2. Validar tamaño máximo (2MB)
  const maxSize = 2 * 1024 * 1024; // 2MB en bytes
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `La imagen "${file.name}" pesa ${(file.size / 1024 / 1024).toFixed(2)}MB. El máximo es 2MB`,
    };
  }

  // 3. Validar nombre del archivo (sin caracteres peligrosos)
  const dangerousPattern = /[<>:"|?*\\/]/g;
  if (dangerousPattern.test(file.name)) {
    return {
      isValid: false,
      error: `El nombre del archivo contiene caracteres no permitidos: < > : " | ? * \\ /`,
    };
  }

  return { isValid: true };
};

export const UploaderImages = ({
  setValue,
  errors,
  watch,
  disabled,
}: Props) => {
  const [images, setImages] = useState<ImagePreview[]>([]);
  // Verificar si hay errores con las imágenes
  const formImages = watch("image_url");

  // Cargar imágenes existentes si las hay en el formulario
  useEffect(() => {
    if (formImages && formImages.length > 0) {
      const existingImages = formImages.map((img) => ({
        previewUrl: typeof img === "string" ? img : URL.createObjectURL(img),
        file: typeof img === "string" ? undefined : img,
        isExisting: typeof img === "string", // Marcar como existente si es una URL
      }));
      setImages(existingImages);
    } else if (formImages?.length === 0) {
      setImages([]);
    }
  }, [formImages]);

  // Limpiar URLs de objetos al desmontar
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.file && img.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(img.previewUrl);
        }
      });
    };
  }, [images]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);

    // Validar límite de imágenes
    const currentImageCount = images.length;
    if (currentImageCount + files.length > MAX_IMAGES) {
      toast.error(
        `Máximo ${MAX_IMAGES} imágenes por producto. Actualmente tienes ${currentImageCount}.`,
      );
      e.target.value = ""; // Limpiar el input
      return;
    }

    // Validar cada archivo antes de procesarlo
    const validFiles: File[] = [];
    for (const file of files) {
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        // ✅ CORREGIDO: Solo mostrar error si existe mensaje de error
        if (validation.error) {
          toast.error(validation.error);
        }
        // No retornamos inmediatamente para mostrar todos los errores
      } else {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) {
      e.target.value = ""; // Limpiar el input
      return;
    }

    // Procesar solo los archivos válidos
    const newImages = validFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      isExisting: false,
    }));

    const updatedImages = [...images, ...newImages];

    setImages(updatedImages);

    // Actualizar el formulario con las URLs y archivos
    setValue(
      "image_url",
      updatedImages.map((img) => {
        if (img.file) {
          return img.file; // Para imágenes nuevas, guardamos el File
        }
        return img.previewUrl; // Para imágenes existentes, guardamos la URL
      }),
    );

    // Limpiar el input para permitir seleccionar los mismos archivos nuevamente
    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    const imageToRemove = images[index];

    // Limpiar URL de objeto si es una imagen nueva (blob)
    if (imageToRemove.file && imageToRemove.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(imageToRemove.previewUrl);
    }

    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);

    setValue(
      "image_url",
      updatedImages.map((img) => {
        if (img.file) {
          return img.file;
        }
        return img.previewUrl;
      }),
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        onChange={handleImageChange}
        disabled={disabled}
        className="block w-full text-sm text-choco border border-cocoa/50 dark:border-cream/30 rounded-md dark:bg-fondo-dark dark:text-cream file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-choco/70 file:text-cream dark:file:bg-cream/30 dark:file:text-cream hover:file:bg-choco/80 dark:hover:file:bg-cream/50 disabled:opacity-50 disabled:cursor-not-allowed"
      />

      <p className="text-xs text-choco/50 dark:text-cream/50">
        Formatos permitidos: JPG, PNG, WEBP, AVIF. Máximo 2MB por imagen.
        Límite: {MAX_IMAGES} imágenes.
      </p>

      {images.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="border border-cocoa/50 rounded-md p-1 w-full h-20 lg:h-28 dark:border-cocoa/30 dark:bg-cream/10 bg-cream/50">
                <img
                  src={image.previewUrl}
                  alt={`Vista previa ${index + 1}`}
                  className="rounded-md w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-0.5 hover:scale-110 transition-all duration-200 shadow-md hover:bg-red-600"
                aria-label="Eliminar imagen"
              >
                <XCircle size={18} className="text-white" />
              </button>
              {image.isExisting && (
                <span className="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white px-1 rounded">
                  Existente
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {errors.image_url && (
        <p className="text-red-500 text-xs mt-1">{errors.image_url.message}</p>
      )}
    </div>
  );
};