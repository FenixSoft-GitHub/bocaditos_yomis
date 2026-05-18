import { FeatureGrid } from "@/components/home/FeatureGrid";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductGridSkeleton } from "@/components/products/ProductGridSkeleton";
import { useHomeProducts } from "@/hooks";
import { SponsorCarousel } from "@/components/home/SponsorCarousel";
import { SEOHead } from "@/components/seo/SEOHead";
import { organizationSchema, websiteSchema } from "@/components/seo/schemas";
import { PageTransition, FadeIn } from "@/components/animations";
import { Gift, Tag, Package, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const { recentProducts, popularProducts, discountedProducts, isLoading } =
    useHomeProducts();

  return (
    <>
      <SEOHead canonical="/" schema={[organizationSchema, websiteSchema]} />
      <PageTransition>
        {/* ── Franja introductoria ────────────────────────────────── */}
        <FadeIn>
          <div className="bg-fondo dark:bg-fondo-dark border-b border-cocoa/10 dark:border-cream/10 py-4">
            <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left space-y-2 max-w-lg">
                <p className="text-xs font-semibold uppercase tracking-widest text-cocoa dark:text-cocoa">
                  Hecho con amor · Bocaditos Yomi's
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-choco dark:text-cream leading-tight">
                  Cada bocado cuenta una historia de sabor artesanal
                </h2>
                <p className="text-sm text-choco/60 dark:text-cream/60 leading-relaxed">
                  Panes, galletas, tortas y snacks elaborados con ingredientes
                  frescos. Sin conservantes, sin apuros — solo sabor de verdad.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-choco text-cream dark:bg-cream dark:text-oscuro hover:bg-cocoa dark:hover:bg-butter font-semibold text-sm transition-all hover:scale-105 active:scale-95 shadow-md"
                >
                  Ver catálogo completo
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  to="/contact-us"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-cocoa/40 dark:border-cream/30 text-choco dark:text-cream hover:bg-choco/10 dark:hover:bg-cream/10 font-medium text-sm transition-all"
                >
                  Hacer pedido especial
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* ── Contenido principal ─────────────────────────────────── */}
        <section className="container mx-auto px-4 text-choco dark:text-cream dark:bg-fondo-dark">
          {/* Nuevos Productos */}
          <FadeIn delay={0.1}>
            {isLoading ? (
              <ProductGridSkeleton numberOfProducts={4} />
            ) : (
              <ProductGrid
                title="Nuevos Productos"
                products={recentProducts}
                showNavigation
                icon={<Tag className="size-7" />}
              />
            )}
          </FadeIn>

          {/* Divisor sutil */}
          <div className="border-t border-cocoa/10 dark:border-cream/10 my-4" />

          {/* Productos Destacados */}
          <FadeIn delay={0.1}>
          {isLoading ? (
            <ProductGridSkeleton numberOfProducts={4} />
          ) : (
            <ProductGrid
              key={popularProducts.map((p) => p.id).join("-")}
              title="Productos Destacados"
              products={popularProducts}
              showNavigation
              icon={<Package className="size-7" />}
            />
          )}
          </FadeIn>

          {/* Ofertas — solo si hay */}
          {(isLoading ||
            (discountedProducts && discountedProducts.length > 0)) && (
            <>
              <div className="border-t border-cocoa/10 dark:border-cream/10 my-4" />
              <FadeIn delay={0.1}>
                {isLoading ? (
                  <ProductGridSkeleton numberOfProducts={4} />
                ) : (
                  <ProductGrid
                    title="¡Productos en Oferta!"
                    products={discountedProducts}
                    showNavigation
                    icon={<Gift className="size-7" />}
                  />
                )}
              </FadeIn>
            </>
          )}

          {/* Features */}
          <FadeIn delay={0.1}>
            <FeatureGrid />
          </FadeIn>
        </section>

        {/* ── Carousel de marcas ──────────────────────────────────── */}
        <FadeIn delay={0.1}>
          <SponsorCarousel />
        </FadeIn>
      </PageTransition>
    </>
  );
};

export default HomePage;