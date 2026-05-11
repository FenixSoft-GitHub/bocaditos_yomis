import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  duration?: number;
  className?: string;
}

const directionMap = {
  left: { x: -40, y: 0 },
  right: { x: 40, y: 0 },
  up: { x: 0, y: -40 },
  down: { x: 0, y: 40 },
};

export const SlideIn = ({
  children,
  direction = "left",
  delay = 0,
  duration = 0.35,
  className,
}: Props) => (
  <motion.div
    initial={{ opacity: 0, ...directionMap[direction] }}
    animate={{ opacity: 1, x: 0, y: 0 }}
    exit={{ opacity: 0, ...directionMap[direction] }}
    transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    className={className}
  >
    {children}
  </motion.div>
);
