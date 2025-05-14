import { memo } from "react";

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const FeatureItem = memo(
  ({ icon, title, description }: FeatureItemProps) => (
    <div className=" bg-cream border border-cocoa/50 shadow-md flex flex-col items-center gap-3 px-4 py-2 transition-all duration-300 rounded-lg hover:bg-butter/50 hover:border-cocoa/80 text-choco dark:text-cream/80 dark:bg-oscuro dark:border-cream/30 dark:hover:border-cream/80 dark:hover:bg-oscuro/60 dark:hover:text-white">
      <div className="mx-auto flex justify-between items-center gap-4">
        <div>{icon}</div>
        <p className="font-semibold text-center">{title}</p>
      </div>
      <div>
        <p className="text-[12px]">{description}</p>
      </div>
    </div>
  )
);

FeatureItem.displayName = "FeatureItem";
