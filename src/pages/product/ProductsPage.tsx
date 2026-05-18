import { CardProduct } from "@/components/products/CardProduct";
import { useEffect, useRef, useState } from "react";
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
import { Search, RotateCcw, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MAX_VISIBLE_CHIPS = 10;

const ProductsPage = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [overflowOpen, setOverflowOpen] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const overflowRef = useRef<HTMLDivElement>(null);

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
    setAnimationKey((k) => k + 1);
  };

  const handleCategorySelect = (cat: string | null) => {
    setSelectedCategory(cat);
    setOverflowOpen(false);
    setPage(1);
    setAnimationKey((k) => k + 1);
  };

  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        overflowRef.current &&
        !overflowRef.current.contains(e.target as Node)
      )
        setOverflowOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  if (isLoadingCategories) return <Loader size={60} />;
  if (isErrorCategories)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error al cargar las categorías
      </div>
    );

  const allCategories = categoriesSelect ?? [];
  const visibleCategories = allCategories.slice(0, MAX_VISIBLE_CHIPS);
  const overflowCategories = allCategories.slice(MAX_VISIBLE_CHIPS);
  const hasOverflow = overflowCategories.length > 0;
  const selectedInOverflow = selectedCategory
    ? overflowCategories.some((c) => c.name === selectedCategory)
    : false;

  return (
    <>
      <SEOHead
        title="Todos los Productos"
        description="Explora toda nuestra selección de snacks, golosinas y bocaditos artesanales."
        canonical="/products"
        ogType="website"
        schema={breadcrumbSchema([
          { name: "Inicio", url: "/" },
          { name: "Productos", url: "/products" },
        ])}
      />

      <PageTransition>
        <div className="container mx-auto px-4 py-8 text-choco dark:text-cream">
          {/* Header */}
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-cocoa mb-1">
              Bocaditos Yomi's
            </p>
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

          {/* Filtros */}
          <div className="mb-8 flex flex-col gap-3">
            {/* Buscador */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-choco/40 dark:text-cream/40 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 text-sm border border-cocoa/30 dark:border-cream/20 rounded-xl bg-cream dark:bg-oscuro text-choco dark:text-cream placeholder:text-choco/40 dark:placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-choco/20 dark:focus:ring-cream/20"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-choco/40 hover:text-choco dark:text-cream/40 dark:hover:text-cream transition-colors"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* Fila 2: Chips de categoría — scroll horizontal sin cortar dropdown */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 relative">
              {/* Chip "Todos" */}
              <button
                onClick={() => handleCategorySelect(null)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                  selectedCategory === null
                    ? "bg-choco text-cream dark:bg-cream dark:text-oscuro shadow-sm"
                    : "bg-cream dark:bg-oscuro border border-cocoa/30 dark:border-cream/20 text-choco/70 dark:text-cream/70 hover:border-choco dark:hover:border-cream/60"
                }`}
              >
                Todos
              </button>

              {/* Chips visibles */}
              {visibleCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.name)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all duration-200 whitespace-nowrap ${
                    selectedCategory === cat.name
                      ? "bg-choco text-cream dark:bg-cream dark:text-oscuro shadow-sm"
                      : "bg-cream dark:bg-oscuro border border-cocoa/30 dark:border-cream/20 text-choco/70 dark:text-cream/70 hover:border-choco dark:hover:border-cream/60"
                  }`}
                >
                  {cat.name}
                </button>
              ))}

              {/* Botón "..." para el overflow */}
              {hasOverflow && (
                <div className="relative shrink-0" ref={overflowRef}>
                  <button
                    onClick={() => setOverflowOpen(!overflowOpen)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                      selectedInOverflow
                        ? "bg-choco text-cream dark:bg-cream dark:text-oscuro shadow-sm"
                        : "bg-cream dark:bg-oscuro border border-cocoa/30 dark:border-cream/20 text-choco/70 dark:text-cream/70 hover:border-choco dark:hover:border-cream/60"
                    }`}
                    aria-label="Más categorías"
                  >
                    {selectedInOverflow
                      ? selectedCategory
                      : `+${overflowCategories.length} más`}
                    <ChevronDown
                      className={`size-3 transition-transform duration-200 ${overflowOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown con position:fixed para escapar de overflow */}
                  <AnimatePresence>
                    {overflowOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                        transition={{ duration: 0.15 }}
                        style={{ position: "fixed", zIndex: 9999 }}
                        className="bg-cream dark:bg-oscuro border border-cocoa/20 dark:border-cream/20 rounded-xl shadow-2xl min-w-[180px] mt-2"
                        ref={(el) => {
                          if (el && overflowRef.current) {
                            const btn =
                              overflowRef.current.getBoundingClientRect();
                            el.style.top = `${btn.bottom + 8}px`;
                            el.style.left = `${btn.left}px`;
                          }
                        }}
                      >
                        <div className="py-1.5 max-h-64 overflow-y-auto">
                          {overflowCategories.map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => handleCategorySelect(cat.name)}
                              className={`flex items-center w-full px-4 py-2.5 text-xs font-medium capitalize text-left transition-colors ${
                                selectedCategory === cat.name
                                  ? "bg-choco text-cream dark:bg-cream dark:text-oscuro font-semibold"
                                  : "text-choco dark:text-cream hover:bg-cocoa/10 dark:hover:bg-cream/10"
                              }`}
                            >
                              {cat.name}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Limpiar */}
              {hasActiveFilters && (
                <button
                  onClick={handleReset}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-red-500 dark:text-red-400 border border-red-200 dark:border-red-800/50 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors whitespace-nowrap"
                >
                  <RotateCcw className="size-3" />
                  Limpiar
                </button>
              )}
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
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
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-choco text-cream dark:bg-cream dark:text-oscuro text-sm font-semibold hover:bg-cocoa dark:hover:bg-butter/90 transition-all cursor-pointer"
              >
                <RotateCcw className="size-4" />
                Ver todos los productos
              </button>
            </div>
          ) : (
            
            <StaggerList
              key={`${page}-${animationKey}`}
              className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {products.map((product) => (
                <StaggerItem key={product.id}>
                  <CardProduct product={product} />
                </StaggerItem>
              ))}
            </StaggerList>
          )}

          {/* Paginación */}
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