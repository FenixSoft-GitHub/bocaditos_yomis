import { memo } from "react";
import { motion } from "framer-motion";

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const FeatureItem = memo(
  ({ icon, title, description }: FeatureItemProps) => (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="flex flex-col items-center gap-3 px-5 py-6 rounded-xl border border-cocoa/30 dark:border-cream/20 bg-cream dark:bg-oscuro text-choco dark:text-cream shadow-sm hover:shadow-md hover:border-cocoa/60 dark:hover:border-cream/50 hover:bg-butter/40 dark:hover:bg-oscuro/80 transition-colors duration-300 text-center group cursor-default"
    >
      <motion.div
        whileHover={{ scale: 1.15, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="text-choco/80 dark:text-cocoa"
      >
        {icon}
      </motion.div>
      <p className="font-semibold text-sm">{title}</p>
      <p className="text-xs text-choco/60 dark:text-cream/60 leading-relaxed">
        {description}
      </p>
    </motion.div>
  ),
);

FeatureItem.displayName = "FeatureItem";
