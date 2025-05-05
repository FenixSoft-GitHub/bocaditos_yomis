import { CardProduct } from "@/components/products/CardProduct";
// import { useProduct } from "@/hooks";
import { useState } from "react";
import { useCategories } from "@/hooks/products/useCategories";
import { CategoriesFilter } from "@/components/products/CategoriesFilter";
import { useFilteredProducts } from "@/hooks/products/useFilteredProducts";
import { Pagination } from "@/components/shared/Pagination";
import { Loader } from "@/components/shared/Loader";

const ProductsPage = () => {
  const [page, setPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string | null>(
    null
  );

  const {
    categories: categoriesSelect,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useCategories();

  const {
    data: products = [],
    isLoading,
    totalProducts,
  } = useFilteredProducts({
    page,
    category: selectedCategories ? selectedCategories : "",
  });

  const handleCategoryChange = (categories: string | null) => {
    setSelectedCategories(categories);
    setPage(1); // Reset page when filter changes
  };

  const handleResetFilter = () => {
    setSelectedCategories(null);
    setPage(1);
  };

  if (isLoading || isLoadingCategories) return <Loader size={60} />;
  if (isErrorCategories) return <div>Error</div>;
  if (!categoriesSelect || categoriesSelect.length === 0)
    return <div>No categories found</div>;

  return (
    <section className="container mx-auto text-choco dark:text-cream dark:bg-fondo-dark">
      <div className="flex flex-col md:items-center md:justify-between gap-4 mb-4">
        {/* Header y filtro */}
        <div className="w-full mb-4 mt-28 lg:mt-42 flex flex-col lg:flex-row justify-center items-center lg:justify-between  gap-4 md:gap-0">
          <h1 className="text-3xl md:text-4xl font-bold md:text-left drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)] ">
            Artículos
          </h1>

          {/* Usa el componente BrandFilter */}
          <CategoriesFilter
            categories={categoriesSelect.map((c) => c.name)}
            onCategoryChange={handleCategoryChange}
            onResetFilter={handleResetFilter}
            initialCategory={selectedCategories}
          />
        </div>

        {/* Grid de productos */}
        <div>
          {products.length === 0 ? (
            <div className="text-center text-gray-500 py-20 dark:text-gray-100">
              No se encontraron productos.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <CardProduct key={index} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Paginación */}
      <div className="my-10">
        <Pagination page={page} totalItems={totalProducts} setPage={setPage} />
      </div>
    </section>
  );
};

export default ProductsPage;