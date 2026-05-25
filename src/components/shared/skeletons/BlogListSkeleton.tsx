export const BlogListSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="flex flex-col bg-cream dark:bg-oscuro border border-cocoa/20 dark:border-cream/10 rounded-2xl overflow-hidden animate-pulse"
      >
        {/* Imagen */}
        <div className="h-48 bg-cocoa/10 dark:bg-cream/5 shrink-0" />
        {/* Contenido */}
        <div className="flex flex-col gap-3 p-5 flex-1">
          {/* Título */}
          <div className="space-y-2">
            <div className="h-4 bg-cocoa/10 dark:bg-cream/10 rounded-full w-full" />
            <div className="h-4 bg-cocoa/10 dark:bg-cream/10 rounded-full w-3/4" />
          </div>
          {/* Excerpt */}
          <div className="space-y-1.5 flex-1">
            <div className="h-3 bg-cocoa/8 dark:bg-cream/8 rounded-full w-full" />
            <div className="h-3 bg-cocoa/8 dark:bg-cream/8 rounded-full w-5/6" />
            <div className="h-3 bg-cocoa/8 dark:bg-cream/8 rounded-full w-4/6" />
          </div>
          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-cocoa/10 dark:border-cream/10 mt-auto">
            <div className="space-y-1.5">
              <div className="h-2.5 bg-cocoa/10 dark:bg-cream/10 rounded-full w-24" />
              <div className="h-2.5 bg-cocoa/10 dark:bg-cream/10 rounded-full w-20" />
            </div>
            <div className="h-3 bg-cocoa/10 dark:bg-cream/10 rounded-full w-12" />
          </div>
        </div>
      </div>
    ))}
  </div>
);
