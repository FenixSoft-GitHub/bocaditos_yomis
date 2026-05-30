import { ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  title: string;
  description: string;
  count?: number;
  icon?: ReactNode;
  isLoading?: boolean;
  action?: ReactNode;
  filters?: ReactNode;
  children: ReactNode;
  empty?: ReactNode;
  isEmpty?: boolean;
  className?: string;
}

export const DashboardSection = ({
  title,
  description,
  count,
  icon,
  isLoading = false,
  action,
  filters,
  children,
  empty,
  className,
  isEmpty = false,
}: Props) => (
  <div className="flex flex-col gap-4.5">
    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 -mb-5">
      <div className={className}>
        <div className="flex items-center gap-2">
          {icon && <div className="p-1.5 rounded-lg bg-cocoa/10">{icon}</div>}
          <h1 className="text-2xl font-bold text-choco dark:text-cream">
            {title}
          </h1>
          {count !== undefined && (
            <span className="inline-flex items-center justify-center size-6 rounded-full bg-cocoa/20 dark:bg-cream/20 text-xs font-bold text-choco dark:text-cream">
              {count}
            </span>
          )}
        </div>
        <p className="text-xs text-choco/50 dark:text-cream/50 mt-0.5">
          {description}
        </p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>

    {/* Filtros */}
    {filters && <div>{filters}</div>}

    {/* Loading */}
    {isLoading ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-40 rounded-xl bg-cocoa/5 dark:bg-cream/5 animate-pulse"
          />
        ))}
      </div>
    ) : isEmpty && empty ? (
      <div className="flex flex-col items-center justify-center py-10 gap-4 text-choco/40 dark:text-cream/40">
        {empty}
      </div>
    ) : (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.05 } },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        {children}
      </motion.div>
    )}
  </div>
);