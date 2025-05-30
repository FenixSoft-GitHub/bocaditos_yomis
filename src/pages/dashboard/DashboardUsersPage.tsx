
"use client";

import React from "react";
import { useAllUsersWithRoles } from "@/hooks";
import { Loader } from "@/components/shared/Loader";
import { UserManagementTable } from "@/components/dashboard/users/UserManagementTable";

const DashboardUsersPage: React.FC = () => {
  const { data: users, isLoading, isError, error } = useAllUsersWithRoles();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size={60} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-10 mt-20">
        <p>Error al cargar los usuarios: {error?.message}</p>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8 mt-20 text-choco dark:text-cream bg-fondo dark:bg-fondo-dark min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-10 drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]">
        Gestión de Usuarios
      </h1>

      <div className="max-w-5xl mx-auto">
        {users && users.length > 0 ? (
          <UserManagementTable users={users} />
        ) : (
          <p className="text-center text-choco dark:text-cream">
            No hay usuarios registrados.
          </p>
        )}
      </div>
    </section>
  );
};

export default DashboardUsersPage;
