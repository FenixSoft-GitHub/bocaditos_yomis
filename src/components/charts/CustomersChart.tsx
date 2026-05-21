import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  useNewVsReturning,
  useTopCustomers,
} from "@/hooks/analytics/useAnalytics";
import { Loader } from "@/components/shared/Loader";
import { Users } from "lucide-react";
import { useState } from "react";

type View = "trend" | "top";

export function CustomersChart() {
  const [view, setView] = useState<View>("trend");
  const { data: newVsReturning, isLoading: loadingTrend } = useNewVsReturning();
  const { data: topCustomers, isLoading: loadingTop } = useTopCustomers(8);

  const isLoading = view === "trend" ? loadingTrend : loadingTop;

  return (
    <div className="bg-cream/50 dark:bg-cream/5 border border-cocoa/20 dark:border-cream/10 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-cocoa dark:text-cream/70" />
          <div>
            <h2 className="text-lg font-bold text-choco dark:text-cream">
              Clientes
            </h2>
            <p className="text-sm text-choco/50 dark:text-cream/50">
              {view === "trend"
                ? "Nuevos vs recurrentes por mes"
                : "Top clientes por gasto total"}
            </p>
          </div>
        </div>
        <div className="flex gap-1 bg-cocoa/10 dark:bg-cream/5 rounded-xl p-1">
          {(["trend", "top"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                view === v
                  ? "bg-choco dark:bg-cream text-cream dark:text-oscuro shadow"
                  : "text-choco/60 dark:text-cream/60 hover:text-choco dark:hover:text-cream"
              }`}
            >
              {v === "trend" ? "Tendencia" : "Top clientes"}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader size={36} fullScreen={false} />
        </div>
      ) : view === "trend" ? (
        <>
          {/* Totales */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-cocoa/5 dark:bg-cream/5 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-choco dark:text-cream">
                {newVsReturning?.new ?? 0}
              </p>
              <p className="text-xs text-choco/50 dark:text-cream/50">Nuevos</p>
            </div>
            <div className="bg-cocoa/5 dark:bg-cream/5 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-choco dark:text-cream">
                {newVsReturning?.returning ?? 0}
              </p>
              <p className="text-xs text-choco/50 dark:text-cream/50">
                Recurrentes
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={newVsReturning?.chartData ?? []}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(125,90,60,0.1)"
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-fondo, #f5f0eb)",
                  border: "1px solid rgba(125,90,60,0.2)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar
                dataKey="new"
                name="Nuevos"
                fill="#7c4a1e"
                radius={[4, 4, 0, 0]}
                stackId="a"
              />
              <Bar
                dataKey="returning"
                name="Recurrentes"
                fill="#d4a96a"
                radius={[4, 4, 0, 0]}
                stackId="a"
              />
            </BarChart>
          </ResponsiveContainer>
        </>
      ) : (
        <div className="space-y-3">
          {topCustomers?.map((customer, index) => (
            <div
              key={customer.email}
              className="flex items-center gap-3 p-3 bg-cocoa/5 dark:bg-cream/5 rounded-xl"
            >
              <div className="w-8 h-8 rounded-full bg-cocoa/20 dark:bg-cream/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-cocoa dark:text-cream/70">
                  {customer.full_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-choco dark:text-cream truncate">
                  {customer.full_name}
                </p>
                <p className="text-xs text-choco/50 dark:text-cream/50">
                  {customer.total_orders} pedido
                  {customer.total_orders !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-choco dark:text-cream">
                  Bs. {customer.total_spent.toFixed(2)}
                </p>
                <p className="text-xs text-choco/50 dark:text-cream/50">
                  #{index + 1}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
