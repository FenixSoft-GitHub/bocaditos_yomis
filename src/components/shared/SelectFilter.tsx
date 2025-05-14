import React from "react";
import { GrPowerReset } from "react-icons/gr";

interface SelectFilterProps {
  label: string;
  options: string[];
  selectedValue: string | null;
  onChange: (value: string | null) => void;
  onReset?: () => void;
  placeholder?: string;
  className?: string;
}

export const SelectFilter: React.FC<SelectFilterProps> = ({
  label,
  options,
  selectedValue,
  onChange,
  onReset,
  placeholder = "Todas las opciones",
  className = "",
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onChange(value || null);
  };

  return (
    <div
      className={`flex items-center gap-4 w-full md:w-auto bg-fondo text-choco dark:bg-fondo-dark dark:text-cream ${className}`}
    >
      <label htmlFor="select-filter" className="text-sm font-medium whitespace-nowrap">
        {label}
      </label>

      <select
        id="select-filter"
        value={selectedValue || ""}
        onChange={handleChange}
        className="px-4 py-2 border border-cocoa shadow-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-choco capitalize dark:bg-oscuro dark:text-cream dark:border-cocoa/50 w-full md:w-56"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {selectedValue && onReset && (
        <button
          onClick={onReset}
          className="text-cream dark:text-choco hover:scale-110 transition-all duration-300 flex items-center gap-2 cursor-pointer rounded-full bg-choco p-2 dark:bg-cream/70"
          title="Limpiar filtro"
        >
          <GrPowerReset className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
