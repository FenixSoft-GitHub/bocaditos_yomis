import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@/hooks";
import { useRoleUser } from "@/hooks";
import { Loader } from "@/components/shared/Loader";

/**
 * Protege rutas exclusivas de admin.
 * Sin sesión   → /login
 * Sin rol admin → /
 * OK           → <Outlet />
 */
export const AdminRoute = () => {
  const { session, isLoading: isLoadingSession } = useUser();
  const { data: role, isLoading: isLoadingRole } = useRoleUser(
    session?.user?.id ?? "",
  );

  if (isLoadingSession || isLoadingRole) return <Loader size={50} />;

  if (!session) return <Navigate to="/login" replace />;

  if (role !== "admin") return <Navigate to="/" replace />;

  return <Outlet />;
};
