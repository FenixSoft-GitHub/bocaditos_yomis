import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PromoCodeFormValues, promoCodeSchema } from "@/lib/validators";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Save,
  X,
  Tag,
  Percent,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { useCreatePromo, useUpdatePromo } from "@/hooks";

interface Props {
  title: string;
  initialData?: PromoCodeFormValues | null;
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

export const FormPromo = ({ title, initialData }: Props) => {
  const isEditing = !!initialData;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
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
  const { mutate: updatePromo, isPending: isUpdating } = useUpdatePromo(() =>
    navigate("/dashboard/promotions"),
  );

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
      createPromo(values, { onSuccess: () => reset() });
    }
  };

  const isActiveValue = watch("is_active");
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
              ? "Modifica los datos de la promoción"
              : "Configura una nueva promoción con descuento"}
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="bg-cream dark:bg-oscuro border border-cocoa/20 dark:border-cream/10 rounded-xl p-6 shadow-sm">
        {/* Icono decorativo */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-cocoa/10 dark:border-cream/10">
          <div className="w-10 h-10 rounded-xl bg-dorado/15 flex items-center justify-center">
            <Tag className="size-5 text-dorado" />
          </div>
          <div>
            <p className="font-semibold text-sm">Código Promocional</p>
            <p className="text-xs text-choco/50 dark:text-cream/50">
              Los descuentos se aplican automáticamente en checkout
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Código */}
          <div>
            <label htmlFor="code" className={labelClass}>
              <Tag className="size-3 inline mr-1" />
              Código de Promoción *
            </label>
            <input
              id="code"
              type="text"
              placeholder="Ej: VERANO2025, BIENVENIDO10..."
              disabled={isBusy}
              className={`${inputClass} uppercase tracking-widest font-semibold ${errors.code ? "border-red-400" : ""}`}
              {...register("code")}
            />
            {errors.code && <p className={errorClass}>{errors.code.message}</p>}
            <p className="text-[11px] text-choco/40 dark:text-cream/40 mt-1">
              El código se guardará en mayúsculas automáticamente
            </p>
          </div>

          {/* Descuento */}
          <div>
            <label htmlFor="discount_percent" className={labelClass}>
              <Percent className="size-3 inline mr-1" />
              Porcentaje de Descuento *
            </label>
            <div className="relative">
              <input
                id="discount_percent"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="Ej: 15 (para 15%)"
                disabled={isBusy}
                className={`${inputClass} pr-10 ${errors.discount_percent ? "border-red-400" : ""}`}
                {...register("discount_percent", { valueAsNumber: true })}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-choco/40 dark:text-cream/40 text-sm font-bold">
                %
              </span>
            </div>
            {errors.discount_percent && (
              <p className={errorClass}>{errors.discount_percent.message}</p>
            )}
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="valid_from" className={labelClass}>
                <Calendar className="size-3 inline mr-1" />
                Fecha de Inicio *
              </label>
              <input
                id="valid_from"
                type="date"
                disabled={isBusy}
                className={`${inputClass} ${errors.valid_from ? "border-red-400" : ""}`}
                {...register("valid_from")}
              />
              {errors.valid_from && (
                <p className={errorClass}>{errors.valid_from.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="valid_until" className={labelClass}>
                <Calendar className="size-3 inline mr-1" />
                Fecha de Fin *
              </label>
              <input
                id="valid_until"
                type="date"
                disabled={isBusy}
                className={`${inputClass} ${errors.valid_until ? "border-red-400" : ""}`}
                {...register("valid_until")}
              />
              {errors.valid_until && (
                <p className={errorClass}>{errors.valid_until.message}</p>
              )}
            </div>
          </div>

          {/* Toggle activo */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-cocoa/10 dark:bg-cream/10 border border-cocoa/20 dark:border-cream/10">
            <div className="flex items-center gap-3">
              <CheckCircle2
                className={`size-5 ${isActiveValue ? "text-green-500" : "text-choco/30 dark:text-cream/30"}`}
              />
              <div>
                <p className="text-sm font-medium">Promoción activa</p>
                <p className="text-[11px] text-choco/50 dark:text-cream/50">
                  {isActiveValue
                    ? "Visible y aplicable en checkout"
                    : "Desactivada temporalmente"}
                </p>
              </div>
            </div>
            <label className="relative cursor-pointer">
              <input
                type="checkbox"
                {...register("is_active")}
                className="sr-only"
              />
              <div
                className={`w-11 h-6 rounded-full transition-colors duration-200 ${isActiveValue ? "bg-choco dark:bg-cream" : "bg-cocoa/20 dark:bg-cream/20"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-cream dark:bg-oscuro rounded-full shadow transition-transform duration-200 ${isActiveValue ? "translate-x-5" : ""}`}
                />
              </div>
            </label>
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
                  : "Crear promoción"}
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

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { PromoCodeFormValues, promoCodeSchema } from "@/lib/validators";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { ChevronLeft } from "lucide-react";
// import { useCreatePromo, useUpdatePromo } from "@/hooks";

// interface Props {
//   title: string;
//   initialData?: PromoCodeFormValues | null;
// }

// export const FormPromo = ({ title, initialData }: Props) => {
//   const isEditing = !!initialData;
//   const navigate = useNavigate();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<PromoCodeFormValues>({
//     resolver: zodResolver(promoCodeSchema),
//     defaultValues: initialData || {
//       code: "",
//       discount_percent: undefined,
//       is_active: true,
//       valid_from: "",
//       valid_until: "",
//     },
//   });

//   const { mutate: createPromo, isPending: isCreating } = useCreatePromo();
//   const { mutate: updatePromo, isPending: isUpdating } = useUpdatePromo(() => navigate("/dashboard/promotions"));

//   useEffect(() => {
//     if (initialData) {
//       reset({
//         ...initialData,
//         is_active: initialData.is_active ?? true,
//         valid_from: initialData.valid_from.toString().split("T")[0],
//         valid_until: initialData.valid_until.toString().split("T")[0],
//       });
//     }
//   }, [initialData, reset]);

//   const onSubmit = (values: PromoCodeFormValues) => {
//     const payload = {
//       ...values,
//       is_active: values.is_active ?? false,
//       valid_from: new Date(values.valid_from).toISOString().split("T")[0],
//       valid_until: new Date(values.valid_until).toISOString().split("T")[0],
//       created_at: initialData?.created_at || new Date().toISOString(),
//       id: initialData?.id || "",
//     };
//     if (isEditing) {
//       updatePromo({ id: initialData!.id as string, values: payload });
//     } else {
//       createPromo(values, {
//         onSuccess: () => reset(),
//       });
//     }
//   };

//   return (
//     <section className="w-full max-w-2xl mx-auto flex flex-col gap-10 bg-fondo text-choco dark:bg-fondo-dark dark:text-cream ">
//       <button
//         className="flex items-center gap-2 text-sm border border-cocoa dark:border-cream/30 rounded-full bg-cream dark:bg-cocoa/20 shadow-gray-400 shadow-md hover:bg-cocoa/20 hover:font-semibold dark:hover:bg-cocoa/20 px-6 py-1 w-fit mt-10"
//         onClick={() => navigate(-1)}
//       >
//         <ChevronLeft size={16} />
//         Volver
//       </button>

//       <div className="border border-cocoa/40 rounded-xl shadow-md p-6">
//         <header className="mb-6">
//           <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
//         </header>

//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="space-y-5 text-choco dark:text-cream"
//         >
//           <div>
//             <label className="block text-sm font-medium mb-1">Promoción</label>
//             <input
//               type="text"
//               {...register("code")}
//               className={`w-full px-4 py-2 rounded-lg border text-sm bg-cream dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
//                 errors.code
//                   ? "border-red-500"
//                   : "border-gray-300 dark:border-zinc-700"
//               }`}
//               placeholder="Nombre de la Promoción"
//             />
//             {errors.code && (
//               <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Descuento</label>
//             <input
//               type="number"
//               {...register("discount_percent", { valueAsNumber: true })}
//               placeholder="0.00"
//               className={`w-full px-4 py-2 rounded-lg border text-sm bg-cream dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
//                 errors.discount_percent
//                   ? "border-red-500"
//                   : "border-gray-300 dark:border-zinc-700"
//               }`}
//             />
//             {errors.discount_percent && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.discount_percent.message}
//               </p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Fecha Inicio
//             </label>
//             <input
//               type="date"
//               placeholder="Fecha Inicio"
//               {...register("valid_from")}
//               className={`w-full px-4 py-2 rounded-lg border text-sm bg-cream dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
//                 errors.valid_from
//                   ? "border-red-500"
//                   : "border-gray-300 dark:border-zinc-700"
//               }`}
//             />
//             {errors.valid_from && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.valid_from.message}
//               </p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Fecha final
//             </label>
//             <input
//               type="date"
//               {...register("valid_until")}
//               placeholder="Fecha Inicio"
//               className={`w-full px-4 py-2 rounded-lg border text-sm bg-cream dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
//                 errors.valid_until
//                   ? "border-red-500"
//                   : "border-gray-300 dark:border-zinc-700"
//               }`}
//             />
//             {errors.valid_until && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.valid_until.message}
//               </p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Activo</label>
//             <div className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 {...register("is_active")}
//                 defaultChecked={initialData?.is_active ?? true}
//                 className="size-4.5 text-blue-600 focus:ring-blue-500 border-gray-100"
//               />
//               <span className="text-sm">¿Está activo?</span>
//             </div>
//             {errors.is_active && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.is_active.message}
//               </p>
//             )}
//           </div>

//           <button
//             type="submit"
//             disabled={isCreating || isUpdating}
//             className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold bg-amber-600 text-white dark:bg-amber-600 dark:text-cream hover:bg-amber-700 dark:hover:bg-amber-500 dark:hover:text-fondo-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isCreating || isUpdating
//               ? isEditing
//                 ? "Guardando cambios..."
//                 : "Agregando..."
//               : isEditing
//               ? "Guardar cambios"
//               : "Agregar categoría"}
//           </button>
//         </form>
//       </div>
//     </section>
//   );
// };
