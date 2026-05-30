import { Link, NavLink, useLocation } from "react-router-dom";
import { NavbarLinks } from "@/constants/NavBarLinks";
import { Logo } from "@components/shared/Logo";
import { memo, useEffect, useState } from "react";
import { ToggleDarkMode } from "./ToggleDarkMode";
import { Menu, ShoppingCart, User, Search } from "lucide-react";
import { useGlobalStore } from "@/store/global.store";
import { useCartStore } from "@/store/cart.store";
import { useUser } from "@/hooks";
import { Loader } from "@/components/shared/Loader";
import { AvatarUpload } from "@/components/account/AvatarUpload";

const SOLID_BG_ROUTES = new Set([
  "/products",
  "/account/pedidos",
  "/conditions",
  "/soporte",
  "/policies",
  "/terms-of-use",
  "/register",
  "/login",
]);

const useNavStyle = () => {
  const { pathname } = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hasSolidBg =
    SOLID_BG_ROUTES.has(pathname) ||
    pathname.startsWith("/products/") ||
    pathname.startsWith("/account/pedidos/") ||
    pathname.startsWith("/blog/");

  return isScrolled || hasSolidBg
    ? "bg-oscuro/50 backdrop-blur-md shadow-md"
    : "bg-transparent";
};

export const NavBar = memo(() => {
  const navBg = useNavStyle();
  const openSheet = useGlobalStore((state) => state.openSheet);
  const setActiveNavMobile = useGlobalStore(
    (state) => state.setActiveNavMobile,
  );
  const totalItemsInCart = useCartStore((state) => state.totalItemsInCart);
  const { session, isLoading, userName, avatarUrl, refreshProfile } = useUser();

  // Extraer solo el primer y tercer nombre para mostrar
  const parts = userName ? userName.trim().split(/\s+/) : [];

  const firstNameAndLastName =
    parts.length >= 3 ? `${parts[0]} ${parts[2]}` : userName;
  const email = session?.user?.email ?? "";

  const initials = userName
    ? userName
        .split(" ")
        .map((n: string) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : email.charAt(0).toUpperCase();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between py-1">
          <Logo />

          <nav className="hidden md:flex items-center gap-1">
            {NavbarLinks.map((link) => (
              <NavLink
                key={link.id}
                to={link.href}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-cream underline underline-offset-4 font-semibold"
                      : "text-cream/80 hover:text-cream hover:bg-cream/10"
                  }`
                }
              >
                {link.icon}
                {link.title}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1 md:gap-2 text-cream">
            <ToggleDarkMode />

            <button
              onClick={() => openSheet("search")}
              className="p-2 rounded-lg hover:bg-cream/10 transition-colors"
              aria-label="Buscar"
            >
              <Search className="size-5" />
            </button>

            {isLoading ? (
              <Loader size={22} fullScreen={false} />
            ) : session ? (
              <NavLink
                to="/account"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-cream/10 ${
                    isActive ? "text-cream font-semibold" : "text-cream/80"
                  }`
                }
                aria-label="Mi cuenta"
              >
                {/* Avatar con upload */}
                <AvatarUpload
                  currentUrl={avatarUrl}
                  initials={initials}
                  onSuccess={() => refreshProfile()}
                  size={8}
                  isActive
                />
                <div className="min-w-0 text-[11px]">
                  <p className="hidden md:block truncate">
                    {firstNameAndLastName || "Mi cuenta"}
                  </p>
                  <span className="hidden md:inline underline text-[10px] text-cream/80 dark:text-cream/60">
                    {email}
                  </span>
                </div>
              </NavLink>
            ) : (
              <Link
                to="/login"
                className="p-2 rounded-lg hover:bg-cream/10 transition-colors flex gap-1 items-center text-sm font-medium text-cream/80 hover:text-cream"
                aria-label="Iniciar sesión"
              >
                <User className="size-5" />
                Iniciar sesión
              </Link>
            )}

            <button
              onClick={() => openSheet("cart")}
              className="relative p-2 rounded-lg hover:bg-cream/10 transition-colors"
              aria-label={`Carrito — ${totalItemsInCart} artículos`}
            >
              <ShoppingCart className="size-5" />
              {totalItemsInCart > 0 && (
                <span className="absolute -top-1 -right-1 size-4 flex items-center justify-center text-[10px] font-bold rounded-full bg-cocoa text-cream">
                  {totalItemsInCart > 9 ? "9+" : totalItemsInCart}
                </span>
              )}
            </button>

            <button
              className="md:hidden p-2 rounded-lg bg-cream/10 hover:bg-cream/20 transition-colors"
              onClick={() => setActiveNavMobile(true)}
              aria-label="Abrir menú"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
});

NavBar.displayName = "NavBar";
