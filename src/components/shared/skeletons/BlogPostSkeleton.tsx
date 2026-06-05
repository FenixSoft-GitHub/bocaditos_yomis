// src/components/shared/skeletons/BlogPostSkeleton.tsx

export const BlogPostSkeleton = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-3xl animate-pulse">
      {/* Cabecera del Post (Header) */}
      <header className="my-8 flex flex-col items-center">
        {/* Título - Simulación de 2 líneas */}
        <div className="h-10 sm:h-12 w-5/6 bg-cocoa/10 dark:bg-cream/10 rounded-xl mb-3" />
        <div className="h-10 sm:h-12 w-3/4 bg-cocoa/10 dark:bg-cream/10 rounded-xl mb-6" />

        {/* Metadata (Fecha y Autor) */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-24 bg-cocoa/10 dark:bg-cream/10 rounded-full" />
          <div className="h-4 w-2 bg-cocoa/10 dark:bg-cream/10 rounded-full hidden sm:block" />
          <div className="h-4 w-32 bg-cocoa/10 dark:bg-cream/10 rounded-full" />
        </div>
      </header>

      {/* Imagen Destacada (Aspect Ratio 16/9) */}
      <div className="w-full aspect-[16/9] mb-10 rounded-2xl bg-cocoa/10 dark:bg-cream/5 border border-cocoa/10 dark:border-cream/10" />

      {/* Cuerpo del Artículo (Simulación de texto Prose) */}
      <div className="space-y-6 mb-12">
        {/* Párrafo 1 */}
        <div className="space-y-3">
          <div className="h-4 w-full bg-cocoa/5 dark:bg-cream/5 rounded-full" />
          <div className="h-4 w-full bg-cocoa/5 dark:bg-cream/5 rounded-full" />
          <div className="h-4 w-11/12 bg-cocoa/5 dark:bg-cream/5 rounded-full" />
          <div className="h-4 w-4/5 bg-cocoa/5 dark:bg-cream/5 rounded-full" />
        </div>

        {/* Subtítulo simulado */}
        <div className="h-7 w-1/2 bg-cocoa/10 dark:bg-cream/10 rounded-lg mt-8 mb-4" />

        {/* Párrafo 2 */}
        <div className="space-y-3">
          <div className="h-4 w-full bg-cocoa/5 dark:bg-cream/5 rounded-full" />
          <div className="h-4 w-full bg-cocoa/5 dark:bg-cream/5 rounded-full" />
          <div className="h-4 w-full bg-cocoa/5 dark:bg-cream/5 rounded-full" />
          <div className="h-4 w-5/6 bg-cocoa/5 dark:bg-cream/5 rounded-full" />
        </div>

        {/* Cita o Bloque destacado simulado */}
        <div className="border-l-4 border-cocoa/20 dark:border-butter/20 pl-4 py-2 space-y-2">
          <div className="h-4 w-full bg-cocoa/5 dark:bg-cream/5 rounded-full italic" />
          <div className="h-4 w-2/3 bg-cocoa/5 dark:bg-cream/5 rounded-full italic" />
        </div>
      </div>

      {/* Simulación de Posts Relacionados en el Skeleton */}
      <div className="mt-16 pt-12 border-t border-cocoa/10 dark:border-cream/10 space-y-6">
        <div className="h-6 w-52 bg-cocoa/10 dark:bg-cream/10 rounded-md" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3 p-3 border border-transparent">
              <div className="w-full aspect-[16/10] bg-cocoa/10 dark:bg-cream/5 rounded-xl" />
              <div className="h-3 w-16 bg-cocoa/10 dark:bg-cream/10 rounded-full" />
              <div className="h-4 w-full bg-cocoa/10 dark:bg-cream/10 rounded-lg" />
              <div className="h-4 w-3/4 bg-cocoa/10 dark:bg-cream/10 rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Botón Regresar */}
      <footer className="flex items-center justify-end py-4 border-t border-cocoa/10 dark:border-cream/10">
        <div className="h-10 w-28 bg-cocoa/10 dark:bg-cream/10 rounded-xl" />
      </footer>
    </div>
  );
};
