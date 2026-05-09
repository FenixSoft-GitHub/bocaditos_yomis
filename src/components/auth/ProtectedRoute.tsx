import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@/hooks";
import { Loader } from "@/components/shared/Loader";

interface Props {
  redirectTo?: string;
}

/**
 * Wrapper de ruta protegida.
 * Cargando   → Loader (sin flash de contenido)
 * Sin sesión → redirect a /login
 * OK         → renderiza <Outlet />
 */
export const ProtectedRoute = ({ redirectTo = "/login" }: Props) => {
  const { session, isLoading } = useUser();

  if (isLoading) return <Loader size={50} />;

  if (!session) return <Navigate to={redirectTo} replace />;

  return <Outlet />;
};
