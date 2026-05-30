// src/components/dashboard/coupons/AutoCouponsTable.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/supabase/client";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import { Ticket, Search } from "lucide-react";

interface AutoCoupon {
  id: string;
  code: string;
  type: "welcome" | "birthday" | "review";
  discount: number;
  expires_at: string;
  used_at: string | null;
  email_sent: boolean;
  created_at: string;
  users: { full_name: string; email: string };
}

const typeLabels = {
  welcome: "🎉 Bienvenida",
  birthday: "🎂 Cumpleaños",
  review: "⭐ Reseña",
};

const HEADTABLE = [
  "Código",
  "Usuario",
  "Tipo",
  "Descuento",
  "Vence",
  "Estado",
  "Email",
];

const ITEMS_PER_PAGE = 10;

export function AutoCouponsTable() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["auto-coupons", search, filterType, filterStatus, page],
    queryFn: async () => {
      let query = supabase
        .from("auto_coupons")
        .select("*, users(full_name, email)", { count: "exact" })
        .order("created_at", { ascending: false })
        .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

      if (filterType !== "all") query = query.eq("type", filterType);
      if (filterStatus === "used") query = query.not("used_at", "is", null);
      if (filterStatus === "unused") query = query.is("used_at", null);
      if (filterStatus === "expired") {
        query = query
          .is("used_at", null)
          .lt("expires_at", new Date().toISOString());
      }

      const { data, error, count } = await query;
      if (error) throw error;
      return { coupons: data as unknown as AutoCoupon[], total: count ?? 0 };
    },
  });

  const coupons = data?.coupons ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const getCouponStatus = (coupon: AutoCoupon) => {
    if (coupon.used_at) return "used";
    if (new Date(coupon.expires_at) < new Date()) return "expired";
    return "active";
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header igual al DashboardSection pero sin grid */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-cocoa/10">
          <Ticket size={20} className="text-cocoa" />
        </div>
        <h2 className="text-2xl font-bold text-choco dark:text-cream">
          Cupones generados
        </h2>
        <span
          className="inline-flex items-center justify-center size-6 rounded-full
          bg-cocoa/20 dark:bg-cream/20 text-xs font-bold text-choco dark:text-cream"
        >
          {total}
        </span>
      </div>
      <p className="text-xs text-choco/50 dark:text-cream/50 -mt-3">
        Historial de todos los cupones automáticos enviados
      </p>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-choco/40 dark:text-cream/40"
          />
          <input
            type="text"
            placeholder="Buscar por código o email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 rounded-lg border
              bg-fondo dark:bg-oscuro border-borde border-choco/50
              text-choco dark:text-cream text-sm
              focus:outline-none focus:ring-2 focus:ring-cocoa/40"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 rounded-lg border bg-fondo dark:bg-oscuro border-choco/50
            border-borde text-choco dark:text-cream text-sm
            focus:outline-none focus:ring-2 focus:ring-cocoa/40"
        >
          <option value="all">Todos los tipos</option>
          <option value="welcome">Bienvenida</option>
          <option value="birthday">Cumpleaños</option>
          <option value="review">Reseña</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 rounded-lg border bg-fondo dark:bg-oscuro
            border-choco/50 text-choco dark:text-cream text-sm
            focus:outline-none focus:ring-2 focus:ring-cocoa/40"
        >
          <option value="all">Todos los estados</option>
          <option value="unused">Sin usar</option>
          <option value="used">Usados</option>
          <option value="expired">Expirados</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl border border-borde border-choco/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-borde bg-cocoa/5 dark:bg-cream/5 border-choco/50">
            {HEADTABLE.map((header) => (
              <th
                key={header}
                className="text-left px-4 py-3 text-choco/60 dark:text-cream/60 font-medium"
              >
                {header} 
                </th>
            ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-borde divide-choco/50">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i}>
                  {[...Array(7)].map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 rounded bg-cocoa/10 dark:bg-cream/10 animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : coupons.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-12 text-choco/40 dark:text-cream/40"
                >
                  No hay cupones generados aún
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr
                  key={coupon.id}
                  className="hover:bg-cocoa/5 dark:hover:bg-cream/5 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="font-mono font-semibold text-cocoa tracking-wider">
                      {coupon.code}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-choco dark:text-cream">
                      {coupon.users?.full_name}
                    </p>
                    <p className="text-xs text-choco/50 dark:text-cream/50">
                      {coupon.users?.email}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-choco/70 dark:text-cream/70">
                    {typeLabels[coupon.type]}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-choco dark:text-cream">
                      {coupon.discount}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-choco/60 dark:text-cream/60 text-xs">
                    {new Date(coupon.expires_at).toLocaleDateString("es-VE", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={getCouponStatus(coupon)} />
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        coupon.email_sent
                          ? "bg-green-500/10 text-green-400 border border-green-500/30"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {coupon.email_sent ? "Enviado" : "Pendiente"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-choco/50 dark:text-cream/50">
            {total} cupones en total
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-borde text-sm
                text-choco/70 dark:text-cream/70 hover:text-choco dark:hover:text-cream
                disabled:opacity-40 transition-colors"
            >
              Anterior
            </button>
            <span className="px-3 py-1.5 text-sm text-choco/50 dark:text-cream/50">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg border border-borde text-sm
                text-choco/70 dark:text-cream/70 hover:text-choco dark:hover:text-cream
                disabled:opacity-40 transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
