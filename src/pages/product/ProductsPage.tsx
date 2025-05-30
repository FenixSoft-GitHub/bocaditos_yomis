import { CardProduct } from "@/components/products/CardProduct";
import { useEffect, useState } from "react";
import { useCategories } from "@/hooks/categories/useCategories";
import { useFilteredProducts } from "@/hooks/products/useFilteredProducts";
import { Pagination } from "@/components/shared/Pagination";
import { Loader } from "@/components/shared/Loader";
import { SelectFilter } from "@/components/shared/SelectFilter";

const ProductsPage = () => {
  const [page, setPage] = useState(1);
  // Nuevo estado
  const [searchTerm, setSearchTerm] = useState("");
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
    category: selectedCategories || "",
    search: searchTerm,
  });

  const handleResetFilter = () => {
    setSearchTerm("");
    setSelectedCategories(null);
    setPage(1);
  };

  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCategories]);

  // const handleCategoryChange = (categories: string | null) => {
  //   setSelectedCategories(categories);
  //   setPage(1); // Reset page when filter changes
  // };

  // const handleResetFilter = () => {
  //   setSelectedCategories(null);
  //   setPage(1);
  // };

  if (isLoading || isLoadingCategories) return <Loader size={60} />;
  if (isErrorCategories) return <div>Error</div>;
  if (!categoriesSelect || categoriesSelect.length === 0)
    return <div>No categories found</div>;

  return (
    <section className="container mx-auto text-choco dark:text-cream dark:bg-fondo-dark">
      <div className="flex flex-col md:items-center md:justify-between gap-4 mb-4">
        {/* Header y filtro */}
        <div className="w-full mb-4 mt-28 lg:mt-42 flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl md:text-4xl font-bold md:text-left drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)] ">
              Artículos
            </h1>
          </div>

          <div className="flex-1 min-w-0">
            <SelectFilter
              key={`${searchTerm}-${selectedCategories}`} // Forzar re-render si cambia alguno
              search={searchTerm}
              onSearchChange={(value) => {
                setSearchTerm(value);
                // setPage(1);
              }}
              selectedCategory={selectedCategories}
              onCategoryChange={(value) => {
                setSelectedCategories(value);
                // setPage(1);
              }}
              categories={categoriesSelect.map((c) => c.name)}
              onReset={handleResetFilter}
            />
          </div>
        </div>

        {/* Grid de productos */}
        <div>
          {products.length === 0 ? (
            <div className="text-center text-gray-500 py-20 dark:text-gray-100">
              No se encontraron productos.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="keen-slider__slide shrink-0 min-w-0 transition-transform duration-200"
                >
                  <CardProduct product={product} />
                </div>
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


// import { CardProduct } from "@/components/products/CardProduct";
// import { useState } from "react";
// import { useCategories } from "@/hooks/categories/useCategories";
// import { useFilteredProducts } from "@/hooks/products/useFilteredProducts";
// import { Pagination } from "@/components/shared/Pagination";
// import { Loader } from "@/components/shared/Loader";
// import { SelectFilter } from "@/components/shared/SelectFilter";

// const ProductsPage = () => {
//   const [page, setPage] = useState(1);
//   const [selectedCategories, setSelectedCategories] = useState<string | null>(
//     null
//   );

//   const {
//     categories: categoriesSelect,
//     isLoading: isLoadingCategories,
//     isError: isErrorCategories,
//   } = useCategories();

//   const {
//     data: products = [],
//     isLoading,
//     totalProducts,
//   } = useFilteredProducts({
//     page,
//     category: selectedCategories ? selectedCategories : "",
//   });

//   const handleCategoryChange = (categories: string | null) => {
//     setSelectedCategories(categories);
//     setPage(1); // Reset page when filter changes
//   };

//   const handleResetFilter = () => {
//     setSelectedCategories(null);
//     setPage(1);
//   };

//   if (isLoading || isLoadingCategories) return <Loader size={60} />;
//   if (isErrorCategories) return <div>Error</div>;
//   if (!categoriesSelect || categoriesSelect.length === 0)
//     return <div>No categories found</div>;

//   return (
//     <section className="container mx-auto text-choco dark:text-cream dark:bg-fondo-dark">
//       <div className="flex flex-col md:items-center md:justify-between gap-4 mb-4">
//         {/* Header y filtro */}
//         <div className="w-full mb-4 mt-28 lg:mt-42 flex flex-col lg:flex-row justify-center items-center lg:justify-between  gap-4 md:gap-0">
//           <h1 className="text-3xl md:text-4xl font-bold md:text-left drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)] ">
//             Artículos
//           </h1>

//           <SelectFilter
//             label="Filtrar por Categorías:"
//             options={categoriesSelect.map((c) => c.name)}
//             selectedValue={selectedCategories}
//             onChange={handleCategoryChange}
//             onReset={handleResetFilter}
//             placeholder="Todas las categorías"
//           />
//         </div>

//         {/* Grid de productos */}
//         <div>
//           {products.length === 0 ? (
//             <div className="text-center text-gray-500 py-20 dark:text-gray-100">
//               No se encontraron productos.
//             </div>
//           ) : (
//             <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
//               {products.map((product) => (
//                 <div
//                   key={product.id}
//                   className="keen-slider__slide shrink-0 min-w-0 transition-transform duration-200"
//                 >
//                   <CardProduct product={product} />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//       {/* Paginación */}
//       <div className="my-10">
//         <Pagination page={page} totalItems={totalProducts} setPage={setPage} />
//       </div>
//     </section>
//   );
// };

