import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-hot-toast";
// import { supabase } from "@/supabase/client"; // Ya no necesitas supabase aquí

import {
  BlogPost,
  CreateBlogPost,
  UpdateBlogPost,
  FormDataCreate,
  FormDataUpdate,
} from "@/interfaces";
import { useBlogPosts } from "@/hooks";

interface DashboardOutletContext {
  currentAuthUserId: string;
}

interface BlogPostFormProps {
  initialData?: BlogPost;
  isEditing?: boolean;
}

const BlogPostForm: React.FC<BlogPostFormProps> = ({
  initialData,
  isEditing = false,
}) => {
  const navigate = useNavigate();
  const { currentAuthUserId } = useOutletContext<DashboardOutletContext>();
  // `imageFile` es ahora el objeto File que se pasará a la acción.
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const { createPost, isCreatingPost, updatePost, isUpdatingPost } =
    useBlogPosts();

  type FormData = typeof isEditing extends true
    ? FormDataUpdate
    : FormDataCreate;

  const defaultValues = React.useMemo(() => {
    if (isEditing && initialData) {
      return {
        ...initialData,
        published_at: initialData.published_at
          ? new Date(initialData.published_at).toISOString().slice(0, 16)
          : "",
        display_author_name: initialData.display_author_name || "",
      };
    } else {
      return {
        title: "",
        slug: "",
        content_markdown: "",
        status: "draft",
        published_at: "",
        display_author_name: "",
        excerpt: null,
      };
    }
  }, [isEditing, initialData]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    // setError,
    // clearErrors,
  } = useForm<FormData>({
    defaultValues: defaultValues,
  });

  const titleValue = watch("title");

  useEffect(() => {
    if (isEditing && initialData?.image_url) {
      setPreviewUrl(initialData.image_url);
    }
  }, [isEditing, initialData]);

  useEffect(() => {
    if (!isEditing && titleValue) {
      const generatedSlug = titleValue
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .trim();
      setValue("slug", generatedSlug);
    }
  }, [titleValue, setValue, isEditing]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setImageError(null); // Limpia el error de imagen cuando se selecciona una
    } else {
      setImageFile(null);
      setPreviewUrl(null);
      // Si se requiere imagen y se elimina, se establece el error
      if (!isEditing) {
        setImageError("La imagen destacada es requerida.");
      } else if (isEditing && initialData?.image_url && !file) {
        // En edición, si había una imagen y se elimina, y no se sube una nueva,
        // podrías querer que la imagen se ponga a null en la DB.
        // O si tu UI exige que siempre haya una imagen, puedes forzar un error.
        // Por ahora, asumimos que eliminarla significa ponerla a null en la DB.
        setImageError("Se requiere una imagen para la publicación."); // Asumiendo que siempre es requerida
      }
    }
  };

  const onSubmit = async (data: FormData) => {
    // clearErrors(); // Ya no llamamos a esto globalmente si el error de imagen es independiente

    // --- NUEVA VALIDACIÓN GLOBAL DE `isValid` ---
    let isValid = true;
    // Si hay un error de React Hook Form, o un error de imagen, el formulario no es válido
    if (Object.keys(errors).length > 0) {
      isValid = false;
    }
    if (imageError) {
      isValid = false;
    }
    // ----------------------------------------------

    if (!currentAuthUserId) {
      toast.error(
        "No se pudo obtener el ID del usuario autenticado. Por favor, intente de nuevo."
      );
      return;
    }

    let dataToApi: CreateBlogPost | UpdateBlogPost;

    // --- VALIDACIÓN DE IMAGEN ANTES DE CONTINUAR ---
    if (isEditing) {
      // En edición, si NO hay imagen existente y NO se sube una nueva, establecer error
      if (!initialData?.image_url && !imageFile) {
        setImageError("Se requiere una imagen para la publicación.");
        isValid = false;
      }
    } else {
      // Creación
      // En creación, la imagen SIEMPRE es requerida
      if (!imageFile) {
        setImageError("La imagen destacada es requerida.");
        isValid = false;
      }
    }

    if (!isValid) return; // Si alguna validación falló (RHF o imagen), salir

    if (isEditing) {
      dataToApi = {
        ...data,
        image_file: imageFile || undefined, // Pasa el archivo si se seleccionó uno nuevo
        // Lógica para `image_url`:
        // Si `imageFile` existe (se seleccionó uno nuevo), `image_url` será `undefined` para la acción.
        // Si `imageFile` NO existe:
        //    Si `previewUrl` es `null` (lo que significa que la imagen original se eliminó del input), `image_url` será `null`.
        //    De lo contrario (se mantuvo la imagen original), `image_url` será `initialData?.image_url`.
        image_url: imageFile
          ? undefined
          : previewUrl === null
          ? null
          : initialData?.image_url || null,
      } as UpdateBlogPost;

      // Asegurar que los campos opcionales que se envían vacíos sean `undefined` o `null`
      if (dataToApi.title?.trim() === "") dataToApi.title = undefined;
      if (dataToApi.slug?.trim() === "") dataToApi.slug = undefined;
      if (dataToApi.content_markdown?.trim() === "")
        dataToApi.content_markdown = undefined;
      if (dataToApi.display_author_name?.trim() === "")
        dataToApi.display_author_name = "";
      if (dataToApi.excerpt?.trim() === "") dataToApi.excerpt = null;
      if (dataToApi.published_at?.trim() === "") dataToApi.published_at = null;
    } else {
      // Caso de Creación
      dataToApi = {
        ...data,
        author_id: currentAuthUserId,
        image_file: imageFile!, // ¡Aquí usamos el objeto File del estado!
      } as CreateBlogPost;

      // Asegurar que los campos opcionales que se envían vacíos sean `null`
      if (dataToApi.display_author_name?.trim() === "")
        dataToApi.display_author_name = "";
      if (dataToApi.excerpt?.trim() === "") dataToApi.excerpt = null;
      if (dataToApi.published_at?.trim() === "") dataToApi.published_at = null;
    }

    // Convertir `published_at` a formato ISO si es necesario (ya se hizo en la acción)
    if (
      dataToApi.published_at &&
      typeof dataToApi.published_at === "string" &&
      dataToApi.published_at !== ""
    ) {
      dataToApi.published_at = new Date(dataToApi.published_at).toISOString();
    } else {
      dataToApi.published_at = null;
    }

    try {
      if (isEditing && initialData?.id) {
        await updatePost({
          id: initialData.id,
          data: dataToApi as UpdateBlogPost,
        });
        toast.success("Publicación actualizada con éxito!");
      } else {
        await createPost(dataToApi as CreateBlogPost);
        toast.success("Publicación creada con éxito!");
        reset(); // Esto limpia los campos del formulario registrados
        setImageFile(null); // Limpiar el estado de la imagen manualmente
        setPreviewUrl(null); // Limpiar la vista previa manualmente
        setImageError(null); // Limpiar el error de imagen
      }
      navigate("/dashboard/blog");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error al guardar la publicación:", error.message);
      } else {
        console.error("Error al guardar la publicación:", error);
      }
      toast.error("Error al guardar la publicación. Intente de nuevo.");
    }
  };
  return (
    <div className="p-4 text-choco dark:text-cream bg-fondo dark:bg-fondo-dark">
      <h2 className="text-2xl font-bold mb-4">
        {isEditing ? "Editar Publicación" : "Crear Nueva Publicación"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Campo Título */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium">
            Título
          </label>
          <input
            type="text"
            id="title"
            {...register("title", {
              required:
                !isEditing || (isEditing && watch("title")?.trim() !== "")
                  ? "El título es requerido."
                  : false,
              minLength: {
                value: 3,
                message: "El título debe tener al menos 3 caracteres.",
              },
            })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            aria-invalid={errors.title ? "true" : "false"}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Campo Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium">
            Slug
          </label>
          <input
            type="text"
            id="slug"
            {...register("slug", {
              required:
                !isEditing || (isEditing && watch("slug")?.trim() !== "")
                  ? "El slug es requerido."
                  : false,
            })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            aria-invalid={errors.slug ? "true" : "false"}
          />
          {errors.slug && (
            <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
          )}
        </div>

        {/* Campo Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium">
            Extracto
          </label>
          <textarea
            id="excerpt"
            {...register("excerpt", {
              required:
                !isEditing || (isEditing && watch("excerpt")?.trim() !== "")
                  ? "El contenido es requerido."
                  : false,
              minLength: {
                value: 10,
                message: "El extracto debe tener al menos 10 caracteres.",
              },
            })}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            aria-invalid={errors.excerpt ? "true" : "false"}
          ></textarea>
          {errors.excerpt && (
            <p className="text-red-500 text-sm mt-1">
              {errors.excerpt.message}
            </p>
          )}
        </div>

        {/* Campo Contenido (Markdown) */}
        <div>
          <label
            htmlFor="content_markdown"
            className="block text-sm font-medium"
          >
            Contenido (Markdown)
          </label>
          <textarea
            id="content_markdown"
            {...register("content_markdown", {
              required:
                !isEditing ||
                (isEditing && watch("content_markdown")?.trim() !== "")
                  ? "El contenido es requerido."
                  : false,
              minLength: {
                value: 20,
                message: "El contenido debe tener al menos 20 caracteres.",
              },
            })}
            rows={15}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            aria-invalid={errors.content_markdown ? "true" : "false"}
          ></textarea>
          {errors.content_markdown && (
            <p className="text-red-500 text-sm mt-1">
              {errors.content_markdown.message}
            </p>
          )}
        </div>

        {/* Campo Imagen destacada */}
        <div>
          <label className="block text-sm font-medium">Imagen destacada</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-choco border border-cocoa/50 dark:border-cream/30 rounded-md dark:bg-fondo-dark dark:text-cream file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-choco/70 file:text-cream dark:file:bg-cream/30 dark:file:text-cream hover:file:bg-choco/80 dark:hover:file:bg-cream/50 cursor-pointer"
            // No usamos register directamente para el input de archivo si manejamos el estado con useState
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Vista previa"
              className="mt-2 max-h-40 rounded"
            />
          )}
          {imageError && (
            <p className="text-red-500 text-sm mt-1">{imageError}</p>
          )}
        </div>

        <div className="flex  justify-between gap-6">
          {/* Campo Estado */}
          <div className="flex-1">
            <label htmlFor="status" className="block text-sm font-medium">
              Estado
            </label>
            <select
              id="status"
              {...register("status", { required: "El estado es requerido." })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              aria-invalid={errors.status ? "true" : "false"}
            >
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
              <option value="archived">Archivado</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">
                {errors.status.message}
              </p>
            )}
          </div>

          {/* Campo Fecha de Publicación */}
          <div className="flex-1">
            <label htmlFor="published_at" className="block text-sm font-medium">
              Fecha de Publicación (Opcional)
            </label>
            <input
              type="datetime-local"
              id="published_at"
              {...register("published_at")}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              aria-invalid={errors.published_at ? "true" : "false"}
            />
            {errors.published_at && (
              <p className="text-red-500 text-sm mt-1">
                {errors.published_at.message}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Si dejas este campo vacío, la publicación no se programará.
            </p>
          </div>

          {/* Campo Autor a Mostrar */}
          <div className="flex-1">
            <label
              htmlFor="display_author_name"
              className="block text-sm font-medium"
            >
              Autor a Mostrar (Opcional)
            </label>
            <input
              type="text"
              id="display_author_name"
              {...register("display_author_name")}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Bocaditos Yomis (si es diferente al autor real)"
              aria-invalid={errors.display_author_name ? "true" : "false"}
            />
            {errors.display_author_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.display_author_name.message}
              </p>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <button
          type="submit"
          disabled={isCreatingPost || isUpdatingPost}
          className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 disabled:opacity-50 transition-colors duration-200"
        >
          {isEditing
            ? isUpdatingPost
              ? "Actualizando..."
              : "Actualizar Publicación"
            : isCreatingPost
            ? "Creando..."
            : "Crear Publicación"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/dashboard/blog")}
          className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors duration-200"
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default BlogPostForm;

// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { useNavigate, useOutletContext } from "react-router-dom";
// import { toast } from "react-hot-toast"; // Para las notificaciones

// import {
//   BlogPost, // Para initialData
//   CreateBlogPost, // Para la acción createPost (lo que espera Supabase)
//   UpdateBlogPost, // Para la acción updatePost (lo que espera Supabase)
//   FormDataCreate, // Tipo de datos para el formulario de creación
//   FormDataUpdate, // Tipo de datos para el formulario de actualización
// } from "@/interfaces";
// import { useBlogPosts } from "@/hooks";

// interface DashboardOutletContext {
//   currentAuthUserId: string;
// }

// interface BlogPostFormProps {
//   initialData?: BlogPost; // BlogPost es el tipo de dato que viene de la DB
//   isEditing?: boolean;
// }

// const BlogPostForm: React.FC<BlogPostFormProps> = ({
//   initialData,
//   isEditing = false,
// }) => {
//   const navigate = useNavigate();
//   const { currentAuthUserId } = useOutletContext<DashboardOutletContext>();
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const { createPost, isCreatingPost, updatePost, isUpdatingPost } =
//     useBlogPosts();

//   // Define el tipo de datos del formulario basado en las nuevas interfaces
//   type FormData = typeof isEditing extends true
//     ? FormDataUpdate
//     : FormDataCreate;

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     setValue,
//     watch,
//     setError, // Para establecer errores manualmente
//     clearErrors, // Para limpiar errores manualmente
//   } = useForm<FormData>({
//     defaultValues: initialData
//       ? ({
//           ...initialData,
//           // Formatear published_at para el input datetime-local
//           published_at: initialData.published_at
//             ? new Date(initialData.published_at).toISOString().slice(0, 16)
//             : "",
//           // Asegura que image_url y display_author sean strings (inputs HTML)
//           image_url: initialData.image_url || "",
//           display_author: initialData.display_author_name || "",
//         } as FormData) // Casteamos para asegurar compatibilidad
//       : ({
//           title: "",
//           slug: "",
//           content_markdown: "",
//           image_url: "",
//           status: "draft", // Valor por defecto para el formulario
//           published_at: "",
//           display_author_name: "",
//         } as FormData), // Casteamos para asegurar compatibilidad
//   });

//   const titleValue = watch("title");

//   // Efecto para generar automáticamente el slug a partir del título al crear un nuevo post
//   useEffect(() => {
//     if (!isEditing && titleValue) {
//       const generatedSlug = titleValue
//         .toLowerCase()
//         .normalize("NFD")
//         .replace(/[\u0300-\u036f]/g, "")
//         .replace(/[^\w\s-]/g, "")
//         .replace(/\s+/g, "-")
//         .trim();
//       setValue("slug", generatedSlug);
//     }
//   }, [titleValue, setValue, isEditing]);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImageFile(file);
//       setPreviewUrl(URL.createObjectURL(file));
//     }
//   };

//   const onSubmit = async (data: FormData) => {
//     // Limpiar errores previos al intentar un nuevo envío
//     clearErrors();

//     if (!currentAuthUserId) {
//       toast.error(
//         "No se pudo obtener el ID del usuario autenticado. Por favor, intente de nuevo."
//       );
//       return;
//     }

//     let dataToApi: CreateBlogPost | UpdateBlogPost;
//     let isValid = true; // Bandera para la validación manual

//     if (isEditing) {
//       // --- VALIDACIÓN MANUAL PARA EDICIÓN ---
//       // Si un campo es opcional en el formulario pero no en la DB si existe,
//       // y quieres que sea validado si se proporciona, lo haces aquí.
//       // Por ejemplo, si image_url se proporciona, debe ser una URL válida.
//       if (
//         data.image_url &&
//         data.image_url.trim() !== "" &&
//         !/^https?:\/\/.+\..+/.test(data.image_url)
//       ) {
//         setError("image_url", {
//           type: "manual",
//           message: "La URL de la imagen no es válida.",
//         });
//         isValid = false;
//       }
//       // No validamos requeridos aquí porque son opcionales en UpdateBlogPost

//       if (!isValid) return; // Detener si hay errores de validación manual

//       // Preparar los datos para la actualización
//       dataToApi = {
//         title: data.title?.trim() === "" ? undefined : data.title, // Convierte '' a undefined si es opcional
//         slug: data.slug?.trim() === "" ? undefined : data.slug,
//         content_markdown:
//           data.content_markdown?.trim() === ""
//             ? undefined
//             : data.content_markdown,
//         author_id: currentAuthUserId, // Se mantiene para actualizar por si cambia el autor (aunque poco común)
//         image_url: data.image_url?.trim() === "" ? null : data.image_url, // Convierte '' a null para DB
//         status: data.status,
//         published_at:
//           data.published_at?.trim() === "" ? null : data.published_at, // Convierte '' a null para DB
//         display_author:
//           data.display_author_name?.trim() === "" ? null : data.display_author_name, // Convierte '' a null para DB
//       } as UpdateBlogPost; // Castear al tipo que espera Supabase
//     } else {
//       // --- VALIDACIÓN MANUAL PARA CREACIÓN ---
//       if (!data.title || data.title.trim() === "") {
//         setError("title", {
//           type: "manual",
//           message: "El título es requerido.",
//         });
//         isValid = false;
//       }
//       if (!data.slug || data.slug.trim() === "") {
//         setError("slug", { type: "manual", message: "El slug es requerido." });
//         isValid = false;
//       }
//       if (!data.content_markdown || data.content_markdown.trim() === "") {
//         setError("content_markdown", {
//           type: "manual",
//           message: "El contenido es requerido.",
//         });
//         isValid = false;
//       }
//       if (
//         data.image_url &&
//         data.image_url.trim() !== "" &&
//         !/^https?:\/\/.+\..+/.test(data.image_url)
//       ) {
//         setError("image_url", {
//           type: "manual",
//           message: "La URL de la imagen no es válida.",
//         });
//         isValid = false;
//       }
//       // Status ya tiene un default en el formulario, no necesita validación de existencia aquí.

//       if (!isValid) return; // Detener si hay errores de validación manual

//       // Preparar los datos para la creación
//       dataToApi = {
//         title: data.title.trim(),
//         slug: data.slug.trim(),
//         content_markdown: data.content_markdown.trim(),
//         author_id: currentAuthUserId, // Requerido y siempre asignado
//         image_url: data.image_url.trim() === "" ? null : data.image_url, // Convierte '' a null para DB
//         status: data.status,
//         published_at:
//           data.published_at.trim() === "" ? null : data.published_at, // Convierte '' a null para DB
//         display_author_name:
//           data.display_author_name.trim() === "" ? null : data.display_author_name, // Convierte '' a null para DB
//       } as CreateBlogPost; // Castear al tipo que espera Supabase
//     }

//     // Convertir `published_at` a un formato ISO para la base de datos si está presente
//     if (
//       dataToApi.published_at &&
//       typeof dataToApi.published_at === "string" &&
//       dataToApi.published_at !== ""
//     ) {
//       dataToApi.published_at = new Date(dataToApi.published_at).toISOString();
//     } else {
//       dataToApi.published_at = null; // Asegurar que sea null si está vacío o no es un string
//     }

//     try {
//       if (isEditing && initialData?.id) {
//         await updatePost({
//           id: initialData.id,
//           data: dataToApi as UpdateBlogPost,
//         });
//         toast.success("Publicación actualizada con éxito!");
//       } else {
//         await createPost(dataToApi as CreateBlogPost);
//         toast.success("Publicación creada con éxito!");
//         reset(); // Limpia el formulario solo después de crear
//       }
//       navigate("/dashboard/blog");
//     } catch (error: unknown) {
//       // Los errores de la API ya deberían manejarse en useBlogPosts con toasts.
//       // Aquí solo logueamos para depuración.
//       if (error instanceof Error) {
//         console.error("Error al guardar la publicación:", error.message);
//       } else {
//         console.error("Error al guardar la publicación:", error);
//       }
//       toast.error("Error al guardar la publicación. Intente de nuevo.");
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-4">
//         {isEditing ? "Editar Publicación" : "Crear Nueva Publicación"}
//       </h2>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         {/* Campo Título */}
//         <div>
//           <label
//             htmlFor="title"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Título
//           </label>
//           <input
//             type="text"
//             id="title"
//             {...register("title")}
//             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
//             aria-invalid={errors.title ? "true" : "false"}
//           />
//           {errors.title && (
//             <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
//           )}
//         </div>

//         {/* Campo Slug */}
//         <div>
//           <label
//             htmlFor="slug"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Slug
//           </label>
//           <input
//             type="text"
//             id="slug"
//             {...register("slug")}
//             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
//             aria-invalid={errors.slug ? "true" : "false"}
//           />
//           {errors.slug && (
//             <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
//           )}
//         </div>

//         {/* Campo Contenido (Markdown) */}
//         <div>
//           <label
//             htmlFor="content_markdown"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Contenido (Markdown)
//           </label>
//           <textarea
//             id="content_markdown"
//             {...register("content_markdown")}
//             rows={15}
//             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
//             aria-invalid={errors.content_markdown ? "true" : "false"}
//           ></textarea>
//           {errors.content_markdown && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.content_markdown.message}
//             </p>
//           )}
//         </div>

//         {/* Campo URL de la Imagen */}
//         <div>
//           <label className="block text-sm font-medium">Imagen destacada</label>
//           <input type="file" accept="image/*" onChange={handleImageChange} />
//           {previewUrl && (
//             <img
//               src={previewUrl}
//               alt="Vista previa"
//               className="mt-2 max-h-40 rounded"
//             />
//           )}
//         </div>
//         {/* <div>
//           <label
//             htmlFor="image_url"
//             className="block text-sm font-medium text-gray-700"
//           >
//             URL de la Imagen (Opcional)
//           </label>
//           <input
//             type="text"
//             id="image_url"
//             {...register("image_url")}
//             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
//             aria-invalid={errors.image_url ? "true" : "false"}
//           />
//           {errors.image_url && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.image_url.message}
//             </p>
//           )}
//         </div> */}

//         {/* Campo Estado */}
//         <div>
//           <label
//             htmlFor="status"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Estado
//           </label>
//           <select
//             id="status"
//             {...register("status")}
//             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
//             aria-invalid={errors.status ? "true" : "false"}
//           >
//             <option value="draft">Borrador</option>
//             <option value="published">Publicado</option>
//             <option value="archived">Archivado</option>
//           </select>
//           {errors.status && (
//             <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
//           )}
//         </div>

//         {/* Campo Fecha de Publicación */}
//         <div>
//           <label
//             htmlFor="published_at"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Fecha de Publicación (Opcional)
//           </label>
//           <input
//             type="datetime-local"
//             id="published_at"
//             {...register("published_at")}
//             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
//             aria-invalid={errors.published_at ? "true" : "false"}
//           />
//           {errors.published_at && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.published_at.message}
//             </p>
//           )}
//           <p className="text-sm text-gray-500 mt-1">
//             Si dejas este campo vacío, la publicación no se programará.
//           </p>
//         </div>

//         {/* Campo Autor a Mostrar */}
//         <div>
//           <label
//             htmlFor="display_author"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Autor a Mostrar (Opcional)
//           </label>
//           <input
//             type="text"
//             id="display_author"
//             {...register("display_author_name")}
//             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
//             placeholder="Ej: Bocaditos Yomis (si es diferente al autor real)"
//             aria-invalid={errors.display_author_name ? "true" : "false"}
//           />
//           {errors.display_author_name && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.display_author_name.message}
//             </p>
//           )}
//         </div>

//         {/* Botones de acción */}
//         <button
//           type="submit"
//           disabled={isCreatingPost || isUpdatingPost}
//           className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 transition-colors duration-200"
//         >
//           {isEditing
//             ? isUpdatingPost
//               ? "Actualizando..."
//               : "Actualizar Publicación"
//             : isCreatingPost
//             ? "Creando..."
//             : "Crear Publicación"}
//         </button>
//         <button
//           type="button"
//           onClick={() => navigate("/dashboard/blog")}
//           className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors duration-200"
//         >
//           Cancelar
//         </button>
//       </form>
//     </div>
//   );
// };

// export default BlogPostForm;
