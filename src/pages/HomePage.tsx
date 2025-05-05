import { FeatureGrid } from "@/components/home/FeatureGrid";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductGridSkeleton } from "@/components/products/ProductGridSkeleton";
import { useHomeProducts } from "@/hooks";
import { SponsorCarousel } from "@/components/home/SponsorCarousel";

const HomePage = () => {
  const { recentProducts, popularProducts, isLoading } = useHomeProducts();

  return (
    <section className="container text-choco bg-fondo dark:text-cream dark:bg-fondo-dark">
      <div className="py-6">
        {isLoading ? (
          <ProductGridSkeleton numberOfProducts={4} />
        ) : (
          <ProductGrid
            key="recent"
            title="Nuevos Productos"
            products={recentProducts}
            showNavigation={true}
          />
        )}

        {isLoading ? (
          <ProductGridSkeleton numberOfProducts={4} />
        ) : (
          <ProductGrid
            key={popularProducts.map((p) => p.id).join("-")}
            title="Productos Destacados"
            products={popularProducts}
            showNavigation={true}
          />
        )}

        <FeatureGrid />

        <SponsorCarousel />
      </div>
    </section>
  );
};

export default HomePage;
