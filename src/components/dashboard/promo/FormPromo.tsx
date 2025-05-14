import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PromoCodeFormValues, promoCodeSchema } from "@/lib/validators";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import { useCreatePromo, useUpdatePromo } from "@/hooks";

interface Props {
  title: string;
  initialData?: PromoCodeFormValues | null;
}

export const FormPromo = ({ title, initialData }: Props) => {
  const isEditing = !!initialData;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PromoCodeFormValues>({
    resolver: zodResolver(promoCodeSchema),
    defaultValues: initialData || {
      code: "",
      discount_percent: undefined,
      is_active: true,
      valid_from: "",
      valid_until: "",
    },
  });

  const { mutate: createPromo, isPending: isCreating } = useCreatePromo();
  const { mutate: updatePromo, isPending: isUpdating } = useUpdatePromo(() => navigate("/dashboard/promotions"));

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        is_active: initialData.is_active ?? true,
        valid_from: initialData.valid_from.toString().split("T")[0], 
        valid_until: initialData.valid_until.toString().split("T")[0], 
      });
    }
  }, [initialData, reset]);

 
  const onSubmit = (values: PromoCodeFormValues) => {
    const payload = {
      ...values,
      is_active: values.is_active ?? false, 
      valid_from: new Date(values.valid_from).toISOString().split("T")[0],
      valid_until: new Date(values.valid_until).toISOString().split("T")[0],
      created_at: initialData?.created_at || new Date().toISOString(),
      id: initialData?.id || "",
    };
    if (isEditing) {
      updatePromo({ id: initialData!.id as string, values: payload });
    } else {
      createPromo(values, {
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 text-choco dark:text-cream"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Promoción</label>
            <input
              type="text"
              {...register("code")}
              className={`w-full px-4 py-2 rounded-lg border text-sm bg-cream dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                errors.code
                  ? "border-red-500"
                  : "border-gray-300 dark:border-zinc-700"
              }`}
              placeholder="Nombre de la Promoción"
            />
            {errors.code && (
              <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descuento</label>
            <input
              type="number"
              {...register("discount_percent", { valueAsNumber: true })}
              placeholder="0.00"
              className={`w-full px-4 py-2 rounded-lg border text-sm bg-cream dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                errors.discount_percent
                  ? "border-red-500"
                  : "border-gray-300 dark:border-zinc-700"
              }`}
            />
            {errors.discount_percent && (
              <p className="text-red-500 text-xs mt-1">
                {errors.discount_percent.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Fecha Inicio
            </label>
            <input
              type="date"
              placeholder="Fecha Inicio"
              {...register("valid_from")}
              className={`w-full px-4 py-2 rounded-lg border text-sm bg-cream dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                errors.valid_from
                  ? "border-red-500"
                  : "border-gray-300 dark:border-zinc-700"
              }`}
            />
            {errors.valid_from && (
              <p className="text-red-500 text-xs mt-1">
                {errors.valid_from.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Fecha final
            </label>
            <input
              type="date"
              {...register("valid_until")}
              placeholder="Fecha Inicio"
              className={`w-full px-4 py-2 rounded-lg border text-sm bg-cream dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                errors.valid_until
                  ? "border-red-500"
                  : "border-gray-300 dark:border-zinc-700"
              }`}
            />
            {errors.valid_until && (
              <p className="text-red-500 text-xs mt-1">
                {errors.valid_until.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Activo</label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("is_active")}
                defaultChecked={initialData?.is_active ?? true}
                className="size-4.5 text-blue-600 focus:ring-blue-500 border-gray-100"
              />
              <span className="text-sm">¿Está activo?</span>
            </div>
            {errors.is_active && (
              <p className="text-red-500 text-xs mt-1">
                {errors.is_active.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isCreating || isUpdating}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold bg-amber-600 text-white dark:bg-amber-600 dark:text-cream hover:bg-amber-700 dark:hover:bg-amber-500 dark:hover:text-fondo-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
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
