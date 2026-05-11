import { motion } from "framer-motion";

interface Props {
  numberOfProducts: number;
}

export const ProductGridSkeleton = ({ numberOfProducts }: Props) => {
  return (
    <div className="my-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: numberOfProducts }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="flex flex-col rounded-xl border border-cocoa/20 dark:border-cream/10 bg-cream dark:bg-fondo-dark overflow-hidden shadow-sm"
          >
            <div className="aspect-square bg-cocoa/10 dark:bg-cream/5 animate-pulse" />
            <div className="p-4 flex flex-col gap-3">
              <div className="h-4 bg-cocoa/10 dark:bg-cream/10 rounded-full animate-pulse w-3/4" />
              <div className="h-4 bg-cocoa/10 dark:bg-cream/10 rounded-full animate-pulse w-1/2" />
              <div className="flex items-center justify-between mt-1">
                <div className="h-5 bg-cocoa/10 dark:bg-cream/10 rounded-full animate-pulse w-16" />
                <div className="w-9 h-9 bg-cocoa/10 dark:bg-cream/10 rounded-full animate-pulse" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
