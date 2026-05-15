import { useCreateCategory, useUpdateCategory } from "@/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryFormValues, categorySchema } from "@/lib/validators";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Save, X, LayoutGrid, AlignLeft } from "lucide-react";

interface Props {
  title: string;
  initialData?: CategoryFormValues | null;
}

const inputClass = `w-full px-4 py-2.5 text-sm rounded-lg border transition-all duration-200
  bg-fondo dark:bg-fondo-dark text-choco dark:text-cream
  placeholder:text-choco/40 dark:placeholder:text-cream/40
  border-cocoa/30 dark:border-cream/20
  focus:outline-none focus:ring-2 focus:ring-choco/20 dark:focus:ring-cream/20
  focus:border-choco dark:focus:border-cream/60
  disabled:opacity-50`;

const labelClass =
  "block text-xs font-semibold uppercase tracking-wider text-choco/60 dark:text-cream/60 mb-1.5";
const errorClass = "text-xs text-red-500 dark:text-red-400 mt-1 pl-1";

export const FormCategories = ({ title, initialData }: Props) => {
  const isEditing = !!initialData;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData || { name: "", description: "" },
  });

  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory(
    () => navigate("/dashboard/categories"),
  );

  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  const onSubmit = (values: CategoryFormValues) => {
    if (isEditing) {
      updateCategory({ id: initialData!.id as string, values });
    } else {
      createCategory(values, { onSuccess: () => reset() });
    }
  };

  const isBusy = isCreating || isUpdating;

  return (
    <div className="max-w-xl mx-auto px-4 py-6 text-choco dark:text-cream">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg bg-cocoa/10 dark:bg-cream/10 hover:bg-cocoa/20 dark:hover:bg-cream/20 transition-colors"
          aria-label="Volver"
        >
          <ChevronLeft className="size-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-xs text-choco/50 dark:text-cream/50 mt-0.5">
            {isEditing
              ? "Modifica los datos de la categoría"
              : "Completa los datos para crear una categoría"}
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="bg-cream dark:bg-oscuro border border-cocoa/20 dark:border-cream/10 rounded-xl p-6 shadow-sm">
        {/* Icono decorativo */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-cocoa/10 dark:border-cream/10">
          <div className="w-10 h-10 rounded-xl bg-cocoa/15 dark:bg-cream/15 flex items-center justify-center">
            <LayoutGrid className="size-5 text-choco/70 dark:text-cream/70" />
          </div>
          <div>
            <p className="font-semibold text-sm">Categoría de Producto</p>
            <p className="text-xs text-choco/50 dark:text-cream/50">
              Las categorías ayudan a organizar tu catálogo
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Nombre */}
          <div>
            <label htmlFor="name" className={labelClass}>
              <LayoutGrid className="size-3 inline mr-1" />
              Nombre *
            </label>
            <input
              id="name"
              type="text"
              placeholder="Ej: Panes, Galletas, Tortas..."
              disabled={isBusy}
              className={`${inputClass} ${errors.name ? "border-red-400 focus:ring-red-200" : ""}`}
              {...register("name")}
            />
            {errors.name && <p className={errorClass}>{errors.name.message}</p>}
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="description" className={labelClass}>
              <AlignLeft className="size-3 inline mr-1" />
              Descripción
            </label>
            <textarea
              id="description"
              rows={4}
              placeholder="Describe brevemente esta categoría..."
              disabled={isBusy}
              className={`${inputClass} resize-y ${errors.description ? "border-red-400 focus:ring-red-200" : ""}`}
              {...register("description")}
            />
            {errors.description && (
              <p className={errorClass}>{errors.description.message}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <button
              type="submit"
              disabled={isBusy}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm bg-choco text-cream dark:bg-cream dark:text-oscuro hover:bg-cocoa dark:hover:bg-butter transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              <Save className="size-4" />
              {isBusy
                ? isEditing
                  ? "Guardando..."
                  : "Creando..."
                : isEditing
                  ? "Guardar cambios"
                  : "Crear categoría"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isBusy}
              className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm border border-cocoa/30 dark:border-cream/20 text-choco/70 dark:text-cream/70 hover:bg-cocoa/10 dark:hover:bg-cream/10 transition-all"
            >
              <X className="size-4" />
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};