import { FieldErrors, UseFormRegister } from "react-hook-form";
import { InputAddress } from "./InputAddress";
import { AddressFormValues } from "@/lib/validators";
import { MapPin, Truck } from "lucide-react";

interface ShippingSectionProps {
  register: UseFormRegister<AddressFormValues>;
  errors: FieldErrors<AddressFormValues>;
  deliveryOptions:
    | Array<{
        id: string;
        name: string;
        price: number;
        created_at: string | null;
        estimated_time: string | null;
      }>
    | null
    | undefined;
}

const selectClass = `w-full px-4 py-3 text-sm rounded-lg border transition-all duration-200
  bg-fondo dark:bg-fondo-dark text-choco dark:text-cream
  border-cocoa/30 dark:border-cream/20
  focus:outline-none focus:ring-2 focus:ring-choco/30 dark:focus:ring-cream/30
  focus:border-choco dark:focus:border-cream/60 cursor-pointer`;

export const ShippingSection = ({
  register,
  errors,
  deliveryOptions,
}: ShippingSectionProps) => (
  <div className="flex flex-col gap-4">
    <div className="flex items-center gap-2 mb-1">
      <MapPin className="size-4 text-choco/70 dark:text-cream/70" />
      <h3 className="font-semibold text-base">Dirección de entrega</h3>
    </div>

    <InputAddress
      register={register}
      errors={errors}
      name="addressLine1"
      placeholder="Dirección principal *"
    />
    <InputAddress
      register={register}
      errors={errors}
      name="addressLine2"
      placeholder="Apartamento, piso, referencia (opcional)"
    />

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <InputAddress
        register={register}
        errors={errors}
        name="state"
        placeholder="Estado / Provincia *"
      />
      <InputAddress
        register={register}
        errors={errors}
        name="city"
        placeholder="Ciudad *"
      />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <InputAddress
        register={register}
        errors={errors}
        name="postalCode"
        placeholder="Código postal (opcional)"
      />
      <select className={selectClass} {...register("country")}>
        <option value="Venezuela">🇻🇪 Venezuela</option>
      </select>
    </div>

    <div className="flex items-center gap-2 mt-2 mb-1">
      <Truck className="size-4 text-choco/70 dark:text-cream/70" />
      <h3 className="font-semibold text-base">Método de envío</h3>
    </div>

    <select className={selectClass} {...register("delivery_option_id")}>
      <option value="">Selecciona un método de entrega</option>
      {deliveryOptions?.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
          {option.estimated_time ? ` — ${option.estimated_time}` : ""}
          {" · "}
          {option.price > 0 ? `$${option.price}` : "Gratis"}
        </option>
      ))}
    </select>
  </div>
);
