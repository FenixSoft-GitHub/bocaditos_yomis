// src/components/products/ProductGridSkeleton.tsx

interface Props {
  numberOfProducts?: number;
  viewMode?: "grid" | "list";
}

export const ProductGridSkeleton = ({
  numberOfProducts = 8,
  viewMode = "grid",
}: Props) => {
  const isGrid = viewMode === "grid";

  return (
    <div
      className={
        isGrid
          ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mt-4"
          : "flex flex-col gap-6 mt-4"
      }
    >
      {Array.from({ length: numberOfProducts }).map((_, i) => (
        <div
          key={i}
          className={`rounded-2xl border border-cocoa/15 dark:border-cream/10 bg-cream dark:bg-fondo-dark overflow-hidden animate-pulse flex ${
            isGrid ? "flex-col" : "flex-row p-4 gap-4 items-center"
          }`}
        >
          {/* 📷 Imagen / Thumbnail */}
          <div
            className={`bg-cocoa/8 dark:bg-cream/5 relative shrink-0 ${
              isGrid ? "aspect-square w-full" : "size-24 md:size-32 rounded-xl"
            }`}
          >
            {isGrid && (
              <>
                {/* Badge placeholder */}
                <div className="absolute top-2.5 left-2.5 h-5 w-16 bg-cocoa/10 dark:bg-cream/10 rounded-lg" />
                {/* Favorito placeholder */}
                <div className="absolute top-2.5 right-2.5 size-8 rounded-full bg-cocoa/10 dark:bg-cream/10" />
              </>
            )}
          </div>

          {/* 📝 Info del Producto */}
          <div
            className={`space-y-2 w-full ${isGrid ? "px-3.5 pt-3 pb-3.5" : "flex-1"}`}
          >
            {/* Categoría */}
            <div className="h-2.5 w-16 bg-cocoa/8 dark:bg-cream/8 rounded-full" />

            {/* Nombre */}
            <div className="space-y-1.5">
              <div className="h-3.5 bg-cocoa/10 dark:bg-cream/10 rounded-full w-3/4 md:w-1/2" />
              {isGrid ? (
                <div className="h-3.5 bg-cocoa/10 dark:bg-cream/10 rounded-full w-full" />
              ) : (
                // Una línea extra de descripción que suele ir en la vista de lista
                <div className="h-3 bg-cocoa/5 dark:bg-cream/5 rounded-full w-5/6 hidden md:block" />
              )}
            </div>

            {/* Precio + Carrito */}
            <div
              className={`flex items-center justify-between mt-1 pt-0.5 ${!isGrid && "md:mt-4"}`}
            >
              <div className="space-y-1">
                <div className="h-2.5 w-10 bg-cocoa/8 dark:bg-cream/8 rounded-full" />
                <div className="h-4 w-16 bg-cocoa/10 dark:bg-cream/10 rounded-full" />
              </div>
              <div className="size-9 rounded-xl bg-cocoa/8 dark:bg-cream/8 shrink-0" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};