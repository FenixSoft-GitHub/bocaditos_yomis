import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { signOut } from "@/actions";
import { useRoleUser, useUser } from "@/hooks";
import { useEffect } from "react";
import { supabase } from "@/supabase/client";
import { Loader } from "@/components/shared/Loader";
import { HiOutlineExternalLink } from "react-icons/hi";
import { IoLogOutOutline } from "react-icons/io5";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import ScrollToTop from "@/components/shared/ScrollToTop";

const ClientLayout = () => {
  const navigate = useNavigate();
  const { session, isLoading: isLoadingSession } = useUser();
  const { data: role, isLoading: isLoadingRole } = useRoleUser(
    session?.user.id as string
  );

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        navigate("/login", { replace: true });
      }
    });
  }, [navigate]);

  if (isLoadingSession || isLoadingRole) return <Loader size={60} />;

  const handleLogout = async () => {
    await signOut();
  };

  const buttonClass =
    "inline-flex min-w-[160px] justify-center items-center gap-2 px-5 py-2 rounded-full border border-cocoa dark:border-cream/30 bg-cream/70 text-sm font-medium text-choco dark:text-cream dark:bg-cream/30 shadow-gray-400 shadow-md hover:bg-cocoa/20 hover:font-semibold dark:hover:bg-cocoa/20 hover:underline underline-offset-4 transition-all shadow-sm cursor-pointer";

  return (
    <div className="min-h-screen flex flex-col w-full pt-38 px-4 bg-fondo text-choco dark:bg-fondo-dark dark:text-cream">
      {/* Navegación */}
      <nav className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 text-center mb-6">
        <NavLink
          to="/account/pedidos"
          className={({ isActive }) =>
            `${buttonClass} ${isActive ? "underline" : ""} group`
          }
        >
          Pedidos <LiaFileInvoiceDollarSolid size={18} />
        </NavLink>

        {role === "admin" && (
          <NavLink to="/dashboard/products" className={buttonClass}>
            Dashboard <HiOutlineExternalLink size={18} />
          </NavLink>
        )}

        <button className={buttonClass} onClick={handleLogout}>
          Cerrar sesión <IoLogOutOutline size={18} />
        </button>
      </nav>

      {/* Contenido */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-4 rounded-lg">
        <ScrollToTop />
        <Outlet />
      </main>
    </div>
  );
};

export default ClientLayout;