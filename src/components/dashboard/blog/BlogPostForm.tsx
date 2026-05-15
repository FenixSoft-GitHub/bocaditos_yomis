import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  BlogPost,
  CreateBlogPost,
  UpdateBlogPost,
  FormDataCreate,
  FormDataUpdate,
} from "@/interfaces";
import { useBlogPosts } from "@/hooks";
import { useUser } from "@/hooks";
import {
  Save,
  X,
  Image as ImageIcon,
  Type,
  AlignLeft,
  FileText,
  Calendar,
  User,
  Tag,
  Eye,
  EyeOff,
  ChevronLeft,
} from "lucide-react";

interface BlogPostFormProps {
  initialData?: BlogPost;
  isEditing?: boolean;
}

const inputClass = `w-full px-4 py-2.5 text-sm rounded-lg border transition-all duration-200
  bg-fondo dark:bg-fondo-dark text-choco dark:text-cream
  placeholder:text-choco/40 dark:placeholder:text-cream/40
  border-cocoa/30 dark:border-cream/20
  focus:outline-none focus:ring-2 focus:ring-choco/20 dark:focus:ring-cream/20
  focus:border-choco dark:focus:border-cream/60
  disabled:opacity-50 disabled:cursor-not-allowed`;

const labelClass =
  "block text-xs font-semibold uppercase tracking-wider text-choco/60 dark:text-cream/60 mb-1.5";

const errorClass = "text-xs text-red-500 dark:text-red-400 mt-1 pl-1";

const statusConfig = [
  { value: "draft", label: "Borrador", icon: EyeOff },
  { value: "published", label: "Publicado", icon: Eye },
  { value: "archived", label: "Archivado", icon: Tag },
];

