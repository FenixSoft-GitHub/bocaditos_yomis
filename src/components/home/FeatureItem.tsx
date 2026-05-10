import { memo } from "react";

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const FeatureItem = memo(
  ({ icon, title, description }: FeatureItemProps) => (
    <div className="flex flex-col items-center gap-3 px-5 py-6 rounded-xl border border-cocoa/30 dark:border-cream/20 bg-cream dark:bg-oscuro text-choco dark:text-cream shadow-sm hover:shadow-md hover:border-cocoa/60 dark:hover:border-cream/50 hover:bg-butter/40 dark:hover:bg-oscuro/80 transition-all duration-300 text-center group">
      <div className="text-choco/80 dark:text-cocoa group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <p className="font-semibold text-sm">{title}</p>
      <p className="text-xs text-choco/60 dark:text-cream/60 leading-relaxed">
        {description}
      </p>
    </div>
  ),
);

FeatureItem.displayName = "FeatureItem";
