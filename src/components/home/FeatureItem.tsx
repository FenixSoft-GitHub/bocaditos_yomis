import { memo } from "react";

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const FeatureItem = memo(
  ({ icon, title, description }: FeatureItemProps) => (
    <div className=" bg-cream border border-caramel/60 shadow-md flex items-center gap-6 px-4 py-2 transition-all duration-300 rounded-lg hover:bg-butter hover:border-cream text-choco dark:text-cream/80 dark:bg-oscuro dark:border-choco/60 dark:hover:bg-oscuro/60 dark:hover:text-white">
      <div>{icon}</div>
      <div className="space-y-1">
        <p className="font-semibold">{title}</p>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  )
);

FeatureItem.displayName = "FeatureItem";
