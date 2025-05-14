import { FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { ProductFormValues } from "@/lib/validators";
import { useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

interface ImagePreview {
  file?: File;
  previewUrl: string;
}

interface Props {
  setValue: UseFormSetValue<ProductFormValues>;
  watch: UseFormWatch<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
}

export const UploaderImages = ({ setValue, errors, watch }: Props) => {
  const [images, setImages] = useState<ImagePreview[]>([]);
  // Verificar si hay errores con las imágenes
  const formImages = watch("image_url");

  // Cargar imágenes existentes si las hay en el formulario
  useEffect(() => {
    if (formImages) {
      const existingImages = formImages.map((img) => ({
        previewUrl: typeof img === "string" ? img : URL.createObjectURL(img),
        file: typeof img === "string" ? undefined : img,
      }));
      setImages(existingImages);
    }
  }, [formImages]);

  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.file) URL.revokeObjectURL(img.previewUrl);
      });
    };
  }, [images]);
   

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      const updatedImages = [...images, ...newImages];

      setImages(updatedImages);

      setValue(
        "image_url",
        updatedImages.map((img) => img.file || img.previewUrl)
      );
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);

    setValue(
      "image_url",
      updatedImages.map((img) => img.file || img.previewUrl)
    );
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        className="block w-full text-sm text-choco border border-cocoa/50 dark:border-cream/30 rounded-md dark:bg-fondo-dark dark:text-cream file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-choco/70 file:text-cream dark:file:bg-cream/30 dark:file:text-cream hover:file:bg-choco/80 dark:hover:file:bg-cream/50"
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 dark:bg-cream/10 dark:text-gray-100">
        {images.map((image, index) => (
          <div key={index}>
            <div className="border border-cocoa/50 w-full h-20 rounded-md p-1 relative lg:h-28 dark:border-cocoa/30 dark:bg-cream/30 dark:text-gray-100">
              <img
                src={image.previewUrl}
                alt={`Preview ${index}`}
                className="rounded-md w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="flex justify-end absolute -top-3 -right-4 hover:scale-110 transition-all z-10"
              >
                <IoIosCloseCircleOutline size={22} className="text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {errors.image_url && (
        <p className="text-red-500 text-xs mt-1">{errors.image_url.message}</p>
      )}
    </>
  );
};
