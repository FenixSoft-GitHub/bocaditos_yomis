import { useQueryClient } from "@tanstack/react-query";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { signOut } from "@/actions";
import { useRoleUser, useUser } from "@/hooks";
import { LogOut, ExternalLink, FileText } from "lucide-react";
import ScrollToTop from "@/components/shared/ScrollToTop";

/**
 * Layout para /account/...
 * La protección la maneja ProtectedRoute en el router.
 */
const ClientLayout = () => {
  const { session } = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: role } = useRoleUser(session?.user.id as string);

  const handleLogout = async () => {
    await signOut();
    queryClient.removeQueries({ queryKey: ["user"] });
    queryClient.removeQueries({ queryKey: ["user-profile"] });
    navigate("/");
  };

  const btnClass =
    "inline-flex min-w-[160px] justify-center items-center gap-2 px-5 py-2 rounded-full border border-cocoa dark:border-cream/30 bg-cream/70 text-sm font-medium text-choco dark:text-cream dark:bg-cream/30 shadow-sm hover:bg-cocoa/20 hover:font-semibold dark:hover:bg-cocoa/20 hover:underline underline-offset-4 transition-all cursor-pointer";

  return (
    <div className="min-h-screen flex flex-col w-full pt-10 px-4 bg-fondo text-choco dark:bg-fondo-dark dark:text-cream">
      <nav className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 text-center mb-6">
        <NavLink
          to="/account/pedidos"
          className={({ isActive }) =>
            `${btnClass} ${isActive ? "underline" : ""}`
          }
        >
          Pedidos <FileText size={18} />
        </NavLink>

        {role === "admin" && (
          <NavLink to="/dashboard/products" className={btnClass}>
            Dashboard <ExternalLink size={18} />
          </NavLink>
        )}

        <button className={btnClass} onClick={handleLogout}>
          Cerrar sesión <LogOut size={18} />
        </button>
      </nav>

      <main className="flex-1 w-full max-w-6xl mx-auto p-4 rounded-lg">
        <ScrollToTop />
        <Outlet />
      </main>
    </div>
  );
};

export default ClientLayout;
