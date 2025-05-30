import { useFormContext } from "react-hook-form";

export const DiscountSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Descuento</h3>

      <div className="space-y-1">
        <label className="text-sm font-medium">Tipo de descuento</label>
        <select
          {...register("discount_type")}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Sin descuento</option>
          <option value="percentage">Porcentaje (%)</option>
          <option value="fixed">Monto fijo</option>
        </select>
        {errors.discount_type && (
          <p className="text-red-500 text-xs">
            {errors.discount_type.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Valor</label>
        <input
          type="number"
          step="0.01"
          {...register("discount_value")}
          className="w-full border rounded px-3 py-2"
        />
        {errors.discount_value && (
          <p className="text-red-500 text-xs">
            {errors.discount_value.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Desde</label>
        <input
          type="datetime-local"
          {...register("discount_starts_at")}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Hasta</label>
        <input
          type="datetime-local"
          {...register("discount_ends_at")}
          className="w-full border rounded px-3 py-2"
        />
      </div>
    </div>
  );
};



// // components/admin/DiscountForm.tsx
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { discountSchema, DiscountFormValues } from "@/lib/validators";

// export const DiscountForm = ({
//   onSubmit,
// }: {
//   onSubmit: (data: DiscountFormValues) => void;
// }) => {
//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm<DiscountFormValues>({
//     resolver: zodResolver(discountSchema),
//     defaultValues: {
//       discount_type: "percentage",
//       value: 10,
//       starts_at: "",
//       ends_at: "",
//     },
//   });

//   const discountType = watch("discount_type");

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
//       <div>
//         <label className="block text-sm font-medium">Tipo de Descuento</label>
//         <select
//           {...register("discount_type")}
//           className="w-full p-2 border rounded"
//         >
//           <option value="percentage">Porcentaje (%)</option>
//           <option value="fixed">Monto fijo</option>
//         </select>
//         {errors.discount_type && (
//           <p className="text-red-500 text-sm">{errors.discount_type.message}</p>
//         )}
//       </div>

//       <div>
//         <label className="block text-sm font-medium">
//           {discountType === "percentage" ? "Porcentaje (%)" : "Monto ($)"}
//         </label>
//         <input
//           type="number"
//           step="0.01"
//           min={0}
//           {...register("value", { valueAsNumber: true })}
//           className="w-full p-2 border rounded"
//         />
//         {errors.value && (
//           <p className="text-red-500 text-sm">{errors.value.message}</p>
//         )}
//       </div>

//       <div>
//         <label className="block text-sm font-medium">Desde</label>
//         <input
//           type="datetime-local"
//           {...register("starts_at")}
//           className="w-full p-2 border rounded"
//         />
//         {errors.starts_at && (
//           <p className="text-red-500 text-sm">{errors.starts_at.message}</p>
//         )}
//       </div>

//       <div>
//         <label className="block text-sm font-medium">Hasta</label>
//         <input
//           type="datetime-local"
//           {...register("ends_at")}
//           className="w-full p-2 border rounded"
//         />
//         {errors.ends_at && (
//           <p className="text-red-500 text-sm">{errors.ends_at.message}</p>
//         )}
//       </div>

//       <button
//         type="submit"
//         className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded"
//       >
//         Guardar Descuento
//       </button>
//     </form>
//   );
// };
