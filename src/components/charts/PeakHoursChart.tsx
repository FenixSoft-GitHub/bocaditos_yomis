import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useOrdersByHour } from "@/hooks/analytics/useAnalytics";
import { Loader } from "@/components/shared/Loader";
import { Clock } from "lucide-react";

export function PeakHoursChart() {
  const { data, isLoading } = useOrdersByHour();

  const maxOrders = Math.max(...(data?.map((d) => d.orders) ?? [1]));

  return (
    <div className="bg-cream/50 dark:bg-cream/5 border border-cocoa/20 dark:border-cream/10 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-1">
        <Clock className="w-4 h-4 text-cocoa dark:text-cream/70" />
        <h2 className="text-lg font-bold text-choco dark:text-cream">
          Horas pico
        </h2>
      </div>
      <p className="text-sm text-choco/50 dark:text-cream/50 mb-6">
        Pedidos por hora del día
      </p>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Loader size={36} fullScreen={false} />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={data}
            margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(125,90,60,0.1)" />
            <XAxis
              dataKey="hour"
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval={2}
            />
            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip
              formatter={(value) => [`${value} pedidos`, "Pedidos"]}
              contentStyle={{
                background: "var(--color-fondo, #f5f0eb)",
                border: "1px solid rgba(125,90,60,0.2)",
                borderRadius: 12,
                fontSize: 12,
              }}
            />
            <Bar
              dataKey="orders"
              radius={[4, 4, 0, 0]}
              fill="#7c4a1e"
              label={false}
            >
              {data?.map((entry, index) => (
                <rect
                  key={index}
                  fill={entry.orders === maxOrders ? "#d4a96a" : "#7c4a1e"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
