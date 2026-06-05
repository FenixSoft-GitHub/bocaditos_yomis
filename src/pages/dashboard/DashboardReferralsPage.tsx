// src/pages/dashboard/DashboardReferralsPage.tsx
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/supabase/client";
import { motion } from "framer-motion";
import { Users, Trophy, Clock, CheckCircle } from "lucide-react";

interface ReferralStats {
  total: number;
  completed: number;
  pending: number;
  top_referrers: {
    full_name: string;
    email: string;
    total: number;
    completed: number;
  }[];
}

interface Referral {
  id: string;
  ref_code: string;
  status: "pending" | "completed";
  created_at: string;
  completed_at: string | null;
  referrer: { full_name: string; email: string };
  referred: { full_name: string; email: string };
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useReferralDashboardStats() {
  return useQuery({
    queryKey: ["referral-dashboard-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc(
        "get_referral_dashboard_stats",
      );
      if (error) throw error;
      return data as unknown as ReferralStats;
    },
    staleTime: 1000 * 60 * 5,
  });
}

function useReferrals() {
  return useQuery({
    queryKey: ["dashboard-referrals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("referrals")
        .select(
          `
          id,
          ref_code,
          status,
          created_at,
          completed_at,
          referrer:users!referrer_id(full_name, email),
          referred:users!referred_id(full_name, email)
        `,
        )
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as unknown as Referral[];
    },
  });
}

