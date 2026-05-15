import { ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

/**
 * Card base para items del Dashboard.
 * Usar dentro de <DashboardSection>.
 */
export const DashboardCard = ({ children, onClick, className = "" }: Props) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 16, scale: 0.98 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.3, ease: "easeOut" },
      },
    }}
    whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}
    transition={{ type: "spring", stiffness: 300, damping: 22 }}
    onClick={onClick}
    className={`bg-cream dark:bg-oscuro border border-cocoa/20 dark:border-cream/10 rounded-xl p-2 flex flex-col ${onClick ? "cursor-pointer" : ""} ${className}`}
  >
    {children}
  </motion.div>
);

