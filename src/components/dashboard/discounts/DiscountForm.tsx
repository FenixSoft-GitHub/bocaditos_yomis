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
        {typeof errors.discount_type?.message === "string" && (
          <p className="text-red-500 text-xs">{errors.discount_type.message}</p>
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
        {typeof errors.discount_value?.message === "string" && (
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