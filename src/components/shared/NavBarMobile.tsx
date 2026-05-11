import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useGlobalStore } from "@/store/global.store";
import { NavLink } from "react-router-dom";
import { NavbarLinks } from "@/constants/NavBarLinks";
import { Logo } from "./Logo";

export const NavbarMobile = () => {
  const setActiveNavMobile = useGlobalStore(
    (state) => state.setActiveNavMobile,
  );
  const close = () => setActiveNavMobile(false);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex">
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={close}
          aria-hidden="true"
        />

        <motion.nav
          key="panel"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          className="relative ml-auto w-72 h-full bg-fondo dark:bg-oscuro shadow-2xl flex flex-col py-8 px-6"
          aria-label="Menú de navegación"
        >
          <div className="flex items-center justify-between mb-8">
            <Logo />
            <button
              onClick={close}
              className="p-2 rounded-lg bg-choco/10 dark:bg-cream/10 hover:bg-choco/20 dark:hover:bg-cream/20 text-choco dark:text-cream transition-colors"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <motion.div
            className="flex flex-col gap-1 flex-1"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.06, delayChildren: 0.1 },
              },
            }}
          >
            {NavbarLinks.map((item) => (
              <motion.div
                key={item.id}
                variants={{
                  hidden: { opacity: 0, x: 20 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
                }}
              >
                <NavLink
                  to={item.href}
                  onClick={close}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-choco text-cream dark:bg-cream/15 dark:text-cream"
                        : "text-choco/80 dark:text-cream/70 hover:bg-choco/10 dark:hover:bg-cream/10 hover:text-choco dark:hover:text-cream"
                    }`
                  }
                >
                  {item.icon}
                  <span>{item.title}</span>
                </NavLink>
              </motion.div>
            ))}
          </motion.div>

          <p className="text-xs text-choco/40 dark:text-cream/30 text-center mt-6">
            © {new Date().getFullYear()} Bocaditos Yomi's
          </p>
        </motion.nav>
      </div>
    </AnimatePresence>
  );
};
