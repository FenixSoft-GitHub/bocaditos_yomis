// src/components/shared/skeletons/ProductPageSkeleton.tsx

export const ProductPageSkeleton = () => (
  <div className="container mx-auto px-4 py-6 text-choco dark:text-cream animate-pulse">
    {/* Breadcrumb */}
    <div className="flex items-center gap-2 mb-6">
      <div className="h-3.5 w-12 bg-cocoa/10 dark:bg-cream/10 rounded-full" />
      <div className="h-3 w-2 bg-cocoa/10 dark:bg-cream/10 rounded-full" />
      <div className="h-3.5 w-16 bg-cocoa/10 dark:bg-cream/10 rounded-full" />
      <div className="h-3 w-2 bg-cocoa/10 dark:bg-cream/10 rounded-full" />
      <div className="h-3.5 w-32 bg-cocoa/10 dark:bg-cream/10 rounded-full" />
    </div>

    {/* Layout principal */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
      {/* Galería (GridImages) - Corregido para miniaturas a la izquierda en LG */}
      <div className="flex flex-col-reverse lg:flex-row gap-3 h-auto lg:h-[500px]">
        {/* Contenedor de Miniaturas (Izquierda en LG, Abajo en Móvil) */}
        <div className="grid grid-cols-4 lg:grid-cols-1 gap-2 w-full lg:w-24 shrink-0">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square lg:h-20 lg:w-20 rounded-xl bg-cocoa/10 dark:bg-cream/5 mx-auto"
            />
          ))}
        </div>

        {/* Imagen Principal */}
        <div className="flex-1 aspect-square lg:aspect-auto h-full rounded-2xl bg-cocoa/10 dark:bg-cream/5" />
      </div>

      {/* Info del producto */}
      <div className="flex flex-col gap-5">
        {/* Categoría + nombre */}
        <div className="space-y-2">
          <div className="h-3 w-28 bg-cocoa/10 dark:bg-cream/10 rounded-full" />
          <div className="h-8 bg-cocoa/10 dark:bg-cream/10 rounded-xl w-5/6" />
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
          <div className="h-3 w-32 bg-cocoa/10 dark:bg-cream/10 rounded-full" />
        </div>

        {/* Separador */}
        <div className="h-px bg-cocoa/10 dark:bg-cream/10" />

        {/* Precio */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-32 bg-cocoa/10 dark:bg-cream/10 rounded-full" />
        </div>

        {/* Descripción */}
        <div className="rounded-xl border border-cocoa/10 dark:border-cream/10 p-4 space-y-2.5">
          <div className="h-3 w-36 bg-cocoa/10 dark:bg-cream/10 rounded-full" />
          <div className="space-y-2">
            <div className="h-3 w-full bg-cocoa/5 dark:bg-cream/5 rounded-full" />
            <div className="h-3 w-11/12 bg-cocoa/5 dark:bg-cream/5 rounded-full" />
            <div className="h-3 w-4/5 bg-cocoa/5 dark:bg-cream/5 rounded-full" />
          </div>
        </div>

        {/* Cantidad */}
        <div className="flex items-center gap-4">
          <div className="h-4 w-14 bg-cocoa/10 dark:bg-cream/10 rounded-full" />
          <div className="h-10 w-30 bg-cocoa/10 dark:bg-cream/10 rounded-xl" />
          <div className="h-3 w-24 bg-cocoa/10 dark:bg-cream/10 rounded-full" />
        </div>

        {/* Botones CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 h-12 bg-cocoa/10 dark:bg-cream/10 rounded-xl" />
          <div className="flex-1 h-12 bg-cocoa/10 dark:bg-cream/10 rounded-xl" />
          <div className="h-12 w-full sm:w-28 bg-cocoa/10 dark:bg-cream/10 rounded-xl" />
        </div>

        {/* Beneficios */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="h-[66px] bg-cocoa/5 dark:bg-cream/5 rounded-xl border border-cocoa/10 dark:border-cream/10" />
          <div className="h-[66px] bg-cocoa/5 dark:bg-cream/5 rounded-xl border border-cocoa/10 dark:border-cream/10" />
        </div>
      </div>
    </div>

    {/* Sección de Reseñas */}
    <div className="mt-16 border-t border-cocoa/10 dark:border-cream/10 pt-8 space-y-4">
      <div className="h-6 w-40 bg-cocoa/10 dark:bg-cream/10 rounded-md" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-32 bg-cocoa/5 dark:bg-cream/5 rounded-xl border border-cocoa/10 dark:border-cream/10 col-span-1" />
        <div className="h-32 bg-cocoa/5 dark:bg-cream/5 rounded-xl border border-cocoa/10 dark:border-cream/10 md:col-span-2" />
      </div>
    </div>
  </div>
);
