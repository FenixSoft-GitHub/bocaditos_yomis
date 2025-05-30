// src/components/products/ProductFilter.tsx

import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useEffect, useState } from "react";
import { GoSearch } from "react-icons/go";
import { GrPowerReset } from "react-icons/gr";
// import { Input } from "@/components/ui/input"; // Si usas shadcn/ui o reemplázalo por un input nativo

interface ProductFilterProps {
  search: string;
  onSearchChange: (value: string) => void;

  selectedCategory: string | null;
  onCategoryChange: (value: string | null) => void;

  categories: string[];
  onReset?: () => void;
}

export const SelectFilter: React.FC<ProductFilterProps> = ({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  onReset,
}) => {
  const [localSearch, setLocalSearch] = useState(search);
  const debouncedSearch = useDebouncedValue(localSearch, 600); // Debounce de 300ms

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
    };

  // Actualiza el valor externo solo después del debounce
  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  // Sincroniza con el prop si cambia externamente
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  return (
    <div className="w-full flex flex-col lg:flex-row justify-between items-center gap-4 bg-fondo dark:bg-fondo-dark p-4 rounded-lg shadow-sm">
      {/* Buscar por texto */}
      <div className="relative w-full lg:w-3/4 flex-1">
        <GoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 w-4 h-4 pointer-events-none" />
        <input
          type="text"
          value={localSearch}
          // onChange={(e) => onSearchChange(e.target.value)}
          //onChange={(e) => setLocalSearch(e.target.value)}
          onChange={handleSearchChange}
          placeholder="Buscar productos..."
          className="pl-10 pr-4 py-2 w-full border border-cocoa/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary dark:bg-fondo-dark dark:text-white"
        />
      </div>

      {/* Filtrar por categoría */}
      <div className="flex items-center gap-3 w-full lg:w-1/2 flex-1">
        <select
          value={selectedCategory || ""}
          onChange={(e) => onCategoryChange(e.target.value || null)}
          className="px-4 py-2 border border-cocoa shadow-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-choco capitalize dark:bg-fondo-dark dark:text-cream/50 dark:border-cocoa/50 w-full"
        >
          <option value="">Todas las categorías</option>
          {categories.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {/* Reset */}
        {(search || selectedCategory) && onReset && (
          <button
            onClick={() => {
              setLocalSearch("");
              onSearchChange("");
              onCategoryChange(null);
              onReset?.();
            }}
            className="text-cream dark:text-choco hover:scale-110 transition-all duration-300 flex justify-center items-center gap-2 cursor-pointer rounded-full bg-choco p-2 dark:bg-cream/70 w-auto h-fit shadow-lg"
            title="Limpiar filtros"
          >
            <GrPowerReset className="size-5" />
          </button>
        )}
      </div>
    </div>
  );
};

// import React from "react";
// import { GrPowerReset } from "react-icons/gr";

// interface SelectFilterProps {
//   label: string;
//   options: string[];
//   selectedValue: string | null;
//   onChange: (value: string | null) => void;
//   onReset?: () => void;
//   placeholder?: string;
//   className?: string;
// }

// export const SelectFilter: React.FC<SelectFilterProps> = ({
//   label,
//   options,
//   selectedValue,
//   onChange,
//   onReset,
//   placeholder = "Todas las opciones",
//   className = "",
// }) => {
//   const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     onChange(value || null);
//   };

//   return (
//     <div
//       className={`flex flex-col items-center gap-2 w-full md:w-auto bg-fondo text-choco dark:bg-fondo-dark dark:text-cream ${className}`}
//     >
//       <label
//         htmlFor="select-filter"
//         className="text-sm font-medium whitespace-nowrap"
//       >
//         {label}
//       </label>

//       <div className="flex items-center gap-3">
//         <div className="relative w-full sm:w-auto max-w-full">
//           <select
//             id="select-filter"
//             value={selectedValue || ""}
//             onChange={handleChange}
//             className="px-4 py-2 border border-cocoa shadow-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-choco capitalize dark:bg-oscuro dark:text-cream dark:border-cocoa/50 w-56"
//           >
//             <option value="">{placeholder}</option>
//             {options.map((option) => (
//               <option key={option} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Botón de reset */}

//         {selectedValue && onReset && (
//           <button
//             onClick={onReset}
//             className="text-cream dark:text-choco hover:scale-110 transition-all duration-300 flex justify-center items-center gap-2 cursor-pointer rounded-full bg-choco p-2 dark:bg-cream/70 w-auto h-fit shadow-lg"
//             title="Limpiar filtro"
//           >
//             <GrPowerReset className="size-5" />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };
