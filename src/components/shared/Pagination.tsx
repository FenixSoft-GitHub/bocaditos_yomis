import { GrFormNext, GrFormPrevious } from "react-icons/gr";

interface Props {
  totalItems: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export const Pagination = ({ totalItems, page, setPage }: Props) => {
  const handleNextPage = () => {
    window.scrollTo(0, 0);
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    window.scrollTo(0, 0);
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const itemsPerPage = 8;
  const totalPages = totalItems ? Math.ceil(totalItems / itemsPerPage) : 1;
  const isLastPage = page >= totalPages;

  const startItem = (page - 1) * itemsPerPage + 1; // 1 -> 11 -> 21
  const endItem = Math.min(page * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center">
      <p className="text-xs font-medium mb-5 sm:mb-0">
        Mostrando{" "}
        <span className="font-bold">
          {startItem} - {endItem}
        </span>{" "}
        de <span className="font-bold"> {totalItems}</span> productos
      </p>
      <div className="flex gap-6 items-center">
        <button
          className="inline-flex items-center gap-2 px-4 py-2 bg-cocoa hover:bg-cocoa/90 text-white text-sm font-medium rounded-md transition"
          onClick={handlePrevPage}
          disabled={page === 1}
        >
          <GrFormPrevious className="text-xl" />
          <span>Anterior</span>
        </button>

        <button
          className="inline-flex items-center gap-2 px-4 py-2 bg-cocoa hover:bg-cocoa/90 text-white text-sm font-medium rounded-md transition"
          onClick={handleNextPage}
          disabled={isLastPage}
        >
          <span>Siguiente</span>
          <GrFormNext className="text-xl " />
        </button>
      </div>
    </div>
  );
};
