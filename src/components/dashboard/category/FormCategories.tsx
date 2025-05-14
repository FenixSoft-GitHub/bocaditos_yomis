import { useCreateCategory, useUpdateCategory } from "@/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryFormValues, categorySchema } from "@/lib/validators";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";

interface Props {
  title: string;
  initialData?: CategoryFormValues | null;
}

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
    defaultValues: initialData || {
      name: "",
      description: "",
    },
  }); 

  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory(() => navigate("/dashboard/categories"));

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = (values: CategoryFormValues) => {
    if (isEditing) {
      updateCategory({ id: initialData!.id as string, values });
    } else {
      createCategory(values, {
        onSuccess: () => reset(),
      });
    }
  };

  return (
    <section className="w-full max-w-2xl mx-auto flex flex-col gap-10 bg-fondo text-choco dark:bg-fondo-dark dark:text-cream ">
      <button
        className="flex items-center gap-2 text-sm border border-cocoa dark:border-cream/30 rounded-full bg-cream dark:bg-cocoa/20 shadow-gray-400 shadow-md hover:bg-cocoa/20 hover:font-semibold dark:hover:bg-cocoa/20 px-6 py-1 w-fit mt-10"
        onClick={() => navigate(-1)}
      >
        <IoChevronBack size={16} />
        Volver
      </button>

      <div className="border border-cocoa/40 rounded-xl shadow-md p-6">
        <header className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              {...register("name")}
              className={`w-full px-4 py-2 rounded-lg border text-sm bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.name
                  ? "border-red-500"
                  : "border-gray-300 dark:border-zinc-700"
              }`}
              placeholder="Nombre de la categoría"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Descripción
            </label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Descripción de la categoría"
              className={`w-full px-4 py-2 rounded-lg border text-sm bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.description
                  ? "border-red-500"
                  : "border-gray-300 dark:border-zinc-700"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isCreating || isUpdating}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-white dark:bg-amber-500 dark:text-black hover:bg-amber-700 dark:hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating || isUpdating
              ? isEditing
                ? "Guardando cambios..."
                : "Agregando..."
              : isEditing
              ? "Guardar cambios"
              : "Agregar categoría"}
          </button>
        </form>
      </div>
    </section>
  );
};
