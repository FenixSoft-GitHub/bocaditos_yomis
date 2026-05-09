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
      className="inline-flex items-center gap-2 text-sm font-medium text-choco/70 dark:text-cream/70 hover:text-choco dark:hover:text-cream transition-colors duration-200 group"
    >
      <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-1" />
      {label}
    </button>
  );
}
