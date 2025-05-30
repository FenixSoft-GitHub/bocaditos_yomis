import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDeleteProduct, useProductPages, useProductsAll } from "@/hooks";
import { Loader } from "@/components/shared/Loader";
import { formatDate, formatPrice } from "@/helpers";
import { Pagination } from "@/components/shared/Pagination";
import { CellTableProduct } from "@/components/dashboard";
import { MdAddCircleOutline } from "react-icons/md";
import { DropdownMenu } from "@/components/shared/DropdownMenu";
import { AdvancedFilter } from "@/components/shared/AdvancedFilter";
import { getDiscountedPrice, isDiscountActive } from "@/lib/discount";

const tableHeaders = [
  "Imagen",
  "Nombre",
  "Categoria",
  "Precio",
  "Stock",
  "Fecha de creación",
  "",
];

export const TableProduct = () => {
  const [filters, setFilters] = useState({ name: "", category: "" });

  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const { products, isLoading, totalProducts } = useProductPages({ page });
  const { productsAll, isLoading: isLoadingAll } = useProductsAll();
  const { mutate: deleteProduct, isPending } = useDeleteProduct();

  if (
    !products ||
    isLoading ||
    !totalProducts ||
    isLoadingAll ||
    !productsAll ||
    isPending
  )
    return <Loader size={60} />;

  const shouldFilter = filters.name !== "" || filters.category !== "";
  const filteredProducts = (shouldFilter ? productsAll : products).filter(
    (product) => {
      const nameMatch = product.name
        .toLowerCase()
        .includes(filters.name.toLowerCase());
      const categoryMatch = product.categories.name
        .toLowerCase()
        .includes(filters.category.toLowerCase());
      return nameMatch && categoryMatch;
    }
  );

  return (
    <div className="flex flex-col h-full min-h-[500px] bg-fondo dark:bg-fondo-dark text-choco dark:text-cream border border-cocoa/30 dark:border-cream/30 rounded-lg px-3 py-2 gap-3">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div className="flex gap-1 flex-col">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]">
              Productos
            </h1>
            <p className="text-xs mb-1 font-regular">
              Gestiona tus productos y mira las estadísticas de tus ventas
            </p>
          </div>
          <Link
            to="/dashboard/product/new"
            className="inline-flex w-fit items-center gap-2 px-4 py-2 bg-cocoa hover:bg-cocoa/90 text-white text-sm font-medium rounded-md transition"
          >
            <MdAddCircleOutline size={20} className="inline-block mr-1" />
            Nuevo Producto
          </Link>
        </div>

        <div className="w-full sm:max-w-sm relative">
          <AdvancedFilter
            searchValue={filters.name}
            onSearchChange={(value) =>
              setFilters((prev) => ({ ...prev, name: value }))
            }
            selects={[
              {
                label: "Filtrar por categoría",
                value: filters.category,
                onChange: (value) =>
                  setFilters((prev) => ({ ...prev, category: value })),
                options: Array.from(
                  new Set(productsAll.map((p) => p.categories.name))
                ).map((cat) => ({
                  label: cat,
                  value: cat,
                })),
              },
            ]}
            onClear={() => setFilters({ name: "", category: "" })}
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="relative w-full h-full overflow-x-auto">
        <table className="min-w-[600px] text-sm w-full caption-bottom ">
          <thead className="bg-cocoa/20 dark:bg-cream/10 text-choco dark:text-cream text-xs uppercase tracking-wide">
            <tr className="bg-cocoa/30 dark:bg-cream/30 text-choco dark:text-cream rounded-md">
              {tableHeaders.map((header, index) => (
                <th
                  key={index}
                  className={`px-2 sm:px-4 py-2 font-semibold text-center ${
                    index === 0 ? "rounded-l-md" : ""
                  } ${index === tableHeaders.length - 1 ? "rounded-r-md" : ""}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          {filteredProducts.length === 0 ? (
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
              <tr>
                <td colSpan={tableHeaders.length} className="h-1"></td>
              </tr>
              {filteredProducts.map((product, index) => {
                return (
                  <tr key={index}>
                    <td className="px-2 py-1 flex items-center gap-1">
                      <img
                        src={
                          product.image_url[0] ||
                          "https://ui.shadcn.com/placeholder.svg"
                        }
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        className="size-[52px] rounded-md object-conver border border-cocoa/70 dark:border-cream/70"
                      />
                    </td>
                    <CellTableProduct
                      content={product.name}
                      className="text-left"
                    />
                    <CellTableProduct
                      content={product.categories.name}
                      className="text-left"
                    />
                    {/* <CellTableProduct
                      className="text-right"
                      content={formatPrice(product?.price)}
                    /> */}

                    {/* <CellTableProduct className="text-right"> */}

                    {isDiscountActive(product.discounts[0]) ? (
                      <td className="table-cell px-4 py-2 font-medium tracking-tighter text-right align-middle">
                        <div className="flex flex-col items-end justify-center">
                          <span className="line-through text-xs text-gray-500 dark:text-gray-400">
                            {formatPrice(product.price)}
                          </span>
                          <span className="text-amber-500 font-bold">
                            {formatPrice(
                              getDiscountedPrice(
                                product.price,
                                product.discounts[0]
                              )
                            )}
                          </span>
                        </div>
                      </td>
                    ) : (
                      <td className="px-4 py-2 font-medium tracking-tighter text-right align-middle">
                        <span>{formatPrice(product.price)}</span>
                      </td>
                    )}

                    {/* </CellTableProduct> */}

                    <CellTableProduct
                      className={
                        product.stock === 0
                          ? "text-center text-red-500/80 font-semibold"
                          : "text-center"
                      }
                      content={(product.stock || 0).toString()}
                    />
                    <CellTableProduct
                      className="text-center"
                      content={formatDate(product.created_at as string)}
                    />
                    <td className="relative">
                      <DropdownMenu
                        onEdit={() =>
                          navigate(`/dashboard/product/edit/${product.id}`)
                        }
                        onDelete={() => deleteProduct(product.id)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>

      {/* Footer fijo con paginación */}

      {(filteredProducts.length > 8 ||
        (!filters.name && !filters.category)) && (
        <div className="mt-auto pt-2 border-t border-cocoa/50 dark:border-cream/30">
          <Pagination
            page={page}
            setPage={setPage}
            totalItems={totalProducts}
          />
        </div>
      )}
    </div>
  );
};
