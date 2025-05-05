// src/components/Layout.jsx
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

export const Layout = () => {
  const { pathname } = useLocation();
  const isSheetOpen = useGlobalStore((state) => state.isSheetOpen);
  const activeNavMobile = useGlobalStore((state) => state.activeNavMobile);

  return (
    <div className="min-h-screen flex flex-col bg-fondo dark:bg-fondo-dark text-choco dark:text-cream">
      {/* Header principal */}
      <header className="w-full shadow-sm sticky top-0 z-50 bg-fondo dark:bg-fondo-dark">
        <div className="max-w-7xl mx-auto px-6">
          <NavBar />
        </div>
      </header>

      {/* Banner solo en la home */}
      {pathname === "/" && <Banner />}

      {/* Contenido principal */}
      <main className="flex-1 w-full">
        <ScrollToTop />
        <Outlet />
      </main>

      {/* Newsletter solo en home */}
      {pathname === "/" && <NewsLetter />}

      {/* Footer siempre visible */}
      <footer className="mt-auto w-full">
        <Footer />
      </footer>

      {/* Panel lateral y navbar móvil */}
      {isSheetOpen && <Sheet />}
      {activeNavMobile && <NavbarMobile />}

      {/* Botón de WhatsApp */}
      <WhatsAppButton />
    </div>
  );
};