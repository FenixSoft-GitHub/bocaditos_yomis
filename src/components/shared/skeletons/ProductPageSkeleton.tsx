export const ProductPageSkeleton = () => (
  <div className="container mx-auto px-4 py-6 animate-pulse">
    {/* Breadcrumb */}
    <div className="flex items-center gap-2 mb-6">
      <div className="h-3.5 w-12 bg-cocoa/10 dark:bg-cream/10 rounded-full" />
      <div className="h-3 w-2 bg-cocoa/10 dark:bg-cream/10 rounded-full" />
      <div className="h-3.5 w-20 bg-cocoa/10 dark:bg-cream/10 rounded-full" />
      <div className="h-3 w-2 bg-cocoa/10 dark:bg-cream/10 rounded-full" />
      <div className="h-3.5 w-32 bg-cocoa/10 dark:bg-cream/10 rounded-full" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
      {/* Galería */}
      <div className="space-y-3">
        <div className="aspect-square rounded-2xl bg-cocoa/10 dark:bg-cream/5" />
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl bg-cocoa/10 dark:bg-cream/5"
            />
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-5">
        {/* Categoría */}
        <div className="h-3 w-24 bg-cocoa/10 dark:bg-cream/10 rounded-full" />
        {/* Nombre */}
        <div className="space-y-2">
          <div className="h-7 bg-cocoa/10 dark:bg-cream/10 rounded-full w-4/5" />
          <div className="h-7 bg-cocoa/10 dark:bg-cream/10 rounded-full w-3/5" />
        </div>
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="size-4 rounded-full bg-cocoa/10 dark:bg-cream/10"
              />
            ))}
          </div>
          <div className="h-3 w-24 bg-cocoa/10 dark:bg-cream/10 rounded-full" />
        </div>
        {/* Separador */}
        <div className="h-px bg-cocoa/10 dark:bg-cream/10" />
        {/* Precio */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-28 bg-cocoa/10 dark:bg-cream/10 rounded-full" />
        </div>
        {/* Descripción */}
        <div className="rounded-xl border border-cocoa/10 dark:border-cream/10 p-4 space-y-2">
          <div className="h-3 w-32 bg-cocoa/10 dark:bg-cream/10 rounded-full" />
          <div className="h-3 w-full bg-cocoa/8 dark:bg-cream/8 rounded-full" />
          <div className="h-3 w-5/6 bg-cocoa/8 dark:bg-cream/8 rounded-full" />
          <div className="h-3 w-4/6 bg-cocoa/8 dark:bg-cream/8 rounded-full" />
        </div>
        {/* Cantidad */}
        <div className="flex items-center gap-4">
          <div className="h-4 w-16 bg-cocoa/10 dark:bg-cream/10 rounded-full" />
          <div className="h-10 w-32 bg-cocoa/10 dark:bg-cream/10 rounded-xl" />
        </div>
        {/* Botones CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 h-12 bg-cocoa/10 dark:bg-cream/10 rounded-xl" />
          <div className="flex-1 h-12 bg-cocoa/10 dark:bg-cream/10 rounded-xl" />
          <div className="h-12 w-20 bg-cocoa/10 dark:bg-cream/10 rounded-xl" />
        </div>
        {/* Beneficios */}
        <div className="grid grid-cols-2 gap-3">
          <div className="h-16 bg-cocoa/10 dark:bg-cream/5 rounded-xl border border-cocoa/10 dark:border-cream/10" />
          <div className="h-16 bg-cocoa/10 dark:bg-cream/5 rounded-xl border border-cocoa/10 dark:border-cream/10" />
        </div>
      </div>
    </div>
  </div>
);
