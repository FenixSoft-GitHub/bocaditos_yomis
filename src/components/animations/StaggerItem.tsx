import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export const StaggerItem = ({ children, className }: Props) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 24, scale: 0.97 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.4, ease: "easeOut" },
      },
    }}
    className={className}
  >
    {children}
  </motion.div>
);
