import { FieldErrors, UseFormRegister } from "react-hook-form";
import { InputAddress } from "./InputAddress";
import { AddressFormValues } from "@/lib/validators";

interface ShippingSectionProps {
  register: UseFormRegister<AddressFormValues>;
  errors: FieldErrors<AddressFormValues>;
  deliveryOptions:
    | Array<{
        id: string;
        name: string;
        price: number;
      }>
    | undefined; // Adjust the type according to your delivery options structure
}

// En components/checkout/ShippingSection.tsx
export const ShippingSection = ({ register, errors, deliveryOptions }: ShippingSectionProps) => (
  <div className="flex flex-col gap-3">
    <h3 className="text-lg font-semibold">Entrega</h3>

    <InputAddress
      register={register}
      errors={errors}
      name="addressLine1"
      placeholder="Dirección principal"
    />
    <InputAddress
      register={register}
      errors={errors}
      name="addressLine2"
      placeholder="Dirección adicional (Opcional)"
    />
    <InputAddress
      register={register}
      errors={errors}
      name="state"
      placeholder="Estado / Provincia"
    />
    <InputAddress
      register={register}
      errors={errors}
      name="city"
      placeholder="Ciudad"
    />
    <InputAddress
      register={register}
      errors={errors}
      name="postalCode"
      placeholder="Código Postal (Opcional)"
    />

    <select
      className="text-sm border dark:border-cream/30 border-cocoa/30 rounded-lg p-3 focus:outline-none"
      {...register("country")}
    >
      <option value="Venezuela">Venezuela</option>
    </select>

    <select
      className="text-sm border dark:border-cream/30 border-cocoa/30 rounded-lg p-3 dark:bg-fondo-dark"
      {...register("delivery_option_id")}
    >
      <option value="">Selecciona método de entrega</option>
      {deliveryOptions?.map((option) => (
        <option key={option.id} value={option.id} className="dark:bg-cream/30">
          {option.name} - {option.price > 0 ? `$${option.price}` : "Gratis"}
        </option>
      ))}
    </select>
  </div>
);
