// src/layout/DashboardLayout.tsx
import { getSession, getUserRole } from "@/actions";
import { SideBar } from "@/components/dashboard";
import { Loader } from "@/components/shared/Loader";
import ScrollToTop from "@/components/shared/ScrollToTop";
import { useUser } from "@/hooks"; // Asumo que este hook ya te da el session.session
import { supabase } from "@/supabase/client";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { isLoading, session } = useUser(); // Este useUser debe darte el session.session de Supabase
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      setRoleLoading(true);
      const currentSession = await getSession(); // Obtiene la sesión actual
      if (!currentSession) {
        navigate("/login");
        return; // Detiene la ejecución si no hay sesión
      }

      // Asegúrate de que currentSession.session.user.id no sea null antes de usarlo
      const userId = currentSession.session?.user?.id;
      if (!userId) {
        console.error("User ID not found in session.");
        navigate("/login", { replace: true });
        return;
      }

      const role = await getUserRole(userId);

      if (role !== "admin") {
        navigate("/", { replace: true });
      }

      setRoleLoading(false);
    };

    checkRole();

    // Listener para cambios de estado de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          navigate("/login", { replace: true });
        }
      }
    );

    // Limpiar el listener al desmontar el componente
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  // Si está cargando el usuario, la sesión o el rol, muestra el loader
  if (isLoading || !session || roleLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size={60} />
      </div>
    );
  }

  // Si ya estamos aquí, sabemos que session.session.user.id existe y que el rol es 'admin'
  const currentAuthUserId = session?.user?.id;

  if (!currentAuthUserId) {
    // Esto no debería suceder si las comprobaciones anteriores son correctas,
    // pero es un fallback de seguridad
    console.error("User ID is missing after loading session.");
    navigate("/login", { replace: true });
    return null;
  }

  return (
    <div className="flex min-h-screen bg-fondo dark:bg-fondo-dark text-choco dark:text-cream">
      <SideBar />
      <main className="m-5 flex-1 ml-[140px] lg:ml-[270px] bg-fondo dark:bg-fondo-dark text-choco dark:text-cream">
        <ScrollToTop />
        {/* Pasa el ID del usuario autenticado como contexto a las rutas anidadas */}
        <Outlet context={{ currentAuthUserId: currentAuthUserId }} />
      </main>
    </div>
  );
};

export default DashboardLayout;