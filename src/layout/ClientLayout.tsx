// src/layout/ClientLayout.tsx

import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { signOut } from "@/actions";
import { useRoleUser, useUser } from "@/hooks";
import {
  LogOut,
  ExternalLink,
  FileText,
  ChevronRight,
  Heart,
  Tag,
  Users,
} from "lucide-react";
import ScrollToTop from "@/components/shared/ScrollToTop";
import { useQueryClient } from "@tanstack/react-query";
import { FadeIn } from "@/components/animations";
import { PushNotificationsBanner } from "@/components/notifications/PushNotificationsBanner";
import { AvatarUpload } from "@/components/account/AvatarUpload";

const navLinks = [
  { to: "/account/pedidos", label: "Mis Pedidos", icon: FileText },
  { to: "/account/favoritos", label: "Mis Favoritos", icon: Heart },
  { to: "/account/cupones", label: "Mis Cupones", icon: Tag },
  { to: "/account/referidos", label: "Referidos", icon: Users },
];

const ClientLayout = () => {
  const { session, userName, avatarUrl, refreshProfile } = useUser();
  const { data: role } = useRoleUser(session?.user.id as string);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const email = session?.user?.email ?? "";
  const initials = userName
    ? userName
        .split(" ") 
        .map((n: string) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : email.charAt(0).toUpperCase();
  const firstName = userName?.split(" ")[0] ?? "Mi cuenta";

  const handleLogout = async () => {
    await signOut();
    queryClient.removeQueries({ queryKey: ["user"] });
    queryClient.removeQueries({ queryKey: ["user-profile"] });
    navigate("/");
  };

  return (
    <div className="min-h-screen pt-4 lg:pt-12 bg-fondo dark:bg-fondo-dark text-choco dark:text-cream">
      <div className="container mx-auto px-4 py-8">
        <FadeIn>
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            {/* ── Sidebar ─────────────────────────────────────────── */}
            <aside className="w-full lg:w-64 shrink-0">
              <div className="bg-cream dark:bg-oscuro border border-cocoa/20 dark:border-cream/10 rounded-2xl overflow-hidden shadow-sm">
                {/* Perfil del usuario */}
                <div className="p-5 border-b border-cocoa/10 dark:border-cream/10">
                  <div className="flex items-center gap-3">
                    {/* Avatar con upload */}
                    <AvatarUpload
                      currentUrl={avatarUrl}
                      initials={initials}
                      onSuccess={() => refreshProfile()}
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {userName || "Mi cuenta"}
                      </p>
                      <p className="text-xs text-choco/50 dark:text-cream/50 truncate">
                        {email}
                      </p>
                      <p className="text-[10px] text-cocoa/70 dark:text-cream/40 mt-0.5">
                        Toca la foto para cambiarla
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navegación */}
                <nav className="p-2">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-choco/40 dark:text-cream/40 px-3 py-2">
                    Mi cuenta
                  </p>

                  {navLinks.map(({ to, label, icon: Icon }) => (
                    <NavLink
                      key={to}
                      to={to}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2.5 mb-2 rounded-xl text-sm font-medium transition-all duration-200 group ${
                          isActive
                            ? "bg-choco text-cream dark:bg-cream dark:text-oscuro shadow-sm"
                            : "text-choco/70 dark:text-cream/70 dark:bg-cocoa/10 bg-cocoa/20 hover:bg-cocoa/10 dark:hover:bg-cream/10 hover:text-choco dark:hover:text-cream"
                        }`
                      }
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="size-4" />
                        {label}
                      </span>
                      <ChevronRight className="size-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </NavLink>
                  ))}

                  {role === "admin" && (
                    <>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-choco/40 dark:text-cream/40 px-3 py-2 mt-2">
                        Administración
                      </p>
                      <NavLink
                        to="/dashboard/products"
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-choco/70 dark:text-cream/70 dark:bg-cocoa/10 bg-cocoa/20 hover:bg-cocoa/10 dark:hover:bg-cream/10 hover:text-choco dark:hover:text-cream transition-all duration-200 group"
                      >
                        <span className="flex items-center gap-2.5">
                          <ExternalLink className="size-4" />
                          Dashboard
                        </span>
                        <ChevronRight className="size-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </NavLink>
                    </>
                  )}

                  <div className="border-t border-cocoa/50 dark:border-cream/20 my-2" />

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 dark:text-red-400 dark:bg-cocoa/10 bg-cocoa/20 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                  >
                    <LogOut className="size-4" />
                    Cerrar sesión
                  </button>
                </nav>
              </div>

              {/* Card de bienvenida */}
              <div className="mt-4 bg-choco dark:bg-cream/10 border border-choco/20 dark:border-cream/10 rounded-2xl p-4 text-cream dark:text-cream">
                <p className="text-xs font-semibold uppercase tracking-widest text-cream/60 mb-1">
                  ¡Hola, {firstName}!
                </p>
                <p className="text-sm leading-relaxed text-cream/80">
                  Desde aquí puedes ver el historial de tus pedidos y gestionar
                  tu cuenta.
                </p>
              </div>
            </aside>

            {/* ── Contenido principal ──────────────────────────────── */}
            <main className="flex-1 min-w-0">
              <ScrollToTop />
              <PushNotificationsBanner />
              <Outlet />
            </main>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default ClientLayout;