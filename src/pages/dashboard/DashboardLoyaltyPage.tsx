// src/pages/dashboard/DashboardLoyaltyPage.tsx
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/supabase/client";
import { motion } from "framer-motion";
import { Trophy, Star, Gift, Users, TrendingUp } from "lucide-react";
import { levelConfig, type LoyaltyLevel } from "@/hooks/loyalty/useLoyalty";

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface LoyaltyDashboardStats {
  total_users: number;
  total_points: number;
  total_redeemed: number;
  by_level: {
    level: LoyaltyLevel;
    count: number;
  }[];
  top_users: {
    full_name: string;
    email: string;
    points: number;
    lifetime_points: number;
    level: LoyaltyLevel;
  }[];
}

interface LoyaltyTransaction {
  id: string;
  type: string;
  points: number;
  description: string;
  created_at: string;
  users: { full_name: string; email: string };
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useLoyaltyDashboardStats() {
  return useQuery({
    queryKey: ["loyalty-dashboard-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_loyalty_dashboard_stats");
      if (error) throw error;
      return data as unknown as LoyaltyDashboardStats;
    },
    staleTime: 1000 * 60 * 5,
  });
}

function useLoyaltyTransactions() {
  return useQuery({
    queryKey: ["loyalty-dashboard-transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loyalty_transactions")
        .select(
          "id, type, points, description, created_at, users(full_name, email)",
        )
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as unknown as LoyaltyTransaction[];
    },
  });
}

