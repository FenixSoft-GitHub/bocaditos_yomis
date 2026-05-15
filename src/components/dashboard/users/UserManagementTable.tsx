import { useState, useMemo } from "react";
import { UserProfile } from "@/interfaces/user.interface";
import { useUpdateUserRole } from "@/hooks";
import { toast } from "react-hot-toast";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { AdvancedFilter } from "@/components/shared/AdvancedFilter";
import { Pagination } from "@/components/shared/Pagination";
import { User, Mail, Phone, Shield, Calendar } from "lucide-react";
import { DashboardSection } from "@/components/dashboard/shared/DashboardSection";
import { DashboardCard } from "@/components/dashboard/shared/DashboardCard";

interface Props {
  users: UserProfile[];
}

const ITEMS_PER_PAGE = 9;

const roleConfig: Record<string, { label: string; className: string }> = {
  admin: {
    label: "Admin",
    className:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
  customer: {
    label: "Cliente",
    className:
      "bg-blue-100   text-blue-700   dark:bg-blue-900/30   dark:text-blue-400",
  },
};

export const UserManagementTable = ({ users }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [newRole, setNewRole] = useState("");
  const { mutate: updateUserRole, isPending } = useUpdateUserRole();

  const handleRoleChangeIntent = (user: UserProfile, role: string) => {
    setSelectedUser(user);
    setNewRole(role);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    if (selectedUser && newRole) {
      updateUserRole(
        { authUserId: selectedUser.user_id, newRole },
        {
          onSuccess: () => {
            toast.success("Rol actualizado correctamente");
            setIsModalOpen(false);
          },
          onError: (e) => toast.error(`Error: ${e.message}`),
        },
      );
    }
  };

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return users.filter((u) =>
      [u.full_name, u.email, u.phone, u.role].some((f) =>
        f?.toLowerCase().includes(term),
      ),
    );
  }, [users, searchTerm]);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, page]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  return (
    <>
      <DashboardSection
        title="Usuarios"
        description="Administra los roles y permisos de los usuarios"
        count={users.length}
        filters={
          <AdvancedFilter
            searchValue={searchTerm}
            onSearchChange={handleSearchChange}
            onClear={() => {
              setSearchTerm("");
              setPage(1);
            }}
          />
        }
        isEmpty={filteredUsers.length === 0}
        empty={
          <>
            <User className="size-12" />
            <p className="text-sm font-medium">No se encontraron usuarios</p>
          </>
        }
      >
        {paginatedUsers.map((user) => {
          const role = user.role || "customer";
          const roleStyle = roleConfig[role] ?? roleConfig.customer;

          return (
            <DashboardCard key={user.id} className={"gap-3.5 m-1"}>
              {/* Avatar + nombre */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cocoa/20 dark:bg-cream/20 flex items-center justify-center shrink-0 text-sm font-bold text-choco dark:text-cream">
                  {user.full_name?.charAt(0)?.toUpperCase() ?? "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-choco dark:text-cream truncate">
                    {user.full_name}
                  </p>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${roleStyle.className}`}
                  >
                    <Shield className="size-2.5 mr-1" />
                    {roleStyle.label}
                  </span>
                </div>
                <div className="size-10 rounded-full bg-cocoa/20 flex items-center justify-center shrink-0 text-sm font-bold text-choco dark:text-cream">
                  <User className="size-4" />
                </div>
              </div>

              {/* Info */}
              <div className="space-y-1.5 pt-2 border-t border-cocoa/10 dark:border-cream/10 text-xs text-choco/70 dark:text-cream/70">
                <div className="flex items-center gap-1.5">
                  <Mail className="size-3 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="size-3 shrink-0" />
                    <span>{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-3 shrink-0" />
                  <span>
                    {new Date(user.created_at).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Cambio de rol */}
              <select
                value={role}
                onChange={(e) => handleRoleChangeIntent(user, e.target.value)}
                disabled={isPending}
                className="w-full text-xs border border-cocoa/20 dark:border-cream/20 rounded-lg px-3 py-2 bg-fondo dark:bg-fondo-dark text-choco dark:text-cream focus:outline-none focus:ring-2 focus:ring-choco/20 cursor-pointer disabled:opacity-50"
              >
                <option value="customer">Cliente</option>
                <option value="admin">Admin</option>
              </select>
            </DashboardCard>
          );
        })}

        {/* Paginación */}
        {filteredUsers.length > ITEMS_PER_PAGE && (
          <div className="sm:col-span-2 xl:col-span-3 pt-2 border-t border-cocoa/20 dark:border-cream/10">
            <Pagination
              page={page}
              setPage={setPage}
              totalItems={filteredUsers.length}
            />
          </div>
        )}
      </DashboardSection>

      {selectedUser && (
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirm}
          title="Confirmar cambio de rol"
          message={
            <span>
              ¿Cambiar el rol de <strong>{selectedUser.full_name}</strong> a{" "}
              <strong className="text-choco dark:text-cream">
                {newRole === "admin" ? "Admin" : "Cliente"}
              </strong>
              ?
            </span>
          }
          confirmText="Sí, cambiar"
          cancelText="Cancelar"
          isConfirming={isPending}
        />
      )}
    </>
  );
};