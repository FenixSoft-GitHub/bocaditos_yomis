import { CardProduct } from "@/components/products/CardProduct";
import { useEffect, useState } from "react";
import { useCategories } from "@/hooks/categories/useCategories";
import { useFilteredProducts } from "@/hooks/products/useFilteredProducts";
import { Pagination } from "@/components/shared/Pagination";
import { SEOHead } from "@/components/seo/SEOHead";
import { breadcrumbSchema } from "@/components/seo/schemas";
import { Loader } from "@/components/shared/Loader";
import {
  PageTransition,
  StaggerList,
  StaggerItem,
} from "@/components/animations";
import { Search, RotateCcw, SlidersHorizontal, X } from "lucide-react";

const ProductsPage = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

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
    category: selectedCategory || "",
    search: searchTerm,
  });

  const hasActiveFilters = searchTerm !== "" || selectedCategory !== null;

  const handleReset = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setPage(1);
  };

  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCategory]);

  if (isLoadingCategories) return <Loader size={60} />;
  if (isErrorCategories)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error al cargar las categorías
      </div>
    );

  return (
    <>
      <SEOHead
        title="Todos los Productos"
        description="Explora toda nuestra selección de snacks, golosinas y bocaditos artesanales. Filtra por categoría y encuentra tu favorito."
        canonical="/products"
        ogType="website"
        schema={breadcrumbSchema([
          { name: "Inicio", url: "/" },
          { name: "Productos", url: "/products" },
        ])}
      />

      <PageTransition>
        <div className="container mx-auto px-4 py-8 text-choco dark:text-cream">
          {/* ── Header de página ───────────────────────────────────── */}
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-cocoa dark:text-cocoa mb-1">
              Bocaditos Yomi's
            </p>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-choco dark:text-cream">
                  Nuestros Productos
                </h1>
                <p className="text-sm text-choco/60 dark:text-cream/60 mt-1">
                  {isLoading ? (
                    "Cargando..."
                  ) : (
                    <>
                      <span className="font-semibold text-choco dark:text-cream">
                        {totalProducts ?? 0}
                      </span>{" "}
                      {hasActiveFilters
                        ? "resultados encontrados"
                        : "productos disponibles"}
                    </>
                  )}
                </p>
              </div>

              {/* Botón filtros en móvil */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`sm:hidden inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                  hasActiveFilters
                    ? "border-choco bg-choco text-cream dark:border-cream dark:bg-cream dark:text-oscuro"
                    : "border-cocoa/30 dark:border-cream/20 text-choco/70 dark:text-cream/70 hover:bg-choco/10"
                }`}
              >
                <SlidersHorizontal className="size-4" />
                Filtros
                {hasActiveFilters && (
                  <span className="w-5 h-5 rounded-full bg-cream dark:bg-choco text-choco dark:text-cream text-[10px] font-bold flex items-center justify-center">
                    {[searchTerm, selectedCategory].filter(Boolean).length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* ── Filtros ─────────────────────────────────────────────── */}
          <div className={`mb-6 ${showFilters ? "block" : "hidden sm:block"}`}>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              {/* Buscador */}
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-choco/40 dark:text-cream/40 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar producto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-cocoa/30 dark:border-cream/20 rounded-xl bg-cream dark:bg-oscuro text-choco dark:text-cream placeholder:text-choco/40 dark:placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-choco/20 dark:focus:ring-cream/20"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-choco/40 hover:text-choco transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              {/* Chips de categoría */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    selectedCategory === null
                      ? "bg-choco text-cream dark:bg-cream dark:text-oscuro shadow-sm"
                      : "bg-cream dark:bg-oscuro border border-cocoa/30 dark:border-cream/20 text-choco/70 dark:text-cream/70 hover:border-choco dark:hover:border-cream/60"
                  }`}
                >
                  Todos
                </button>
                {categoriesSelect?.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all duration-200 ${
                      selectedCategory === cat.name
                        ? "bg-choco text-cream dark:bg-cream dark:text-oscuro shadow-sm"
                        : "bg-cream dark:bg-oscuro border border-cocoa/30 dark:border-cream/20 text-choco/70 dark:text-cream/70 hover:border-choco dark:hover:border-cream/60"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}

                {/* Reset */}
                {hasActiveFilters && (
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-red-500 dark:text-red-400 border border-red-200 dark:border-red-800/50 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <RotateCcw className="size-3" />
                    Limpiar
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Grid de productos ──────────────────────────────────── */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-cocoa/20 dark:border-cream/10 bg-cream dark:bg-fondo-dark overflow-hidden animate-pulse"
                >
                  <div className="aspect-square bg-cocoa/10 dark:bg-cream/5" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-cocoa/10 dark:bg-cream/10 rounded-full w-3/4" />
                    <div className="h-4 bg-cocoa/10 dark:bg-cream/10 rounded-full w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            /* Estado vacío */
            <div className="flex flex-col items-center justify-center py-24 gap-5 text-choco/40 dark:text-cream/40">
              <img
                src="/img/misc/Search2.webp"
                alt="Sin resultados"
                className="w-36 rounded-2xl opacity-70"
              />
              <div className="text-center space-y-1">
                <p className="font-semibold text-base text-choco dark:text-cream">
                  No encontramos productos
                </p>
                <p className="text-sm">
                  Intenta con otros términos o categorías
                </p>
              </div>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-choco text-cream dark:bg-cream dark:text-oscuro text-sm font-semibold hover:bg-cocoa dark:hover:bg-butter transition-all"
              >
                <RotateCcw className="size-4" />
                Ver todos los productos
              </button>
            </div>
          ) : (
            <StaggerList className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <StaggerItem key={product.id}>
                  <CardProduct product={product} />
                </StaggerItem>
              ))}
            </StaggerList>
          )}

          {/* ── Paginación ─────────────────────────────────────────── */}
          {!isLoading && products.length > 0 && (
            <div className="my-5 pt-4 border-t border-cocoa/10 dark:border-cream/10">
              <Pagination
                page={page}
                totalItems={totalProducts}
                setPage={setPage}
              />
            </div>
          )}
        </div>
      </PageTransition>
    </>
  );
};

export default ProductsPage;

// import { CardProduct } from "@/components/products/CardProduct";
// import { useEffect, useState } from "react";
// import { useCategories } from "@/hooks/categories/useCategories";
// import { useFilteredProducts } from "@/hooks/products/useFilteredProducts";
// import { Pagination } from "@/components/shared/Pagination";
// import { Loader } from "@/components/shared/Loader";
// import { SelectFilter } from "@/components/shared/SelectFilter";

// const ProductsPage = () => {
//   const [page, setPage] = useState(1);
//   // Nuevo estado
//   const [searchTerm, setSearchTerm] = useState("");
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
//     category: selectedCategories || "",
//     search: searchTerm,
//   });

//   const handleResetFilter = () => {
//     setSearchTerm("");
//     setSelectedCategories(null);
//     setPage(1);
//   };

//   useEffect(() => {
//     setPage(1);
//   }, [searchTerm, selectedCategories]);

//   if (isLoading || isLoadingCategories) return <Loader size={60} />;
//   if (isErrorCategories) return <div>Error</div>;
//   if (!categoriesSelect || categoriesSelect.length === 0)
//     return <div>No categories found</div>;

//   return (
//     <section className="container mx-auto text-choco dark:text-cream dark:bg-fondo-dark">
//       <div className="flex flex-col md:items-center md:justify-between gap-4 mb-4 mt-8">
//         {/* Header y filtro */}
//         <div className="w-full mb-4 flex flex-col lg:flex-row justify-between items-center gap-4">
//           <div className="flex-1 min-w-0">
//             <h1 className="text-3xl md:text-4xl font-bold md:text-left drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)] ">
//               Artículos
//             </h1>
//           </div>

//           <div className="flex-1 min-w-0">
//             <SelectFilter
//               key={`${searchTerm}-${selectedCategories}`} // Forzar re-render si cambia alguno
//               search={searchTerm}
//               onSearchChange={(value) => {
//                 setSearchTerm(value);
//                 // setPage(1);
//               }}
//               selectedCategory={selectedCategories}
//               onCategoryChange={(value) => {
//                 setSelectedCategories(value);
//                 // setPage(1);
//               }}
//               categories={categoriesSelect.map((c) => c.name)}
//               onReset={handleResetFilter}
//             />
//           </div>
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

// export default ProductsPage;
