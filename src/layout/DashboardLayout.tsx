import { SideBar } from "@/components/dashboard";
import ScrollToTop from "@/components/shared/ScrollToTop";
import { Outlet } from "react-router-dom";
// import { useUser } from "@/hooks"; // Importa tu hook recién creado

export const DashboardLayout = () => {
  // 1. Obtenemos la sesión usando tu hook
  // const { session, isLoading } = useUser();

  // 2. Extraemos el ID del usuario
  // const currentAuthUserId = session?.user?.id;

  // Opcional: Podrías mostrar un loader mientras se valida la sesión
  // if (isLoading) {
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       Cargando...
  //     </div>
  //   );
  // }

  return (
    <div className="flex min-h-screen bg-fondo dark:bg-fondo-dark text-choco dark:text-cream">
      <SideBar />
      <main className="m-5 flex-1 ml-[140px] lg:ml-[270px]">
        <ScrollToTop />
        {/* 3. PASAMOS EL CONTEXTO:
           Ahora 'useOutletContext' en BlogPostForm recibirá este objeto 
           en lugar de 'undefined'.
        */}
        {/* <Outlet context={{ currentAuthUserId }} /> */}
        <Outlet />
      </main>
    </div>
  );
};