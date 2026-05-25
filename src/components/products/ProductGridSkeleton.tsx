// src/components/products/ProductGridSkeleton.tsx
// Skeleton actualizado para coincidir con el nuevo diseño de CardProduct

interface Props {
  numberOfProducts?: number;
  columns?: string;
}

export const ProductGridSkeleton = ({
  numberOfProducts = 8,
  columns = "grid-cols-2 md:grid-cols-3 xl:grid-cols-4",
}: Props) => (
  <div className={`grid ${columns} gap-4 md:gap-6`}>
    {Array.from({ length: numberOfProducts }).map((_, i) => (
      <div
        key={i}
        className="rounded-2xl border border-cocoa/15 dark:border-cream/10 bg-cream dark:bg-fondo-dark overflow-hidden animate-pulse"
      >
        {/* Imagen */}
        <div className="aspect-square bg-cocoa/8 dark:bg-cream/5 relative">
          {/* Badge placeholder */}
          <div className="absolute top-2.5 left-2.5 h-5 w-16 bg-cocoa/10 dark:bg-cream/10 rounded-lg" />
          {/* Favorito placeholder */}
          <div className="absolute top-2.5 right-2.5 size-8 rounded-full bg-cocoa/10 dark:bg-cream/10" />
        </div>
        {/* Info */}
        <div className="px-3.5 pt-3 pb-3.5 space-y-2">
          {/* Categoría */}
          <div className="h-2.5 w-16 bg-cocoa/8 dark:bg-cream/8 rounded-full" />
          {/* Nombre */}
          <div className="space-y-1.5">
            <div className="h-3.5 bg-cocoa/10 dark:bg-cream/10 rounded-full w-full" />
            <div className="h-3.5 bg-cocoa/10 dark:bg-cream/10 rounded-full w-3/4" />
          </div>
          {/* Precio + carrito */}
          <div className="flex items-center justify-between mt-1 pt-0.5">
            <div className="space-y-1">
              <div className="h-2.5 w-10 bg-cocoa/8 dark:bg-cream/8 rounded-full" />
              <div className="h-4 w-16 bg-cocoa/10 dark:bg-cream/10 rounded-full" />
            </div>
            <div className="size-9 rounded-xl bg-cocoa/8 dark:bg-cream/8" />
          </div>
        </div>
      </div>
    ))}
  </div>
);