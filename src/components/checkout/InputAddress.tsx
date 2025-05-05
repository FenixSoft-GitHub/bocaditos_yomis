import { FieldErrors, UseFormRegister } from "react-hook-form";
import { AddressFormValues } from "@/lib/validators";

interface Props {
  register: UseFormRegister<AddressFormValues>;
  errors: FieldErrors<AddressFormValues>;

  name: keyof AddressFormValues;
  className?: string;
  placeholder: string;
}

export const InputAddress = ({
  register,
  errors,
  name,
  className,
  placeholder,
}: Props) => {
  return (
    <>
      {/* <div
        className={`text-choco dark:text-cream bg-cream dark:bg-fondo-dark border border-cocoa/30 dark:border-cream/30 rounded-md overflow-hidden py-2 ${
          errors[name] && "border-red-500"
        } ${className}`}
      > */}
        <input
          type="text"
          className={`w-full p-3 text-sm focus:outline-none border border-cocoa/30 dark:border-cream/30 rounded-lg focus:border-choco dark:focus:border-cream/70  transition-colors focus:ring-1 duration-300 ${className}`}
          placeholder={placeholder}
          {...register(name)}
        />
      {/* </div> */}
      {errors[name] && (
        <p className="text-red-500 text-xs">{errors[name].message}</p>
      )}
    </>
  );
};
