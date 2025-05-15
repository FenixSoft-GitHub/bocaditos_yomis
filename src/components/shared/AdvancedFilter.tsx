import { HiOutlineSearch } from "react-icons/hi";
import { useId } from "react";
import { GrPowerReset } from "react-icons/gr";

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
      className={`flex flex-col sm:flex-row sm:flex-wrap gap-y-3 sm:gap-3 items-stretch w-full ${className}`}
    >
      {/* Input de búsqueda */}
      <div className="relative w-1/3 lg:w-full sm:flex-1 min-w-[220px]">
        <HiOutlineSearch
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-choco dark:text-cream"
          size={20}
        />
        <input
          type="text"
          placeholder="Buscar por nombre o término..."
          className="w-full rounded-lg border border-cocoa/30 dark:border-cream/30 bg-transparent pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-cocoa/50 dark:focus:ring-cream/70 placeholder:text-choco/60 dark:placeholder:text-cream/60"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Selects dinámicos */}
      {selects.map((select, idx) => (
        <div key={idx} className="w-1/3 lg:w-full sm:flex-1 min-w-[220px]">
          <select
            value={select.value}
            onChange={(e) => select.onChange(e.target.value)}
            className="w-full rounded-lg border border-cocoa/30 dark:border-cream/30 bg-transparent px-3 py-2 text-sm text-choco dark:text-cream focus:ring-2 focus:ring-cocoa/50 dark:focus:ring-cream/70"
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
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:flex-1 min-w-[220px]">
          <div className="flex flex-col text-sm text-choco dark:text-cream flex-1 w-1/3 min-w-[220px] sm:min-w-[110px] sm:w-full">
            <label htmlFor={fromId} className="mb-1">
              Desde
            </label>
            <input
              id={fromId}
              type="date"
              value={dateRange.from}
              onChange={(e) =>
                onDateChange({ ...dateRange, from: e.target.value })
              }
              className="rounded-lg border border-cocoa/30 dark:border-cream/30 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-cocoa/50 dark:focus:ring-cream/70"
            />
          </div>
          <div className="flex flex-col text-sm text-choco dark:text-cream flex-1 w-1/3 min-w-[220px] sm:min-w-[110px] sm:w-full">
            <label htmlFor={toId} className="mb-1">
              Hasta
            </label>
            <input
              id={toId}
              type="date"
              value={dateRange.to}
              onChange={(e) =>
                onDateChange({ ...dateRange, to: e.target.value })
              }
              className="rounded-lg border border-cocoa/30 dark:border-cream/30 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-cocoa/50 dark:focus:ring-cream/70"
            />
          </div>
        </div>
      )}

      {/* Botón limpiar */}
      {isFilterActive && (
        <div className="w-full sm:w-auto flex ml-2 items-end">
          <button
            onClick={onClear}
            className="text-cream dark:text-choco hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer rounded-full bg-choco w-10 h-10 dark:bg-cream/70"
            title="Limpiar filtro"
          >
            <GrPowerReset className="size-5" />
          </button>
        </div>
      )}
    </div>
  );
};