import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DeliveryOptionFormValues,
  deliveryOptionSchema,
} from "@/lib/validators";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Save, X, Truck, DollarSign, Clock } from "lucide-react";
import { useCreateDelivery } from "@/hooks/deliverys/useCreateDelivery";
import { useUpdateDelivery } from "@/hooks/deliverys/useUpdateDelivery";

interface Props {
  title: string;
  initialData?: DeliveryOptionFormValues | null;
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

export const FormDeliverys = ({ title, initialData }: Props) => {
  const isEditing = !!initialData;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DeliveryOptionFormValues>({
    resolver: zodResolver(deliveryOptionSchema),
    defaultValues: initialData || { name: "", price: 0, estimated_time: "" },
  });

  const { mutate: createDelivery, isPending: isCreating } = useCreateDelivery();
  const { mutate: updateDelivery, isPending: isUpdating } = useUpdateDelivery(
    () => navigate("/dashboard/deliverys"),
  );

  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  const onSubmit = (values: DeliveryOptionFormValues) => {
    if (isEditing) {
      updateDelivery({ id: initialData!.id as string, values });
    } else {
      createDelivery(values, { onSuccess: () => reset() });
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
              ? "Modifica los datos del método de entrega"
              : "Configura un nuevo método de entrega"}
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="bg-cream dark:bg-oscuro border border-cocoa/20 dark:border-cream/10 rounded-xl p-6 shadow-sm">
        {/* Icono decorativo */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-cocoa/10 dark:border-cream/10">
          <div className="w-10 h-10 rounded-xl bg-cocoa/15 dark:bg-cream/15 flex items-center justify-center">
            <Truck className="size-5 text-choco/70 dark:text-cream/70" />
          </div>
          <div>
            <p className="font-semibold text-sm">Método de Entrega</p>
            <p className="text-xs text-choco/50 dark:text-cream/50">
              Aparecerá como opción en el checkout del cliente
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Nombre */}
          <div>
            <label htmlFor="name" className={labelClass}>
              <Truck className="size-3 inline mr-1" />
              Nombre del Método *
            </label>
            <input
              id="name"
              type="text"
              placeholder="Ej: Delivery Estándar, Retiro en Tienda..."
              disabled={isBusy}
              className={`${inputClass} ${errors.name ? "border-red-400" : ""}`}
              {...register("name")}
            />
            {errors.name && <p className={errorClass}>{errors.name.message}</p>}
          </div>

          {/* Precio y Tiempo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className={labelClass}>
                <DollarSign className="size-3 inline mr-1" />
                Precio *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-choco/40 dark:text-cream/40 text-sm">
                  $
                </span>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  disabled={isBusy}
                  onFocus={(e) => e.target.select()}
                  className={`${inputClass} pl-7 ${errors.price ? "border-red-400" : ""}`}
                  {...register("price", { valueAsNumber: true })}
                />
              </div>
              {errors.price && (
                <p className={errorClass}>{errors.price.message}</p>
              )}
              <p className="text-[11px] text-choco/40 dark:text-cream/40 mt-1">
                Usa 0 para envío gratis
              </p>
            </div>

            <div>
              <label htmlFor="estimated_time" className={labelClass}>
                <Clock className="size-3 inline mr-1" />
                Tiempo Estimado
              </label>
              <input
                id="estimated_time"
                type="text"
                placeholder="Ej: 1-2 días, 24 horas..."
                disabled={isBusy}
                onFocus={(e) => e.target.select()}
                className={`${inputClass} ${errors.estimated_time ? "border-red-400" : ""}`}
                {...register("estimated_time")}
              />
              {errors.estimated_time && (
                <p className={errorClass}>{errors.estimated_time.message}</p>
              )}
            </div>
          </div>

          {/* Info visual */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-cocoa/10 dark:bg-cream/10 text-xs text-choco/60 dark:text-cream/60">
            <Truck className="size-4 shrink-0 mt-0.5" />
            <p>
              El precio y el tiempo estimado se mostrarán al cliente en el
              proceso de pago para que pueda elegir su opción preferida.
            </p>
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
                  : "Crear método"}
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
// import { DeliveryOptionFormValues, deliveryOptionSchema } from "@/lib/validators";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { ChevronLeft } from "lucide-react";
// import { useCreateDelivery } from "@/hooks/deliverys/useCreateDelivery";
// import { useUpdateDelivery } from "@/hooks/deliverys/useUpdateDelivery";

// interface Props {
//   title: string;
//   initialData?: DeliveryOptionFormValues | null;
// }

// export const FormDeliverys = ({ title, initialData }: Props) => {
//   const isEditing = !!initialData;
//   const navigate = useNavigate();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<DeliveryOptionFormValues>({
//     resolver: zodResolver(deliveryOptionSchema),
//     defaultValues: initialData || {
//       name: "",
//       price: 0,
//       estimated_time: "",
//     },
//   });

//   const { mutate: createDelivery, isPending: isCreating } = useCreateDelivery();
//   const { mutate: updateDelivery, isPending: isUpdating } = useUpdateDelivery(() => navigate("/dashboard/deliverys"));

//   useEffect(() => {
//     if (initialData) {
//       reset(initialData);
//     }
//   }, [initialData, reset]);

//   const onSubmit = (values: DeliveryOptionFormValues) => {
//     if (isEditing) {
//       updateDelivery({ id: initialData!.id as string, values });
//     } else {
//       createDelivery(values, {
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

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//           <div>
//             <label className="block text-sm font-medium mb-1">Nombre</label>
//             <input
//               type="text"
//               {...register("name")}
//               className={`w-full px-4 py-2 rounded-lg border text-sm bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
//                 errors.name
//                   ? "border-red-500"
//                   : "border-gray-300 dark:border-zinc-700"
//               }`}
//               placeholder="Nombre de la categoría"
//             />
//             {errors.name && (
//               <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Precio</label>
//             <input
//               type="number"
//               {...register("price", { valueAsNumber: true })}
//               placeholder="0.00"
//               className={`w-full px-4 py-2 rounded-lg border text-sm bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
//                 errors.price
//                   ? "border-red-500"
//                   : "border-gray-300 dark:border-zinc-700"
//               }`}
//             />
//             {errors.price && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.price.message}
//               </p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Tiempo Estimado
//             </label>
//             <input
//               type="text"
//               {...register("estimated_time")}
//               placeholder="Tiempo estimado de la entrega"
//               className={`w-full px-4 py-2 rounded-lg border text-sm bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
//                 errors.estimated_time
//                   ? "border-red-500"
//                   : "border-gray-300 dark:border-zinc-700"
//               }`}
//             />
//             {errors.estimated_time && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.estimated_time.message}
//               </p>
//             )}
//           </div>

//           <button
//             type="submit"
//             disabled={isCreating || isUpdating}
//             className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-white dark:bg-amber-500 dark:text-black hover:bg-amber-700 dark:hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
