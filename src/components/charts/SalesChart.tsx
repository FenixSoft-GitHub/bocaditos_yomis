import { useState } from "react";
import {
  LineChart,
  Line,
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
  useDailySales,
  useWeeklySales,
  useMonthlySales,
  useAnnualSales,
} from "@/hooks";
import { Loader } from "@/components/shared/Loader";

type Period = "daily7" | "daily30" | "weekly12" | "monthly" | "annual";

const PERIODS: { key: Period; label: string }[] = [
  { key: "daily7", label: "7 días" },
  { key: "daily30", label: "30 días" },
  { key: "weekly12", label: "12 semanas" },
  { key: "monthly", label: "12 meses" },
  { key: "annual", label: "5 años" },
];

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-fondo dark:bg-oscuro border border-cocoa/20 dark:border-cream/10 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs text-choco/60 dark:text-cream/60 mb-2">{label}</p>
      {payload.map((entry) => (
        <p
          key={entry.name}
          className="text-sm font-semibold"
          style={{ color: entry.color }}
        >
          {entry.name}:{" "}
          {entry.name.includes("Ventas")
            ? `Bs. ${Number(entry.value).toFixed(2)}`
            : entry.value}
        </p>
      ))}
    </div>
  );
};

export function SalesChart() {
  const [period, setPeriod] = useState<Period>("monthly");

  const daily7 = useDailySales(7);
  const daily30 = useDailySales(30);
  const weekly12 = useWeeklySales(12);
  const monthly = useMonthlySales(12);
  const annual = useAnnualSales(5);

  const dataMap = {
    daily7: { data: daily7.data, isLoading: daily7.isLoading, xKey: "date" },
    daily30: { data: daily30.data, isLoading: daily30.isLoading, xKey: "date" },
    weekly12: {
      data: weekly12.data,
      isLoading: weekly12.isLoading,
      xKey: "week_start_date",
    },
    monthly: {
      data: monthly.data,
      isLoading: monthly.isLoading,
      xKey: "month",
    },
    annual: { data: annual.data, isLoading: annual.isLoading, xKey: "year" },
  };

  const { data, isLoading, xKey } = dataMap[period];
  const isBar = period === "weekly12" || period === "annual";
//   const isBar =
//     period === "weekly4" || period === "weekly12" || period === "annual";

  return (
    <div className="bg-cream/50 dark:bg-cream/5 border border-cocoa/20 dark:border-cream/10 rounded-2xl p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-choco dark:text-cream">
            Ventas
          </h2>
          <p className="text-sm text-choco/50 dark:text-cream/50">
            Ingresos y pedidos por período
          </p>
        </div>

        {/* Selector de período */}
        <div className="flex flex-wrap gap-4  rounded-xl p-1">
          {PERIODS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all bg-cocoa/10 dark:bg-cream/5 ${
                period === key
                  ? "bg-choco dark:bg-cream text-cream dark:text-cream/90 shadow"
                  : "text-choco/60 dark:text-cream/50 hover:text-choco dark:hover:text-cream"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Gráfica */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader size={40} fullScreen={false} />
        </div>
      ) : !data?.length ? (
        <div
          className="flex items-center justify-center h-64
          text-choco/40 dark:text-cream/40 text-sm"
        >
          Sin datos para este período
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          {isBar ? (
            <BarChart
              data={data}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(125,90,60,0.1)"
              />
              <XAxis
                dataKey={xKey}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar
                dataKey="total_sales"
                name="Ventas Bs."
                fill="#7c4a1e"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="total_orders"
                name="Pedidos #"
                fill="#d4a96a"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          ) : (
            <LineChart
              data={data}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(125,90,60,0.1)"
              />
              <XAxis
                dataKey={xKey}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="total_sales"
                name="Ventas Bs."
                stroke="#7c4a1e"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="total_orders"
                name="Pedidos #"
                stroke="#d4a96a"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );
}
