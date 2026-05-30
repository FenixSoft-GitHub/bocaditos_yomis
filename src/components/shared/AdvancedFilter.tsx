// src/components/shared/AdvancedFilter.tsx
import { Search as SearchIcon, RotateCcw } from "lucide-react";
import { useId } from "react";

interface ClearButtonProps {
  onClear: () => void;
  isVisible: boolean;
}

type SelectOption = {
  label: string;
  value: string;
};

type DateRange = {
  from: string;
  to: string;
};

type AdvancedFilterProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  selects?: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
  }[];
  dateRange?: DateRange;
  onDateChange?: (range: DateRange) => void;
  onClear: () => void;
  className?: string;
};

const ClearButton = ({ onClear, isVisible }: ClearButtonProps) => {
  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={onClear}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-choco dark:text-cream/50 hover:text-cream rounded-full p-1.5 transition-colors duration-200 bg-cream/10 dark:bg-cream/10 z-10"
      title="Limpiar búsqueda"
    >
      <RotateCcw className="size-4" />
    </button>
  );
};

export const AdvancedFilter = ({
  searchValue,
  onSearchChange,
  selects = [],
  dateRange,
  onDateChange,
  onClear,
  className = "",
}: AdvancedFilterProps) => {
  const fromId = useId();
  const toId = useId();

  const isFilterActive =
    !!searchValue.trim() ||
    selects.some((select) => !!select.value) ||
    (dateRange && (dateRange.from || dateRange.to));

  return (
    <div
      className={`flex flex-col lg:flex-row items-end justify-between gap-3 w-full ${className}`}
    >
      {/* Input de búsqueda - Se cambió lg:flex-1 por lg:flex-[2.5] para recuperar su ancho original */}
      <div className="flex flex-col gap-1 w-full lg:flex-[2.5] min-w-[240px] max-w-sm">
        <span className="text-sm font-medium opacity-0 hidden md:block select-none">
          &nbsp;
        </span>
        <div className="relative">
          <SearchIcon
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-choco dark:text-cream/60"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar por nombre o término..."
            className="w-full rounded-lg border border-cocoa/30 dark:border-cream/30 bg-transparent pl-10 pr-10 py-2 text-sm focus:ring-2 focus:ring-cocoa/50 dark:focus:ring-cream/70 placeholder:text-choco/60 dark:placeholder:text-cream/60 text-choco dark:text-cream h-[38px]"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <ClearButton onClear={onClear} isVisible={!!isFilterActive} />
        </div>
      </div>

      {/* Selects dinámicos */}
      {selects.map((select, idx) => (
        <div
          key={idx}
          className="flex flex-col gap-1 w-full lg:w-auto lg:flex-1 min-w-[160px] max-w-xs"
        >
          <span className="text-sm font-medium opacity-0 hidden md:block select-none">
            &nbsp;
          </span>
          <select
            value={select.value}
            onChange={(e) => select.onChange(e.target.value)}
            className="w-full rounded-lg border border-cocoa/30 dark:border-cream/30 bg-fondo dark:bg-fondo-dark px-3 py-2 text-sm text-choco dark:text-cream focus:ring-2 focus:ring-cocoa/50 dark:focus:ring-cream/70 cursor-pointer h-[38px]"
          >
            <option value="">{select.label}</option>
            {select.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}

      {/* Rango de fechas */}
      {onDateChange && dateRange && (
        <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto lg:flex-1">
          <div className="flex flex-col gap-1 flex-1 min-w-[130px]">
            <label
              htmlFor={fromId}
              className="text-sm font-medium text-choco dark:text-cream"
            >
              Desde
            </label>
            <input
              id={fromId}
              type="date"
              value={dateRange.from}
              onChange={(e) =>
                onDateChange({ ...dateRange, from: e.target.value })
              }
              className="w-full rounded-lg border border-cocoa/30 dark:border-cream/30 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-cocoa/50 dark:focus:ring-cream/70 text-choco dark:text-cream h-[38px]"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-[130px]">
            <label
              htmlFor={toId}
              className="text-sm font-medium text-choco dark:text-cream"
            >
              Hasta
            </label>
            <input
              id={toId}
              type="date"
              value={dateRange.to}
              onChange={(e) =>
                onDateChange({ ...dateRange, to: e.target.value })
              }
              className="w-full rounded-lg border border-cocoa/30 dark:border-cream/30 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-cocoa/50 dark:focus:ring-cream/70 text-choco dark:text-cream h-[38px]"
            />
          </div>
        </div>
      )}
    </div>
  );
};