import { FieldErrors, UseFormRegister } from "react-hook-form";
import { ProductFormValues } from "@/lib/validators";


interface Props {
  className?: string;

  label: string;
  placeholder?: string;
  type: string;
  step?: string;
  name: keyof ProductFormValues;
  // name: FieldPath<ProductFormValues>;

  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  required?: boolean;
  disabled?: boolean;
}

export const InputForm = ({
  className,
  label,
  placeholder,
  type,
  step,
  name,
  register,
  errors,
  required,
  disabled,
}: Props) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex justify-between items-center">
        <label
          htmlFor={name}
          className="text-xs font-bold tracking-tight capitalize "
        >
          {label}:
        </label>

        {required && (
          <span
            className={`${
              required && "text-red-500 text-sm mr-3"
            } font-bold self-end`}
          >
            *
          </span>
        )}
      </div>

      <div
        className={`rounded-md overflow-hidden gap-5 items-center ${
          errors[name] ? "border-red-500" : ""
        }`}
      >
        <input
          type={type}
          placeholder={placeholder}
          id={name}
          step={step}
          disabled={disabled}
          className={`py-2 text-sm px-3 font-medium tracking-tighter w-full border border-cocoa/70 dark:border-cream/30 rounded-md placeholder:font-normal focus:outline-none text-choco bg-cream dark:bg-fondo-dark dark:text-cream dark:focus:border-cream/50 focus:border-cocoa/90 focus:border-2 outline-none transition-all duration-300 ease-in-out ${className}`}
          autoComplete="off"
          {...register(name)}
        />
      </div>
    </div>
  );
};
