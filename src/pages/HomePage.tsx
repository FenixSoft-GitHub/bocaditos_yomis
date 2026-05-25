// src/pages/HomePage.tsx
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { useHomeProducts } from "@/hooks";
import { SponsorCarousel } from "@/components/home/SponsorCarousel";
import { SEOHead } from "@/components/seo/SEOHead";
import { organizationSchema, websiteSchema } from "@/components/seo/schemas";
import { FadeIn, PageTransition } from "@/components/animations";
import { Gift, Tag, Package } from "lucide-react";
import { HomeSection } from "@/components/home/HomeSection"; // Importamos el nuevo componente

const HomePage = () => {
  const {
    recentProducts,
    popularProducts,
    discountedProducts,
    isRecentLoading,
    isPopularLoading,
    isDiscountedLoading, // Usamos los estados individuales
  } = useHomeProducts();

  // Solo mostramos ofertas si hay datos Y no están cargando (o si hay datos disponibles)
  const showOffers = discountedProducts.length > 0 || isDiscountedLoading;

  return (
    <>
      <SEOHead canonical="/" schema={[organizationSchema, websiteSchema]} />
      <PageTransition>
        {/* ... Tu Hero / Franja Introductoria ... */}

        <section className="container mx-auto px-4 text-choco dark:text-cream dark:bg-fondo-dark">
          {/* Sección 1: Nuevos */}
          <HomeSection
            title="Nuevos Productos"
            icon={<Tag className="size-7" />}
            products={recentProducts}
            isLoading={isRecentLoading}
          />

          <div className="border-t border-cocoa/10 dark:border-cream/10 my-4" />

          {/* Sección 2: Destacados */}
          <HomeSection
            title="Productos Destacados"
            icon={<Package className="size-7" />}
            products={popularProducts}
            isLoading={isPopularLoading}
          />

          {/* Sección 3: Ofertas (Condicional) */}
          {showOffers && (
            <>
              <div className="border-t border-cocoa/10 dark:border-cream/10 my-4" />
              <HomeSection
                title="¡Productos en Oferta!"
                icon={<Gift className="size-7" />}
                products={discountedProducts}
                isLoading={isDiscountedLoading}
              />
            </>
          )}

          {/* Features y Sponsors */}

          <FeatureGrid />

          <FadeIn delay={0.1}>
            <SponsorCarousel />
          </FadeIn>
        </section>
      </PageTransition>
    </>
  );
};

export default HomePage;