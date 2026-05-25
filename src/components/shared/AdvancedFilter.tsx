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
      className={`flex flex-col md:flex-row items-end justify-between ${className} -mb-1`}
    >
      {/* Input de búsqueda */}
      <div className="flex flex-col gap-1 flex-[2] min-w-[240px] max-w-sm">
        <span className="text-sm font-medium text-choco dark:text-cream invisible md:block">
          &nbsp;
        </span>
        <div className="relative">
          <SearchIcon
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-choco dark:text-cream"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar por nombre o término..."
            className="w-full rounded-lg border border-cocoa/30 dark:border-cream/30 bg-transparent pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-cocoa/50 dark:focus:ring-cream/70 placeholder:text-choco/60 dark:placeholder:text-cream/60 text-choco dark:text-cream"
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
          className="flex flex-col gap-1 flex-1 min-w-[160px] max-w-xs"
        >
          <span className="text-sm font-medium text-choco dark:text-cream invisible md:block">
            &nbsp;
          </span>
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
        <>
          <div className="flex flex-col text-sm text-choco dark:text-cream gap-2 w-full md:flex-row md:gap-4 flex-1 min-w-[240px] max-w-sm justify-end">
            <div className="flex flex-col gap-1 flex-1 min-w-[150px] max-w-min">
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
                className="w-full rounded-lg border border-cocoa/30 dark:border-cream/30 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-cocoa/50 dark:focus:ring-cream/70 text-choco dark:text-cream"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-[150px] max-w-min">
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
                className="w-full rounded-lg border border-cocoa/30 dark:border-cream/30 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-cocoa/50 dark:focus:ring-cream/70 text-choco dark:text-cream"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};