// ─── KPI Card ────────────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
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
        <p className="text-3xl font-bold text-choco dark:text-cream">{value}</p>
        <p className="text-sm text-choco/50 dark:text-cream/50 mt-0.5">
          {label}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DashboardReferralsPage() {
  const { data: stats, isLoading: isLoadingStats } =
    useReferralDashboardStats();
  const { data: referrals, isLoading: isLoadingReferrals } = useReferrals();

  const conversionRate = stats?.total
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-choco dark:text-cream">
          Programa de referidos
        </h1>
        <p className="text-sm text-choco/50 dark:text-cream/50 mt-1">
          Seguimiento del programa de referidos y sus recompensas
        </p>
      </div>

      {/* KPIs */}
      {isLoadingStats ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-cocoa/10 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Total referidos"
            value={stats?.total ?? 0}
            icon={Users}
            color="bg-blue-500"
          />
          <KpiCard
            label="Completados"
            value={stats?.completed ?? 0}
            icon={CheckCircle}
            color="bg-green-500"
          />
          <KpiCard
            label="Pendientes"
            value={stats?.pending ?? 0}
            icon={Clock}
            color="bg-amber-500"
          />
          <KpiCard
            label="Tasa de conversión"
            value={conversionRate}
            icon={Trophy}
            color="bg-purple-500"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top referidores */}
        <div className="border border-borde rounded-2xl p-5 bg-oscuro/50 space-y-4">
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-cocoa" />
            <h2 className="font-semibold text-choco dark:text-cream">
              Top referidores
            </h2>
          </div>

          {isLoadingStats ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 rounded-lg bg-cocoa/10 animate-pulse"
                />
              ))}
            </div>
          ) : !stats?.top_referrers?.length ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <Trophy size={32} className="text-choco/20 dark:text-cream/20" />
              <p className="text-sm text-choco/40 dark:text-cream/40">
                Aún no hay referidos completados
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {stats.top_referrers.map((referrer, i) => (
                <motion.div
                  key={referrer.email}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl
                    hover:bg-cocoa/5 dark:hover:bg-cream/5 transition-colors"
                >
                  {/* Posición */}
                  <div
                    className={`size-7 rounded-full flex items-center justify-center
                    text-xs font-bold shrink-0 ${
                      i === 0
                        ? "bg-amber-500 text-white"
                        : i === 1
                          ? "bg-stone-400 text-white"
                          : i === 2
                            ? "bg-amber-700 text-white"
                            : "bg-cocoa/10 text-choco/50 dark:text-cream/50"
                    }`}
                  >
                    {i + 1}
                  </div>

                  {/* Avatar */}
                  <div
                    className="size-8 rounded-full bg-cocoa/20 flex items-center
                    justify-center text-xs font-bold text-choco dark:text-cream shrink-0"
                  >
                    {referrer.full_name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-choco dark:text-cream truncate">
                      {referrer.full_name}
                    </p>
                    <p className="text-xs text-choco/50 dark:text-cream/50 truncate">
                      {referrer.email}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-green-500">
                      {referrer.completed}
                    </p>
                    <p className="text-xs text-choco/40 dark:text-cream/40">
                      completados
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Historial de referidos */}
        <div
          className="lg:col-span-2 border border-borde rounded-2xl p-5
          bg-oscuro/50 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-cocoa" />
              <h2 className="font-semibold text-choco dark:text-cream">
                Historial reciente
              </h2>
            </div>
            {referrals && (
              <span className="text-xs text-choco/40 dark:text-cream/40">
                Últimos {referrals.length}
              </span>
            )}
          </div>

          {isLoadingReferrals ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-14 rounded-lg bg-cocoa/10 animate-pulse"
                />
              ))}
            </div>
          ) : !referrals?.length ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Users size={32} className="text-choco/20 dark:text-cream/20" />
              <p className="text-sm text-choco/40 dark:text-cream/40">
                Aún no hay referidos registrados
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
                      Referidor
                    </th>
                    <th
                      className="text-left pb-3 text-xs font-medium
                      text-choco/50 dark:text-cream/50"
                    >
                      Referido
                    </th>
                    <th
                      className="text-left pb-3 text-xs font-medium
                      text-choco/50 dark:text-cream/50"
                    >
                      Código
                    </th>
                    <th
                      className="text-left pb-3 text-xs font-medium
                      text-choco/50 dark:text-cream/50"
                    >
                      Estado
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
                  {referrals.map((referral) => (
                    <tr
                      key={referral.id}
                      className="hover:bg-cocoa/5 dark:hover:bg-cream/5 transition-colors"
                    >
                      {/* Referidor */}
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="size-7 rounded-full bg-cocoa/20
                            flex items-center justify-center text-xs font-bold
                            text-choco dark:text-cream shrink-0"
                          >
                            {referral.referrer?.full_name
                              ?.charAt(0)
                              ?.toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p
                              className="font-medium text-choco dark:text-cream truncate
                              max-w-[120px]"
                            >
                              {referral.referrer?.full_name}
                            </p>
                            <p
                              className="text-xs text-choco/50 dark:text-cream/50
                              truncate max-w-[120px]"
                            >
                              {referral.referrer?.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Referido */}
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="size-7 rounded-full bg-green-500/20
                            flex items-center justify-center text-xs font-bold
                            text-green-600 shrink-0"
                          >
                            {referral.referred?.full_name
                              ?.charAt(0)
                              ?.toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p
                              className="font-medium text-choco dark:text-cream truncate
                              max-w-[120px]"
                            >
                              {referral.referred?.full_name}
                            </p>
                            <p
                              className="text-xs text-choco/50 dark:text-cream/50
                              truncate max-w-[120px]"
                            >
                              {referral.referred?.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Código */}
                      <td className="py-3 pr-3">
                        <span
                          className="font-mono text-xs font-semibold
                          text-cocoa dark:text-dorado tracking-wider"
                        >
                          {referral.ref_code}
                        </span>
                      </td>

                      {/* Estado */}
                      <td className="py-3 pr-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1
                          rounded-full text-xs font-semibold ${
                            referral.status === "completed"
                              ? "bg-green-500/10 text-green-400 border border-green-500/30"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {referral.status === "completed" ? (
                            <>
                              <CheckCircle size={10} /> Completado
                            </>
                          ) : (
                            <>
                              <Clock size={10} /> Pendiente
                            </>
                          )}
                        </span>
                      </td>

                      {/* Fecha */}
                      <td className="py-3 text-xs text-choco/50 dark:text-cream/50">
                        {new Date(
                          referral.completed_at ?? referral.created_at,
                        ).toLocaleDateString("es-VE", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
