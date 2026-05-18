import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const StaggerList = ({ children, className, delay = 0 }: Props) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: false, margin: "-30px" }}
    variants={{
      hidden: {},
      visible: { transition: { staggerChildren: 0.08, delayChildren: delay } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);
