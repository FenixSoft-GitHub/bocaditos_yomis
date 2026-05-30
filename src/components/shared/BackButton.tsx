import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface Props {
  label?: string;
}

export function BackButton({ label = "Regresar" }: Props) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="
        inline-flex items-center gap-2.5 px-4 py-2 rounded-md
        text-sm font-medium tracking-wide
        text-choco/70 dark:text-cream/70
        bg-transparent hover:bg-cocoa/5 dark:hover:bg-cream/5
        border border-transparent hover:border-cocoa/10 dark:hover:border-cream/10
        active:scale-95
        transition-all duration-200 cubic-bezier(0.4, 0, 0.2, 1)
        group select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cocoa/30
      "
    >
      <div className="relative flex items-center justify-center size-5 rounded-full bg-cocoa/5 dark:bg-cream/5 group-hover:bg-cocoa/10 dark:group-hover:bg-cream/10 transition-colors duration-200">
        <ArrowLeft className="size-3.5 text-choco/60 dark:text-cream/60 transition-transform duration-200 ease-out group-hover:-translate-x-0.5" />
      </div>
      <span className="relative group-hover:text-choco dark:group-hover:text-cream transition-colors duration-200">
        {label}
      </span>
    </button>
  );
}