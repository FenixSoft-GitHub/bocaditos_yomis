import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function BackButton({ label = "Regresar" }: { label?: string }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-sm text-oscuro dark:text-amber-400 dark:hover:text-dorado hover:underline font-medium hover:scale-105 transition-all ease-in-out duration-300"
    >
      <ArrowLeft className="size-5" />
      {label}
    </button>
  );
}
