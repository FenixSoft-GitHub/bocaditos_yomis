import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useEffect, useState } from "react";
import { Search, RotateCcw } from "lucide-react";

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
  const debouncedSearch = useDebouncedValue(localSearch, 600);

  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  return (
    <div className="w-full flex flex-col lg:flex-row justify-between items-center gap-4 bg-fondo dark:bg-fondo-dark p-4 rounded-lg shadow-sm">
      <div className="relative w-full lg:w-3/4 flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-choco/40 dark:text-cream/40 pointer-events-none" />
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Buscar productos..."
          className="pl-10 pr-4 py-2 w-full border border-cocoa/30 dark:border-cream/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-choco/20 bg-fondo dark:bg-fondo-dark text-choco dark:text-cream text-sm"
        />
      </div>
      <div className="flex items-center gap-3 w-full lg:w-1/2 flex-1">
        <select
          value={selectedCategory || ""}
          onChange={(e) => onCategoryChange(e.target.value || null)}
          className="px-4 py-2 border border-cocoa/30 dark:border-cream/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-choco/20 bg-fondo dark:bg-fondo-dark text-choco dark:text-cream capitalize w-full text-sm"
        >
          <option value="">Todas las categorías</option>
          {categories.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {(search || selectedCategory) && onReset && (
          <button
            onClick={() => {
              setLocalSearch("");
              onSearchChange("");
              onCategoryChange(null);
              onReset?.();
            }}
            className="p-2 rounded-full bg-choco text-cream dark:bg-cream/70 dark:text-choco hover:scale-110 transition-all shadow-md shrink-0"
            aria-label="Limpiar filtros"
          >
            <RotateCcw className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
};
