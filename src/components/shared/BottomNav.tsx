import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Store, Search, ShoppingCart, User } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { useGlobalStore } from "@/store/global.store";

const HIDDEN_ROUTES = new Set(["/checkout", "/login", "/register"]);

export const BottomNav = () => {
  const { pathname } = useLocation();
  const totalItemsInCart = useCartStore((state) => state.totalItemsInCart);
  const openSheet = useGlobalStore((state) => state.openSheet);

  const isHidden =
    HIDDEN_ROUTES.has(pathname) ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/checkout");

  if (isHidden) return null;

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.1 }}
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
      aria-label="Navegación principal"
    >
      <div className="bg-fondo/95 dark:bg-oscuro/95 backdrop-blur-md border-t border-cocoa/20 dark:border-cream/10 px-2">
        <div className="flex items-center justify-around h-16">
          {/* Inicio */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `tab-btn ${isActive ? "tab-active" : "tab-inactive"}`
            }
            aria-label="Inicio"
          >
            {({ isActive }) => (
              <TabContent icon={Home} label="Inicio" isActive={isActive} />
            )}
          </NavLink>

          {/* Productos */}
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `tab-btn ${isActive ? "tab-active" : "tab-inactive"}`
            }
            aria-label="Productos"
          >
            {({ isActive }) => (
              <TabContent icon={Store} label="Productos" isActive={isActive} />
            )}
          </NavLink>

          {/* Buscar */}
          <button
            onClick={() => openSheet("search")}
            className="tab-btn tab-inactive"
            aria-label="Buscar"
          >
            <TabContent icon={Search} label="Buscar" isActive={false} />
          </button>

          {/* Carrito */}
          <button
            onClick={() => openSheet("cart")}
            className="tab-btn tab-inactive relative"
            aria-label={`Carrito — ${totalItemsInCart} artículos`}
          >
            <div className="relative">
              <ShoppingCart className="size-5" />
              <AnimatePresence>
                {totalItemsInCart > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center text-[10px] font-bold rounded-full bg-cocoa text-cream"
                  >
                    {totalItemsInCart > 9 ? "9+" : totalItemsInCart}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <span className="text-[10px] mt-0.5">Carrito</span>
          </button>

          {/* Cuenta */}
          <NavLink
            to="/account"
            className={({ isActive }) =>
              `tab-btn ${isActive ? "tab-active" : "tab-inactive"}`
            }
            aria-label="Mi cuenta"
          >
            {({ isActive }) => (
              <TabContent icon={User} label="Cuenta" isActive={isActive} />
            )}
          </NavLink>
        </div>
      </div>
    </motion.nav>
  );
};

const TabContent = ({
  icon: Icon,
  label,
  isActive,
}: {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}) => (
  <>
    <motion.div
      animate={{ scale: isActive ? 1.15 : 1, y: isActive ? -2 : 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
    >
      <Icon className="size-5" />
    </motion.div>
    <span className="text-[10px] mt-0.5">{label}</span>
  </>
);
