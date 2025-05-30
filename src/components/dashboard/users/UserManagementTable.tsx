// src/components/admin/UserManagementTable.tsx

"use client";

import React, { useState } from "react";
import { UserProfile } from "@/interfaces/user.interface";
import { useUpdateUserRole } from "@/hooks";
import { toast } from "react-hot-toast";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal"; // Importa el nuevo modal
import { Search } from "lucide-react";
import { GrPowerReset } from "react-icons/gr";

interface UserManagementTableProps {
  users: UserProfile[];
}

const tableHeaders = ["Nombre Completo", "Email", "Teléfono", "Rol", "Miembro desde"];

export const UserManagementTable: React.FC<UserManagementTableProps> = ({
  users,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { mutate: updateUserRole, isPending: isUpdatingRole } =
    useUpdateUserRole();

  // Estados para el modal de confirmación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [newRoleForSelectedUser, setNewRoleForSelectedUser] =
    useState<string>("");

  // Función que se llama cuando el usuario cambia el rol en el select
  const handleRoleChangeIntent = (user: UserProfile, newRole: string) => {
    setSelectedUser(user);
    setNewRoleForSelectedUser(newRole);
    setIsModalOpen(true); // Abre el modal de confirmación
  };

  // Función que se llama cuando se confirma en el modal
  const handleConfirmRoleChange = () => {
    if (selectedUser && newRoleForSelectedUser) {
      updateUserRole(
        { authUserId: selectedUser.user_id, newRole: newRoleForSelectedUser },
        {
          onSuccess: () => {
            toast.success("Rol de usuario actualizado con éxito!");
            setIsModalOpen(false); // Cierra el modal
            setSelectedUser(null);
            setNewRoleForSelectedUser("");
          },
          onError: (error) => {
            toast.error(`Error al actualizar el rol: ${error.message}`);
          },
        }
      );
    }
  };

  const handleCancelRoleChange = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setNewRoleForSelectedUser("");
    // Opcional: podrías restablecer el select a su valor original si el usuario cancela,
    // pero como el cambio de rol es reactivo con los datos, se actualizará solo.
  };

  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-cream dark:bg-cocoa/10 p-6 rounded-lg shadow-md">
      <div className="mb-4 relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-cream/80">
          <Search className="w-5 h-5" />
        </span>

        <input
          type="text"
          placeholder="Buscar por nombre, email, teléfono o rol..."
          className="w-full pl-10 pr-10 py-2 rounded border shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 dark:bg-fondo-dark dark:text-cream dark:border-cream/30 bg-fondo"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-500 hover:text-amber-700 rounded-full p-1.5 transition-colors duration-200 bg-cream/30"
            title="Limpiar búsqueda"
          >
            <GrPowerReset className="size-4" />
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-md border border-choco dark:border-cream/30">
        <table className="min-w-full divide-y divide-cocoa dark:divide-amber-500">
          <thead className="bg-cocoa/30 text-choco  dark:bg-cream/30 dark:text-cream">
            <tr>
              {tableHeaders.map((header, index) => (
                <th
                  key={index}
                  className={`px-2 sm:px-4 py-3 text-xs font-semibold text-center uppercase tracking-wider ${
                    index === 0 ? "rounded-l-md" : ""
                  } ${index === tableHeaders.length - 1 ? "rounded-r-md" : ""}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-cream dark:bg-fondo-dark divide-y divide-gray-200 dark:divide-cream/30">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-fondo-dark dark:text-cream">
                    {user.full_name}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-choco dark:text-cream/80">
                    {user.email}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-choco dark:text-cream/80">
                    {user.phone || "N/A"}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm">
                    <select
                      className="block w-fit py-1 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm dark:bg-fondo-dark dark:text-gray-100 dark:border-cream/30"
                      value={user.role || "customer"}
                      onChange={(e) =>
                        handleRoleChangeIntent(user, e.target.value)
                      } // Llama a la nueva función
                      disabled={isUpdatingRole}
                    >
                      <option value="customer">Cliente</option>
                      <option value="admin">Admin</option>
                      {/* Agrega más roles si es necesario */}
                    </select>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-choco dark:text-cream/80">
                    {new Date(user.created_at).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-3 text-center text-choco dark:text-gray-400"
                >
                  No se encontraron usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isUpdatingRole && (
        <p className="text-center text-sm mt-4 text-indigo-600 dark:text-indigo-400">
          Actualizando rol...
        </p>
      )}

      {/* Modal de Confirmación */}
      {selectedUser && (
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={handleCancelRoleChange}
          onConfirm={handleConfirmRoleChange}
          title="Confirmar Cambio de Rol"
          message={
            <span>
              ¿Estás seguro de que quieres cambiar el rol de{" "}
              <span className="font-semibold">{selectedUser.full_name}</span> (
              {selectedUser.email}) de{" "}
              <span className="font-semibold">
                {selectedUser.role || "customer"}
              </span>{" "}
              a{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {newRoleForSelectedUser}
              </span>
              ?
              <br />
              <br />
              Esta acción puede otorgar o revocar permisos importantes.
            </span>
          }
          confirmText="Sí, cambiar rol"
          cancelText="No, cancelar"
          isConfirming={isUpdatingRole}
        />
      )}
    </div>
  );
};
