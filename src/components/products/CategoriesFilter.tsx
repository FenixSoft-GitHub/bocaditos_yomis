import React, { useState, useEffect } from "react";
import { GrPowerReset } from "react-icons/gr";

interface CategoriesFilterProps {
  categories: string[] | undefined;
  onCategoryChange: (category: string | null) => void;
  onResetFilter: () => void;
  initialCategory?: string | null;
}

export const CategoriesFilter: React.FC<CategoriesFilterProps> = ({
  categories,
  onCategoryChange,
  onResetFilter,
  initialCategory,
}) => {
  const [selectedCategoryLocal, setSelectedCategoryLocal] = useState<string | null>(
    initialCategory || null
  );

  useEffect(() => {
    setSelectedCategoryLocal(initialCategory || null);
  }, [initialCategory]);

  const handleBrandChangeLocal = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    setSelectedCategoryLocal(selectedValue || null);
    onCategoryChange(selectedValue || null);
  };

  return (
    <div className="flex items-center gap-4 w-full md:w-auto dark:bg-fondo-dark dark:text-cream text-choco bg-fondo">
      <label
        htmlFor="category-filter"
        className="text-sm font-medium "
      >
        Filtrar por Categorias:
      </label>
      <select
        id="category-filter"
        value={selectedCategoryLocal || ""}
        onChange={handleBrandChangeLocal}
        className="px-4 py-2 border border-cocoa shadow-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-choco capitalize dark:bg-oscuro dark:text-cream dark:border-cocoa/50 w-full md:w-56"
      >
        <option value="">Todas las categorias</option>
        {categories?.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      {selectedCategoryLocal && (
        <button
          onClick={onResetFilter}
          className="text-cream dark:text-choco hover:scale-110 transition-all duration-300 flex items-center gap-2 cursor-pointer rounded-full bg-choco p-2 dark:bg-cream/70"
        >
          <GrPowerReset className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};