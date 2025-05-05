interface Props {
  className?: string;
}

export const Separator = ({ className }: Props) => {
  return <div className={`bg-choco/70 h-px my-3 dark:bg-cream/70 ${className}`} />;
};
