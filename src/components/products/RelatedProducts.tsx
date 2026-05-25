// src/components/products/RelatedProducts.tsx

import { useRelatedProducts } from "@/hooks/products/useRelatedProducts";
import { CardProduct } from "@/components/products/CardProduct";
import { StaggerList, StaggerItem } from "@/components/animations";

interface Props {
  categoryId: string;
  excludeSlug: string;
  categoryName?: string;
}

export const RelatedProducts = ({
  categoryId,
  excludeSlug,
  categoryName,
}: Props) => {
  const { data: products = [], isLoading } = useRelatedProducts(
    categoryId,
    excludeSlug,
  );

  // Skeleton mientras carga
  if (isLoading) {
    return (
      <div className="my-4 border-t border-cocoa/10 dark:border-cream/10 pt-10">
        <div className="h-6 w-48 bg-cocoa/10 dark:bg-cream/10 rounded-full mb-6 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-cocoa/20 dark:border-cream/10 overflow-hidden animate-pulse"
            >
              <div className="aspect-square bg-cocoa/10 dark:bg-cream/5" />
              <div className="p-4 space-y-2">
                <div className="h-3.5 bg-cocoa/10 dark:bg-cream/10 rounded-full w-3/4" />
                <div className="h-3.5 bg-cocoa/10 dark:bg-cream/10 rounded-full w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // No mostrar si no hay productos relacionados
  if (products.length === 0) return null;

  return (
    <div className="my-4 border-t border-cocoa/10 dark:border-cream/10 pt-10">
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-cocoa mb-1 mt-4">
            También te puede gustar
          </p>
          <h2 className="text-xl font-bold text-choco dark:text-cream">
            {categoryName ? `Más de ${categoryName}` : "Productos relacionados"}
          </h2>
        </div>
      </div>

      <StaggerList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <StaggerItem key={product.id}>
            <CardProduct product={product} />
          </StaggerItem>
        ))}
      </StaggerList>
    </div>
  );
};