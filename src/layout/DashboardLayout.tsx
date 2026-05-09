import { SideBar } from "@/components/dashboard";
import ScrollToTop from "@/components/shared/ScrollToTop";
import { Outlet } from "react-router-dom";

/**
 * Layout del dashboard.
 * La protección (sesión + rol admin) la maneja AdminRoute en el router.
 */
const DashboardLayout = () => {
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

export default DashboardLayout;
