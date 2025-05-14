import { Link, NavLink, useLocation } from "react-router-dom";
import { navbarLinks } from "@/constants/NavBarLinks";
import { Logo } from "@components/shared/Logo";
import { memo, useEffect, useState } from "react";
import { ToggleDarkMode } from "./ToggleDarkMode";
import { FaBarsStaggered, FaRegUser, FaUser } from "react-icons/fa6";
import { FiShoppingCart } from "react-icons/fi";
import { HiOutlineSearch } from "react-icons/hi";
import { useGlobalStore } from "@/store/global.store";
import { useCartStore } from "@/store/cart.store";
import { useUser } from "@/hooks";
import { Loader } from "@/components/shared/Loader";

export const NavBar = memo(() => {
  const { pathname } = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const openSheet = useGlobalStore((state) => state.openSheet);
  const setActiveNavMobile = useGlobalStore(
    (state) => state.setActiveNavMobile
  );
  const totalItemsInCart = useCartStore((state) => state.totalItemsInCart);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { session, isLoading, userName } = useUser();

  const oneName = userName?.split(" ")[0];

  const oneClasse =
    pathname === "/products" ||
    pathname.startsWith("/products/") ||
    pathname === "/account/pedidos" ||
    pathname.startsWith("/account/pedidos/") ||
    pathname === "/conditions" ||
    pathname === "/soporte" ||
    pathname === "/policies"||
    pathname === "/terms-of-use" ||
    pathname === "/register" ||
    pathname === "/login"
      ? "bg-oscuro/30 backdrop-blur-md shadow-md"
      : "bg-transparent text-cream";

  return (
    <header
      className={`fixed lg:-mt-6 top-0 left-0 right-0 z-50 transition-all duration-300
      ${isScrolled ? "bg-oscuro/40 backdrop-blur-md shadow-md" : oneClasse} `}
    >
      <div className="container mx-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navbarLinks.map((link) => (
              <NavLink
                key={link.id}
                to={link.href}
                className={({ isActive }) =>
                  `${
                    isActive
                      ? `text-cream font-semibold underline underline-offset-4`
                      : `text-cream/80`
                  } transition-color duration-300 hover:text-amber-300 hover:underline hover:underline-offset-4 px-3 py-1 rounded-md flex items-center gap-2`
                }
              >
                {link.icon}
                {link.title}
              </NavLink>
            ))}
          </nav>

          <div className={`flex items-center gap-3 md:gap-5 text-cream`}>
            <ToggleDarkMode />
            <button
              onClick={() => openSheet("search")}
              className="p-2 rounded-md bg-transparent hover:bg-cream/20 transition-colors cursor-pointer"
              aria-label="Buscar"
            >
              <HiOutlineSearch className="w-6 h-6 " />
            </button>

            {isLoading ? (
              <Loader size={32} />
            ) : session ? (
              <div className="relative">
                <NavLink
                  to="/account"
                  className={({ isActive }) =>
                    `${
                      isActive
                        ? `text-cream font-semibold underline underline-offset-4`
                        : `text-cream/80`
                    } transition-color duration-300 hover:text-amber-300 hover:underline hover:underline-offset-4 p-2 md:px-4 md:py-2 rounded-md flex items-center gap-2 bg-cream/20`
                  }
                  aria-label="Mi cuenta"
                >
                  <div className="hidden md:block text-sm">
                    <span className="flex items-center gap-2">
                      <FaUser size={22} />
                      Hola! {oneName}
                    </span>
                  </div>
                  <span className="md:hidden">
                    <FaUser size={22} />
                  </span>
                </NavLink>
              </div>
            ) : (
              <Link
                to="/login"
                className="p-2 rounded-md bg-transparent hover:bg-cream/20 transition-colors cursor-pointer"
              >
                <FaRegUser className="" size={22} />
              </Link>
            )}

            <button
              onClick={() => openSheet("cart")}
              className="relative p-2 rounded-md bg-transparent hover:bg-cream/20 transition-colors cursor-pointer group"
              aria-label="Carrito de compras"
            >
              <FiShoppingCart className="w-6 h-6 " />
              <span className="absolute -top-2 -right-1 w-5 h-5 flex items-center justify-center font-semibold text-[11px] rounded-full bg-cocoa text-fondo dark:bg-cream/70 dark:text-choco">
                {totalItemsInCart}
              </span>
            </button>

            <button
              className="md:hidden p-2 rounded-full transition-colors duration-200 bg-cream/10 hover:bg-cream/70 hover:text-choco"
              onClick={() => setActiveNavMobile(true)}
              aria-label="Menú"
            >
              <FaBarsStaggered className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
});

NavBar.displayName = "NavBar";
