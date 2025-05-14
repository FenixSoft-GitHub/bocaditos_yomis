import { ReactNode } from "react";

interface Props {
  className?: string;
  titleSection?: string;
  children: ReactNode;
}

export const SectionFormProduct = ({
  className,
  titleSection,
  children,
}: Props) => {
  return (
    <div
      className={`h-fit border border-cocoa/30 dark:border-cream/30 bg-cream/80 dark:bg-fondo-dark rounded-md flex flex-col gap-3 p-4 ${className}`}
    >
      {titleSection && (
        <h2 className="font-bold tracking-tight mb-2 text-xl">{titleSection}:</h2>
      )}
      {children}
    </div>
  );
};