// ─── KPI Card ────────────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  icon: Icon,
  color,
  suffix,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  suffix?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-borde rounded-2xl p-5 bg-oscuro/50 space-y-3"
    >
      <div className={`p-2.5 rounded-xl w-fit ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-3xl font-bold text-choco dark:text-cream">
          {value.toLocaleString()}
          {suffix}
        </p>
        <p className="text-sm text-choco/50 dark:text-cream/50 mt-0.5">
          {label}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardLoyaltyPage() {
  const { data: stats, isLoading: isLoadingStats } = useLoyaltyDashboardStats();
  const { data: transactions, isLoading: isLoadingTransactions } =
    useLoyaltyTransactions();

  const typeConfig: Record<string, { label: string; color: string }> = {
    earned: { label: "Ganados", color: "text-green-500" },
    redeemed: { label: "Canjeados", color: "text-blue-500" },
    reversed: { label: "Revertidos", color: "text-red-400" },
    expired: { label: "Expirados", color: "text-stone-400" },
  };

  return (
    <div className="space-y-3.5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-choco dark:text-cream">
          Programa de fidelidad
        </h1>
        <p className="text-sm text-choco/50 dark:text-cream/50 mt-1">
          Estadísticas globales del programa de puntos
        </p>
      </div>

      {/* KPIs */}
      {isLoadingStats ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-cocoa/10 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <KpiCard
            label="Usuarios con puntos"
            value={stats?.total_users ?? 0}
            icon={Users}
            color="bg-blue-500"
          />
          <KpiCard
            label="Puntos en circulación"
            value={stats?.total_points ?? 0}
            icon={Star}
            color="bg-amber-500"
            suffix=" pts"
          />
          <KpiCard
            label="Puntos canjeados"
            value={stats?.total_redeemed ?? 0}
            icon={Gift}
            color="bg-green-500"
            suffix=" pts"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribución por nivel */}
        <div className="border border-borde rounded-2xl p-5 bg-oscuro/50 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-cocoa" />
            <h2 className="font-semibold text-choco dark:text-cream">
              Distribución por nivel
            </h2>
          </div>

          {isLoadingStats ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-14 rounded-xl bg-cocoa/10 animate-pulse"
                />
              ))}
            </div>
          ) : !stats?.by_level?.length ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <Trophy size={32} className="text-choco/20 dark:text-cream/20" />
              <p className="text-sm text-choco/40 dark:text-cream/40">
                Sin datos aún
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {(["bronze", "silver", "gold"] as LoyaltyLevel[]).map((level) => {
                const levelData = stats.by_level.find((l) => l.level === level);
                const count = levelData?.count ?? 0;
                const total = stats.total_users || 1;
                const pct = Math.round((count / total) * 100);
                const conf = levelConfig[level];

                return (
                  <div key={level} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span>{conf.emoji}</span>
                        <span className={`font-medium ${conf.color}`}>
                          {conf.label}
                        </span>
                      </span>
                      <span className="text-choco/60 dark:text-cream/60">
                        {count} usuarios ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-borde overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full rounded-full bg-gradient-to-r ${conf.gradient}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top usuarios */}
        <div
          className="lg:col-span-2 border border-borde rounded-2xl p-5
          bg-oscuro/50 space-y-4"
        >
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-cocoa" />
            <h2 className="font-semibold text-choco dark:text-cream">
              Top usuarios
            </h2>
          </div>

          {isLoadingStats ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-14 rounded-xl bg-cocoa/10 animate-pulse"
                />
              ))}
            </div>
          ) : !stats?.top_users?.length ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <Users size={32} className="text-choco/20 dark:text-cream/20" />
              <p className="text-sm text-choco/40 dark:text-cream/40">
                Sin usuarios con puntos aún
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {stats.top_users.map((user, i) => {
                const conf = levelConfig[user.level];
                return (
                  <motion.div
                    key={user.email}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl
                      hover:bg-cocoa/5 dark:hover:bg-cream/5 transition-colors"
                  >
                    {/* Posición */}
                    <div
                      className={`size-7 rounded-full flex items-center
                      justify-center text-xs font-bold shrink-0 ${
                        i === 0
                          ? "bg-amber-500 text-white"
                          : i === 1
                            ? "bg-slate-400 text-white"
                            : i === 2
                              ? "bg-amber-700 text-white"
                              : "bg-cocoa/10 text-choco/50 dark:text-cream/50"
                      }`}
                    >
                      {i + 1}
                    </div>

                    {/* Avatar */}
                    <div
                      className="size-9 rounded-full bg-cocoa/20 flex items-center
                      justify-center text-sm font-bold text-choco dark:text-cream shrink-0"
                    >
                      {user.full_name.charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-choco dark:text-cream truncate">
                        {user.full_name}
                      </p>
                      <p className="text-xs text-choco/50 dark:text-cream/50 truncate">
                        {user.email}
                      </p>
                    </div>

                    {/* Nivel */}
                    <span className={`text-lg shrink-0`}>{conf.emoji}</span>

                    {/* Puntos */}
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-choco dark:text-cream">
                        {user.points.toLocaleString()}
                      </p>
                      <p className="text-xs text-choco/40 dark:text-cream/40">
                        pts disponibles
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Historial de transacciones */}
      <div className="border border-borde rounded-2xl p-5 bg-oscuro/50 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star size={18} className="text-cocoa" />
            <h2 className="font-semibold text-choco dark:text-cream">
              Historial de transacciones
            </h2>
          </div>
          {transactions && (
            <span className="text-xs text-choco/40 dark:text-cream/40">
              Últimas {transactions.length}
            </span>
          )}
        </div>

        {isLoadingTransactions ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-11 rounded-xl bg-cocoa/10 animate-pulse"
              />
            ))}
          </div>
        ) : !transactions?.length ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <Star size={32} className="text-choco/20 dark:text-cream/20" />
            <p className="text-sm text-choco/40 dark:text-cream/40">
              Sin transacciones aún
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-borde">
                  <th
                    className="text-left pb-3 text-xs font-medium
                    text-choco/50 dark:text-cream/50"
                  >
                    Usuario
                  </th>
                  <th
                    className="text-left pb-3 text-xs font-medium
                    text-choco/50 dark:text-cream/50"
                  >
                    Descripción
                  </th>
                  <th
                    className="text-left pb-3 text-xs font-medium
                    text-choco/50 dark:text-cream/50"
                  >
                    Tipo
                  </th>
                  <th
                    className="text-left pb-3 text-xs font-medium
                    text-choco/50 dark:text-cream/50"
                  >
                    Puntos
                  </th>
                  <th
                    className="text-left pb-3 text-xs font-medium
                    text-choco/50 dark:text-cream/50"
                  >
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borde">
                {transactions.map((tx) => {
                  const conf = typeConfig[tx.type] ?? {
                    label: tx.type,
                    color: "text-choco/50",
                  };
                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-cocoa/5 dark:hover:bg-cream/5 transition-colors"
                    >
                      {/* Usuario */}
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="size-7 rounded-full bg-cocoa/20
                            flex items-center justify-center text-xs font-bold
                            text-choco dark:text-cream shrink-0"
                          >
                            {tx.users?.full_name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p
                              className="font-medium text-choco dark:text-cream
                              truncate max-w-[140px]"
                            >
                              {tx.users?.full_name}
                            </p>
                            <p
                              className="text-xs text-choco/50 dark:text-cream/50
                              truncate max-w-[140px]"
                            >
                              {tx.users?.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Descripción */}
                      <td className="py-3 pr-3">
                        <p className="text-choco/70 dark:text-cream/70 truncate max-w-[200px]">
                          {tx.description}
                        </p>
                      </td>

                      {/* Tipo */}
                      <td className="py-3 pr-3">
                        <span className={`text-xs font-semibold ${conf.color}`}>
                          {conf.label}
                        </span>
                      </td>

                      {/* Puntos */}
                      <td className="py-3 pr-3">
                        <span
                          className={`font-bold text-sm ${
                            tx.points > 0 ? "text-green-500" : "text-red-400"
                          }`}
                        >
                          {tx.points > 0 ? "+" : ""}
                          {tx.points} pts
                        </span>
                      </td>

                      {/* Fecha */}
                      <td className="py-3 text-xs text-choco/50 dark:text-cream/50">
                        {new Date(tx.created_at).toLocaleDateString("es-VE", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
