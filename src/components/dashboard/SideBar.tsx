// src/components/dashboard/SideBar.tsx

import { useQueryClient } from "@tanstack/react-query";
import { NavLink, useNavigate } from "react-router-dom";
import { DashboardLinks } from "@/constants/DashboardLinks";
import { Logo } from "@/components/shared/Logo";
import { LogOut } from "lucide-react";
import { signOut } from "@/actions";
import { useDashboardNotifications } from "@/hooks/notifications/useDashboardNotifications";
import { motion, AnimatePresence } from "framer-motion";

// Badge animado para notificaciones
const NotificationBadge = ({ count }: { count: number }) => (
  <AnimatePresence>
    {count > 0 && (
      <motion.span
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="ml-auto -mt-8 shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center shadow-sm"
      >
        {count > 99 ? "99+" : count}
      </motion.span>
    )}
  </AnimatePresence>
);

export const SideBar = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { pendingOrders, pendingReceipts } = useDashboardNotifications();

  // Mapa de badges por href
  const badges: Record<string, number> = {
    "/dashboard/orders": pendingOrders,
    "/dashboard/receipts": pendingReceipts,
  };

  const handleLogout = async () => {
    await signOut();
    queryClient.removeQueries({ queryKey: ["user"] });
    queryClient.removeQueries({ queryKey: ["user-profile"] });
    navigate("/");
  };

  return (
    <div className="w-[120px] h-screen fixed bg-fondo-dark text-cream flex flex-col gap-2 items-center p-3 lg:w-[250px] border-r border-cream/30">
      <Logo />

      <nav className="w-full space-y-2 flex-1">
        {DashboardLinks.map((link) => {
          const badgeCount = badges[link.href] ?? 0;

          return (
            <NavLink
              key={link.id}
              to={link.href}
              className={({ isActive }) =>
                `relative flex items-center justify-center gap-4 pl-0 py-2 transition-all duration-300 rounded-md ${
                  isActive
                    ? "text-cream bg-choco"
                    : "hover:text-cream hover:bg-choco/90 bg-cream/10 border border-cocoa/30 hover:border-transparent"
                } lg:pl-5 lg:justify-start`
              }
            >
              {/* Ícono con badge en móvil */}
              <div className="relative shrink-0">
                {link.icon}
                {/* Badge en móvil — sobre el ícono */}
                {badgeCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] px-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center lg:hidden"
                  >
                    {badgeCount > 9 ? "9+" : badgeCount}
                  </motion.span>
                )}
              </div>

              {/* Título + badge en desktop */}
              <div className="hidden lg:flex items-center flex-1 min-w-0">
                <p className="font-medium flex-1">{link.title}</p>
                <NotificationBadge count={badgeCount} />
              </div>
            </NavLink>
          );
        })}
      </nav>

      <button
        className="bg-cream/10 border border-cocoa/30 hover:border-transparent hover:bg-red-500 w-full py-[10px] rounded-md flex items-center justify-center gap-2 font-semibold text-sm hover:underline transition-all duration-500"
        onClick={handleLogout}
      >
        <span className="hidden lg:block">Cerrar sesión</span>
        <LogOut size={20} className="inline-block" />
      </button>
    </div>
  );
};