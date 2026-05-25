// src/components/home/HomeSection.tsx
import { Product } from "@/interfaces/product.interface";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductGridSkeleton } from "@/components/products/ProductGridSkeleton";
import { FadeIn } from "@/components/animations";
import { ReactNode } from "react";

interface HomeSectionProps {
  title: string;
  icon: ReactNode;
  products: Product[];
  isLoading: boolean; // Recibimos el loading individual de esta sección
}

export const HomeSection = ({
  title,
  icon,
  products,
  isLoading,
}: HomeSectionProps) => {
  return (
    <FadeIn delay={0.1}>
      {isLoading ? (
        // Mostramos el skeleton específico para esta sección
        <ProductGridSkeleton numberOfProducts={4} />
      ) : (
        <ProductGrid
          key={products.map((p) => p.id).join("-")}
          title={title}
          products={products}
          showNavigation
          icon={icon}
        />
      )}
    </FadeIn>
  );
};
