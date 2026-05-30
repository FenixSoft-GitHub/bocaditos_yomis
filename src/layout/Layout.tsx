// src/layout/Layout.tsx

import { useEffect, useCallback } from "react";
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
import { OnboardingModal } from "@/components/shared/OnboardingModal";
import { useOnboarding } from "@/hooks/onboarding/useOnboarding";
import { useCartStore } from "@/store/cart.store";
import { useUser } from "@/hooks";

const FULL_HERO_ROUTES = new Set(["/about", "/blog", "/contact-us"]);

export const Layout = () => {
  const { pathname } = useLocation();
  const isSheetOpen = useGlobalStore((state) => state.isSheetOpen);
  const activeNavMobile = useGlobalStore((state) => state.activeNavMobile);
  const { show: showOnboarding, complete: completeOnboarding } =
    useOnboarding();
  const loadCartFromSupabase = useCartStore(
    (state) => state.loadCartFromSupabase,
  );

  const loadCart = useCallback(
    (userId: string) => {
      loadCartFromSupabase(userId);
    },
    [loadCartFromSupabase],
  );

  // Usar el hook de auth existente en lugar de crear otro listener
  const { user, isLoading } = useUser();

  const isHome = pathname === "/";
  const isFullHero = FULL_HERO_ROUTES.has(pathname);
  const needsSpacer = !isHome && !isFullHero;

  // Cargar carrito solo cuando el usuario esté disponible
  useEffect(() => {
    if (!isLoading && user?.id) {
      loadCart(user.id);
    }
  }, [user?.id, isLoading, loadCart]); // ← solo se ejecuta cuando cambia el user.id

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

      <BottomNav />

      <div className="fixed right-6 z-40 bottom-20 md:bottom-6">
        <WhatsAppButton />
      </div>

      {isSheetOpen && <Sheet />}
      {activeNavMobile && <NavbarMobile />}

      {showOnboarding && <OnboardingModal onComplete={completeOnboarding} />}
    </div>
  );
};