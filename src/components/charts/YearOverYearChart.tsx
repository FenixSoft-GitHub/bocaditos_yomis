import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useYearOverYear } from "@/hooks/analytics/useAnalytics";
import { Loader } from "@/components/shared/Loader";
import { TrendingUp } from "lucide-react";

export function YearOverYearChart() {
  const { data, isLoading } = useYearOverYear();
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  return (
    <div
      className="bg-cream/50 dark:bg-cream/5 border border-cocoa/20
      dark:border-cream/10 rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-1">
        <TrendingUp className="w-4 h-4 text-cocoa dark:text-cream/70" />
        <h2 className="text-lg font-bold text-choco dark:text-cream">
          Comparativa anual
        </h2>
      </div>
      <p className="text-sm text-choco/50 dark:text-cream/50 mb-6">
        {currentYear} vs {previousYear} — ingresos por mes
      </p>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader size={36} fullScreen={false} />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(125,90,60,0.1)" />
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
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip
              formatter={(value, name) => [
                `Bs. ${Number(value).toFixed(2)}`,
                name,
              ]}
              contentStyle={{
                background: "var(--color-fondo, #f5f0eb)",
                border: "1px solid rgba(125,90,60,0.2)",
                borderRadius: 12,
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey={`${currentYear}`}
              stroke="#7c4a1e"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey={`${previousYear}`}
              stroke="#d4a96a"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
