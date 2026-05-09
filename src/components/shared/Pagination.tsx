import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  totalItems: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const ITEMS_PER_PAGE = 8;

export const Pagination = ({ totalItems, page, setPage }: Props) => {
  const totalPages = totalItems ? Math.ceil(totalItems / ITEMS_PER_PAGE) : 1;
  const isFirst = page === 1;
  const isLast = page >= totalPages;
  const startItem = (page - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(page * ITEMS_PER_PAGE, totalItems);

  const handlePrev = () => {
    window.scrollTo(0, 0);
    setPage((p) => Math.max(p - 1, 1));
  };
  const handleNext = () => {
    window.scrollTo(0, 0);
    setPage((p) => p + 1);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      <p className="text-xs text-choco/70 dark:text-cream/60">
        Mostrando{" "}
        <span className="font-semibold text-choco dark:text-cream">
          {startItem}–{endItem}
        </span>{" "}
        de{" "}
        <span className="font-semibold text-choco dark:text-cream">
          {totalItems}
        </span>{" "}
        productos
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrev}
          disabled={isFirst}
          className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
          aria-label="Página anterior"
        >
          <ChevronLeft className="size-4" />
          <span>Anterior</span>
        </button>
        <span className="text-sm font-medium px-3 py-1.5 rounded-lg bg-choco/10 dark:bg-cream/10 text-choco dark:text-cream min-w-[3rem] text-center">
          {page} / {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={isLast}
          className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
          aria-label="Página siguiente"
        >
          <span>Siguiente</span>
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
};
