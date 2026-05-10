import { FieldErrors, UseFormRegister } from "react-hook-form";
import { AddressFormValues } from "@/lib/validators";

interface Props {
  register: UseFormRegister<AddressFormValues>;
  errors: FieldErrors<AddressFormValues>;
  name: keyof AddressFormValues;
  className?: string;
  placeholder: string;
  type?: string;
}

export const InputAddress = ({
  register,
  errors,
  name,
  className,
  placeholder,
  type = "text",
}: Props) => {
  return (
    <div className="flex flex-col gap-1">
      <input
        type={type}
        placeholder={placeholder}
        className={`w-full px-4 py-3 text-sm rounded-lg border transition-all duration-200
          bg-fondo dark:bg-fondo-dark
          text-choco dark:text-cream
          placeholder:text-choco/40 dark:placeholder:text-cream/40
          border-cocoa/30 dark:border-cream/20
          focus:outline-none focus:ring-2 focus:ring-choco/30 dark:focus:ring-cream/30
          focus:border-choco dark:focus:border-cream/60
          ${errors[name] ? "border-red-400 dark:border-red-400 focus:ring-red-200" : ""}
          ${className ?? ""}
        `}
        {...register(name)}
      />
      {errors[name] && (
        <p className="text-xs text-red-500 dark:text-red-400 pl-1">
          {errors[name]?.message}
        </p>
      )}
    </div>
  );
};
