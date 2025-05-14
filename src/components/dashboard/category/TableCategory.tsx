import { Loader } from "@/components/shared/Loader";
import { useCategories, useDeleteCategory } from "@/hooks";
import { useState } from "react";
import { CellTableProduct } from "../products/CellTableProduct";
import { formatDate } from "@/helpers";
import { Link, useNavigate } from "react-router-dom";
import { MdAddCircleOutline } from "react-icons/md";
import { DropdownMenu } from "@/components/shared/DropdownMenu";
import { AdvancedFilter } from "@/components/shared/AdvancedFilter";

const tableHeaders = ["Nombre", "Descripción", "Fecha de creación", ""];

export const TableCategory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const { categories, isLoading } = useCategories();
  const { mutate: deleteCat, isPending } = useDeleteCategory();

  if (!categories || isLoading || isPending) return <Loader size={60} />;

  const filteredCategories = categories.filter(
    (category) =>
      category.name &&
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full min-h-[500px] bg-fondo dark:bg-fondo-dark text-choco dark:text-cream border border-cocoa/30 dark:border-cream/30 rounded-lg px-3 py-2 gap-3">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="w-full sm:w-auto">
          <h1 className="text-xl font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]">
            Categorías
          </h1>
          <p className="text-xs mb-1 font-regular">
            Administración de Categorías
          </p>
        </div>

        <div className="w-full sm:max-w-md">
          <AdvancedFilter
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            onClear={() => setSearchTerm("")}
          />
        </div>

        <div className="w-full sm:w-auto flex sm:justify-end">
          <Link
            to="/dashboard/category/new"
            className="inline-flex items-center min-w-[220px] gap-2 px-4 py-2 bg-cocoa hover:bg-cocoa/90 text-white text-sm font-medium rounded-md transition justify-center"
          >
            <MdAddCircleOutline size={20} className="inline-block mr-1" />
            Nueva Categoría
          </Link>
        </div>
      </div>

      {/* Tabla */}
      <div className="relative w-full h-full overflow-x-auto">
        <table className="min-w-[600px] text-sm w-full caption-bottom sm:table-auto">
          <thead className="bg-cocoa/20 dark:bg-cream/10 text-choco dark:text-cream text-xs uppercase tracking-wide">
            <tr className="bg-cocoa/30 dark:bg-cream/30 text-choco dark:text-cream rounded-md">
              {tableHeaders.map((header, index) => (
                <th
                  key={index}
                  className={`px-2 sm:px-4 py-2 font-semibold text-center ${index === 0 ? "rounded-l-md" : ""
                    } ${index === tableHeaders.length - 1 ? "rounded-r-md" : ""
                    }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          {filteredCategories.length === 0 ? (
            <tbody>
              <tr>
                <td
                  colSpan={tableHeaders.length}
                  className="text-center py-10 text-choco dark:text-cream"
                >
                  No se encontraron productos con ese término.
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {filteredCategories.map((category, index) => {
                return (
                  <tr key={index}>
                    <CellTableProduct
                      content={category.name}
                      className="text-left"
                    />

                    <CellTableProduct
                      content={category.description}
                      className="text-left"
                    />

                    <CellTableProduct
                      className="text-center"
                      content={formatDate(category.created_at as string)}
                    />

                    <td className="relative">
                      <DropdownMenu
                        onEdit={() =>
                          navigate(
                            `/dashboard/category/edit/${category.id}`
                          )
                        }
                        onDelete={() => deleteCat(category.id)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};