const BlogPostForm: React.FC<BlogPostFormProps> = ({
  initialData,
  isEditing = false,
}) => {
  const navigate = useNavigate();
  const { session } = useUser();
  const currentAuthUserId = session?.user?.id ?? "";

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
    }
    return {
      title: "",
      slug: "",
      content_markdown: "",
      status: "draft",
      published_at: "",
      display_author_name: "",
      excerpt: null,
    };
  }, [isEditing, initialData]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({ defaultValues });

  const titleValue = watch("title");
  const statusValue = watch("status");

  useEffect(() => {
    if (isEditing && initialData?.image_url)
      setPreviewUrl(initialData.image_url);
  }, [isEditing, initialData]);

  useEffect(() => {
    if (!isEditing && titleValue) {
      const slug = titleValue
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .trim();
      setValue("slug", slug);
    }
  }, [titleValue, setValue, isEditing]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setImageError(null);
    } else {
      setImageFile(null);
      setPreviewUrl(null);
      if (!isEditing) setImageError("La imagen destacada es requerida.");
    }
  };

  const onSubmit = async (data: FormData) => {
    let isValid = true;
    if (Object.keys(errors).length > 0) isValid = false;
    if (imageError) isValid = false;

    if (isEditing) {
      if (!initialData?.image_url && !imageFile) {
        setImageError("Se requiere una imagen.");
        isValid = false;
      }
    } else {
      if (!imageFile) {
        setImageError("La imagen destacada es requerida.");
        isValid = false;
      }
    }

    if (!isValid) return;

    let dataToApi: CreateBlogPost | UpdateBlogPost;

    if (isEditing) {
      dataToApi = {
        ...data,
        image_file: imageFile || undefined,
        image_url: imageFile
          ? undefined
          : previewUrl === null
            ? null
            : initialData?.image_url || null,
      } as UpdateBlogPost;
      if (dataToApi.title?.trim() === "") dataToApi.title = undefined;
      if (dataToApi.slug?.trim() === "") dataToApi.slug = undefined;
      if (dataToApi.content_markdown?.trim() === "")
        dataToApi.content_markdown = undefined;
      if (dataToApi.excerpt?.trim() === "") dataToApi.excerpt = null;
      if (dataToApi.published_at?.trim() === "") dataToApi.published_at = null;
    } else {
      dataToApi = {
        ...data,
        author_id: currentAuthUserId,
        image_file: imageFile!,
      } as CreateBlogPost;
      if (dataToApi.display_author_name?.trim() === "")
        dataToApi.display_author_name = "";
      if (dataToApi.excerpt?.trim() === "") dataToApi.excerpt = null;
      if (dataToApi.published_at?.trim() === "") dataToApi.published_at = null;
    }

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
        toast.success("¡Publicación actualizada con éxito!");
      } else {
        await createPost(dataToApi as CreateBlogPost);
        toast.success("¡Publicación creada con éxito!");
        reset();
        setImageFile(null);
        setPreviewUrl(null);
        setImageError(null);
      }
      navigate("/dashboard/blog");
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error("Error al guardar la publicación.");
    }
  };

  const isBusy = isCreatingPost || isUpdatingPost;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 text-choco dark:text-cream">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard/blog")}
            className="p-2 rounded-lg bg-cocoa/10 dark:bg-cream/10 hover:bg-cocoa/20 dark:hover:bg-cream/20 transition-colors"
            aria-label="Volver"
          >
            <ChevronLeft className="size-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">
              {isEditing ? "Editar Publicación" : "Nueva Publicación"}
            </h1>
            <p className="text-xs text-choco/50 dark:text-cream/50 mt-0.5">
              {isEditing
                ? "Modifica los datos de tu publicación"
                : "Completa los datos para crear una nueva publicación"}
            </p>
          </div>
        </div>

        {/* Status selector visual */}
        <div className="hidden sm:flex items-center gap-2 bg-cocoa/10 dark:bg-cream/10 rounded-xl p-1">
          {statusConfig.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setValue("status", value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                statusValue === value
                  ? "bg-choco text-cream dark:bg-cream dark:text-oscuro shadow-sm"
                  : "text-choco/60 dark:text-cream/60 hover:text-choco dark:hover:text-cream"
              }`}
            >
              <Icon className="size-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Columna principal */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Título */}
          <div className="bg-cream dark:bg-oscuro border border-cocoa/20 dark:border-cream/10 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-choco/60 dark:text-cream/60 mb-1">
              <Type className="size-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Contenido principal
              </span>
            </div>

            <div>
              <label htmlFor="title" className={labelClass}>
                Título *
              </label>
              <input
                id="title"
                type="text"
                placeholder="Escribe un título atractivo..."
                className={inputClass}
                {...register("title", {
                  required: !isEditing ? "El título es requerido" : false,
                  minLength: { value: 3, message: "Mínimo 3 caracteres" },
                })}
              />
              {errors.title && (
                <p className={errorClass}>{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="slug" className={labelClass}>
                Slug
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-choco/40 dark:text-cream/40 text-xs">
                  /blog/
                </span>
                <input
                  id="slug"
                  type="text"
                  placeholder="mi-articulo"
                  className={`${inputClass} pl-14`}
                  {...register("slug", {
                    required: !isEditing ? "El slug es requerido" : false,
                  })}
                />
              </div>
              {errors.slug && (
                <p className={errorClass}>{errors.slug.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="excerpt" className={labelClass}>
                Extracto
              </label>
              <textarea
                id="excerpt"
                rows={2}
                placeholder="Breve descripción que aparece en la lista del blog..."
                className={inputClass}
                {...register("excerpt", {
                  minLength: { value: 10, message: "Mínimo 10 caracteres" },
                })}
              />
              {errors.excerpt && (
                <p className={errorClass}>{errors.excerpt.message}</p>
              )}
            </div>
          </div>

          {/* Contenido Markdown */}
          <div className="bg-cream dark:bg-oscuro border border-cocoa/20 dark:border-cream/10 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-choco/60 dark:text-cream/60">
              <AlignLeft className="size-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Contenido (Markdown)
              </span>
            </div>
            <textarea
              id="content_markdown"
              rows={16}
              placeholder={`# Título del artículo\n\nEscribe tu contenido aquí usando **Markdown**...\n\n## Subtítulo\n\nPárrafo de texto...`}
              className={`${inputClass} font-mono text-xs leading-relaxed resize-y`}
              {...register("content_markdown", {
                required: !isEditing ? "El contenido es requerido" : false,
                minLength: { value: 20, message: "Mínimo 20 caracteres" },
              })}
            />
            {errors.content_markdown && (
              <p className={errorClass}>{errors.content_markdown.message}</p>
            )}
            <p className="text-[11px] text-choco/40 dark:text-cream/40">
              Soporta Markdown: **negrita**, *cursiva*, # títulos, [links](url),
              etc.
            </p>
          </div>
        </div>

        {/* Columna lateral */}
        <div className="flex flex-col gap-5">
          {/* Imagen destacada */}
          <div className="bg-cream dark:bg-oscuro border border-cocoa/20 dark:border-cream/10 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-choco/60 dark:text-cream/60">
              <ImageIcon className="size-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Imagen destacada
              </span>
            </div>

            {previewUrl ? (
              <div className="relative rounded-lg overflow-hidden aspect-video">
                <img
                  src={previewUrl}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl(null);
                    setImageFile(null);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 aspect-video border-2 border-dashed border-cocoa/30 dark:border-cream/20 rounded-lg cursor-pointer hover:border-choco dark:hover:border-cream/50 transition-colors bg-cocoa/5 dark:bg-cream/5">
                <ImageIcon className="size-8 text-choco/30 dark:text-cream/30" />
                <span className="text-xs text-choco/50 dark:text-cream/50">
                  Haz clic para subir una imagen
                </span>
                <span className="text-[11px] text-choco/30 dark:text-cream/30">
                  PNG, JPG, AVIF hasta 5MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
            {imageError && <p className={errorClass}>{imageError}</p>}
          </div>

          {/* Publicación */}
          <div className="bg-cream dark:bg-oscuro border border-cocoa/20 dark:border-cream/10 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-choco/60 dark:text-cream/60">
              <FileText className="size-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Publicación
              </span>
            </div>

            {/* Estado (mobile) */}
            <div className="sm:hidden">
              <label htmlFor="status" className={labelClass}>
                Estado
              </label>
              <select
                id="status"
                className={inputClass}
                {...register("status", { required: "El estado es requerido" })}
              >
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
                <option value="archived">Archivado</option>
              </select>
            </div>

            <div>
              <label htmlFor="published_at" className={labelClass}>
                <Calendar className="size-3 inline mr-1" />
                Fecha de publicación
              </label>
              <input
                id="published_at"
                type="datetime-local"
                className={inputClass}
                {...register("published_at")}
              />
              <p className="text-[11px] text-choco/40 dark:text-cream/40 mt-1">
                Dejar vacío para no programar
              </p>
            </div>

            <div>
              <label htmlFor="display_author_name" className={labelClass}>
                <User className="size-3 inline mr-1" />
                Autor visible
              </label>
              <input
                id="display_author_name"
                type="text"
                placeholder="Bocaditos Yomi's"
                className={inputClass}
                {...register("display_author_name")}
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col gap-2.5">
            <button
              type="submit"
              disabled={isBusy}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm bg-choco text-cream dark:bg-cream dark:text-oscuro hover:bg-cocoa dark:hover:bg-butter transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              <Save className="size-4" />
              {isBusy
                ? "Guardando..."
                : isEditing
                  ? "Actualizar publicación"
                  : "Crear publicación"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/blog")}
              disabled={isBusy}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl text-sm border border-cocoa/30 dark:border-cream/20 text-choco/70 dark:text-cream/70 hover:bg-cocoa/10 dark:hover:bg-cream/10 transition-all duration-200"
            >
              <X className="size-4" />
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BlogPostForm;