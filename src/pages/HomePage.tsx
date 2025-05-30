import { FeatureGrid } from "@/components/home/FeatureGrid";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductGridSkeleton } from "@/components/products/ProductGridSkeleton";
import { useHomeProducts } from "@/hooks";
import { SponsorCarousel } from "@/components/home/SponsorCarousel";
import { ImGift } from "react-icons/im";
import { IoMdPricetags } from "react-icons/io";
import { AiOutlineProduct } from "react-icons/ai";

const HomePage = () => {
  const { recentProducts, popularProducts, discountedProducts, isLoading } =
    useHomeProducts();

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
            icon={<IoMdPricetags />}
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
            icon={<AiOutlineProduct />}
          />
        )}

        {/* Nueva Sección de Productos en Oferta */}
        {isLoading ? (
          <ProductGridSkeleton numberOfProducts={4} />
        ) : (
          discountedProducts &&
          discountedProducts.length > 0 && (
            <ProductGrid
              key="discounted"
              title="¡Productos en Oferta!"
              products={discountedProducts}
              showNavigation={true}
              icon={<ImGift />}
            />
          )
        )}

        <FeatureGrid />

        <SponsorCarousel />
      </div>
    </section>
  );
};

export default HomePage;