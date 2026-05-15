import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";

interface Props {
  to: string;
  label: string;
}

/** Botón "Nuevo X" consistente en todo el Dashboard */
export const DashboardAddButton = ({ to, label }: Props) => (
  <Link
    to={to}
    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-choco text-cream dark:bg-cream dark:text-oscuro hover:bg-cocoa dark:hover:bg-butter text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm"
  >
    <PlusCircle className="size-4" />
    {label}
  </Link>
);