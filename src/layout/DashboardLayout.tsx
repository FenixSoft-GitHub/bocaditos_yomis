import { SideBar } from "@/components/dashboard";
import ScrollToTop from "@/components/shared/ScrollToTop";
import { Outlet } from "react-router-dom";
// import { useUser } from "@/hooks"; // Importa tu hook recién creado

export const DashboardLayout = () => {
  
  return (
    <div className="flex min-h-screen bg-fondo dark:bg-fondo-dark text-choco dark:text-cream">
      <SideBar />
      <main className="m-5 flex-1 ml-[140px] lg:ml-[270px]">
        <ScrollToTop />
        <Outlet />
      </main>
    </div>
  );
};