import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  scale?: number;
}

export const ScaleOnHover = ({ children, className, scale = 1.03 }: Props) => (
  <motion.div
    whileHover={{ scale }}
    whileTap={{ scale: 0.97 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className={className}
  >
    {children}
  </motion.div>
);
