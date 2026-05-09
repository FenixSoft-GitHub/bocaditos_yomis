import { Outlet, useLocation } from "react-router-dom";
import { NavBar } from "@/components/shared/NavBar";
import Banner from "@/components/home/Banner";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { Footer } from "@/components/shared/Footer";
import NewsLetter from "@/components/home/NewsLetter";
import ScrollToTop from "@/components/shared/ScrollToTop";
import { useGlobalStore } from "@/store/global.store";
import { Sheet } from "@/components/shared/Sheet";
import { NavbarMobile } from "@/components/shared/NavBarMobile";

/** Rutas cuya primera sección es un hero a pantalla completa.
 *  En estas el NavBar flota encima de la imagen (sin spacer). */
const HERO_ROUTES = new Set(["/", "/about", "/blog", "/contact-us"]);

export const Layout = () => {
  const { pathname } = useLocation();
  const isSheetOpen = useGlobalStore((state) => state.isSheetOpen);
  const activeNavMobile = useGlobalStore((state) => state.activeNavMobile);

  const isHome = pathname === "/";
  const hasHero = HERO_ROUTES.has(pathname);

  return (
    <div className="min-h-screen flex flex-col bg-fondo dark:bg-fondo-dark text-choco dark:text-cream">
      {/* NavBar siempre fixed — flota encima de todo */}
      <NavBar />

      {/* Home → Banner ocupa 100vh aquí mismo.
          About / Blog / Contacto → sin spacer, su hero ocupa 100vh
          y el NavBar flota transparente encima igual que en Home.
          Resto de páginas → spacer para que el contenido no quede tapado. */}
      {isHome ? (
        <Banner />
      ) : !hasHero ? (
        <div className="h-[72px] md:h-[80px] shrink-0" aria-hidden="true" />
      ) : null}

      <main className="flex-1 w-full">
        <ScrollToTop />
        <Outlet />
      </main>

      {isHome && <NewsLetter />}

      <footer className="mt-auto w-full">
        <Footer />
      </footer>

      {isSheetOpen && <Sheet />}
      {activeNavMobile && <NavbarMobile />}

      <WhatsAppButton />
    </div>
  );
};
