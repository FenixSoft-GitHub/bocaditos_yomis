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
import { BottomNav } from "@/components/shared/BottomNav";

const FULL_HERO_ROUTES = new Set(["/about", "/blog", "/contact-us"]);

export const Layout = () => {
  const { pathname } = useLocation();
  const isSheetOpen = useGlobalStore((state) => state.isSheetOpen);
  const activeNavMobile = useGlobalStore((state) => state.activeNavMobile);

  const isHome = pathname === "/";
  const isFullHero = FULL_HERO_ROUTES.has(pathname);
  const needsSpacer = !isHome && !isFullHero;

  return (
    <div className="min-h-screen flex flex-col bg-fondo dark:bg-fondo-dark text-choco dark:text-cream">
      <NavBar />

      {isHome ? (
        <Banner />
      ) : needsSpacer ? (
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

      {/* Bottom Navigation — solo móvil */}
      <BottomNav />

      {/* WhatsApp — sube en móvil para no tapar el BottomNav */}
      <div className="fixed right-6 z-40 bottom-20 md:bottom-6">
        <WhatsAppButton />
      </div>

      {isSheetOpen && <Sheet />}
      {activeNavMobile && <NavbarMobile />}
    </div>
  );
};
