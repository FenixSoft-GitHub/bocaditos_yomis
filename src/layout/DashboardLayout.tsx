// src/layout/DashboardLayout.tsx
import { SideBar } from "@/components/dashboard";
import ScrollToTop from "@/components/shared/ScrollToTop";
import { Outlet } from "react-router-dom";

export const DashboardLayout = () => {
  return (
    <div
      className="flex min-h-screen bg-fondo dark:bg-fondo-dark
      text-choco dark:text-cream"
    >
      <SideBar />
      <main className="flex-1 min-w-0 p-5">
        <ScrollToTop />
        <Outlet />
      </main>
    </div>
  );
};