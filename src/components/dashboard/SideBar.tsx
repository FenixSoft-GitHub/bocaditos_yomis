// src/components/dashboard/SideBar.tsx

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { DashboardLinks } from "@/constants/DashboardLinks";
import { Logo } from "@/components/shared/Logo";
import { LogOut, PanelRightOpen } from "lucide-react";
import { signOut } from "@/actions";
import { useDashboardNotifications } from "@/hooks/notifications/useDashboardNotifications";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

const SIDEBAR_KEY = "yomis_sidebar_expanded";

// ─── Tooltip ─────────────────────────────────────────────────────────────────
const Tooltip = ({
  label,
  targetRef,
}: {
  label: string;
  targetRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      setPos({
        top: rect.top + rect.height / 2,
        left: rect.right + 8,
      });
    }
  }, [targetRef]);

  return createPortal(
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -6 }}
      transition={{ duration: 0.15 }}
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        transform: "translateY(-50%)",
        zIndex: 9999,
      }}
      className="px-2.5 py-1.5 rounded-lg bg-choco text-cream
        text-xs font-medium whitespace-nowrap shadow-lg
        pointer-events-none border border-cocoa/30"
    >
      {label}
      {/* Arrow */}
      <div
        className="absolute right-full top-1/2 -translate-y-1/2
        border-4 border-transparent border-r-choco"
      />
    </motion.div>,
    document.body,
  );
};

// ─── NotificationBadge ────────────────────────────────────────────────────────

const NotificationBadge = ({
  count,
  collapsed,
}: {
  count: number;
  collapsed: boolean;
}) => (
  <AnimatePresence>
    {count > 0 && (
      <motion.span
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={`
          min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white
          text-[10px] font-semibold flex items-center justify-center shadow-sm
          ${collapsed ? "absolute -top-1.5 -right-1.5" : "ml-auto shrink-0"}
        `}
      >
        {count > 99 ? "99+" : count}
      </motion.span>
    )}
  </AnimatePresence>
);

// Componente para cada item del nav
const NavItem = ({
  link,
  expanded,
  badgeCount,
}: {
  link: (typeof DashboardLinks)[0];
  expanded: boolean;
  badgeCount: number;
}) => {
  const [hovered, setHovered] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={itemRef}
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <NavLink
        to={link.href}
        className={({ isActive }) => `
          relative flex items-center gap-3 py-2.5 rounded-xl
          transition-all duration-200
          ${expanded ? "px-3" : "px-0 justify-center"}
          ${
            isActive
              ? "bg-cocoa text-cream shadow-sm"
              : "text-cream/60 hover:text-cream hover:bg-cream/10"
          }
        `}
      >
        <div className="relative shrink-0">
          {link.icon}
          {!expanded && (
            <NotificationBadge count={badgeCount} collapsed={true} />
          )}
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center flex-1 min-w-0 overflow-hidden"
            >
              <span className="font-medium text-sm whitespace-nowrap flex-1">
                {link.title}
              </span>
              <NotificationBadge count={badgeCount} collapsed={false} />
            </motion.div>
          )}
        </AnimatePresence>
      </NavLink>

      {/* Tooltip via portal */}
      <AnimatePresence>
        {!expanded && hovered && (
          <Tooltip label={link.title} targetRef={itemRef} />
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── SideBar ──────────────────────────────────────────────────────────────────

export const SideBar = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { pendingOrders, pendingReceipts } = useDashboardNotifications();

  const [expanded, setExpanded] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SIDEBAR_KEY) !== "false";
    } catch {
      return true;
    }
  });

  const toggleSidebar = () => {
    setExpanded((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_KEY, String(next));
      return next;
    });
  };

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
    <>
      {/* Sidebar */}
      <motion.div
        animate={{ width: expanded ? 250 : 64 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="h-screen fixed left-0 top-0 z-30
          bg-fondo-dark text-cream
          flex flex-col
          border-r border-cream/10
          overflow-hidden"
      >
        {/* Logo + Toggle */}
        <div
          className={`shrink-0 flex items-center py-1 px-3
          ${expanded ? "justify-between" : "justify-center flex-col gap-1"}`}
        >
          <AnimatePresence mode="wait">
            {expanded ? (
              <motion.div
                key="logo-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Logo />
              </motion.div>
            ) : (
              <motion.div
                key="logo-icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="size-12 rounded-full overflow-hidden"
              >
                <Link
                  to="/"
                  className="flex items-center transition-all duration-300 hover:scale-105 group"
                  aria-label="Bocaditos Yomi's — Inicio"
                >
                  <img
                    src="/LogoBocaditosYomis.avif"
                    alt="Yomi's"
                    className="w-full h-full object-contain"
                  />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle button */}
          <button
            onClick={toggleSidebar}
            className={`shrink-0 size-7 rounded-full
              bg-cream/10 hover:bg-cocoa/40
              flex items-center justify-center
              transition-colors border border-cream/10
              hover:border-cocoa/50
              ${!expanded ? "mt-1" : ""}`}
            aria-label={expanded ? "Colapsar sidebar" : "Expandir sidebar"}
          >
            <motion.div
              animate={{ rotate: expanded ? 0 : 180 }}
              transition={{ duration: 0.25 }}
            >
              <PanelRightOpen size={14} className="text-cream/60" />
            </motion.div>
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-cream/10 mx-3 shrink-0" />

        {/* Nav */}
        <nav
          className="flex-1 overflow-y-auto overflow-x-hidden
  py-3 px-2 space-y-1 sidebar-scroll"
        >
          {DashboardLinks.map((link) => (
            <NavItem
              key={link.id}
              link={link}
              expanded={expanded}
              badgeCount={badges[link.href] ?? 0}
            />
          ))}
        </nav>

        {/* Divider */}
        <div className="h-px bg-cream/10 mx-3 shrink-0" />

        {/* Logout */}
        <div className="shrink-0 p-3">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 py-2.5 rounded-xl
              text-cream/60 hover:text-red-400 hover:bg-red-500/10
              transition-all duration-200
              ${expanded ? "px-3" : "px-0 justify-center"}`}
          >
            <LogOut size={20} className="shrink-0" />
            <AnimatePresence>
              {expanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-medium text-sm whitespace-nowrap overflow-hidden"
                >
                  Cerrar sesión
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.div>

      {/* Spacer — empuja el contenido según el ancho del sidebar */}
      <motion.div
        animate={{ width: expanded ? 250 : 64 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="shrink-0 h-screen"
        aria-hidden="true"
      />
    </>
  );
};