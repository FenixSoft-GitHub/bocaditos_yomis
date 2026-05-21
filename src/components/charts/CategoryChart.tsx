import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useSalesByCategory } from "@/hooks/analytics/useAnalytics";
import { Loader } from "@/components/shared/Loader";
import { Tag } from "lucide-react";

const COLORS = [
  "#7c4a1e",
  "#d4a96a",
  "#a0522d",
  "#deb887",
  "#8b4513",
  "#f4a460",
  "#cd853f",
  "#ffdead",
];

export function CategoryChart() {
  const { data, isLoading } = useSalesByCategory();

  return (
    <div className="bg-cream/50 dark:bg-cream/5 border border-cocoa/20 dark:border-cream/10 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-1">
        <Tag className="w-4 h-4 text-cocoa dark:text-cream/70" />
        <h2 className="text-lg font-bold text-choco dark:text-cream">
          Ventas por categoría
        </h2>
      </div>
      <p className="text-sm text-choco/50 dark:text-cream/50 mb-6">
        Ingresos y unidades por categoría de producto
      </p>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader size={36} fullScreen={false} />
        </div>
      ) : !data?.length ? (
        <div
          className="flex items-center justify-center h-64
          text-choco/40 dark:text-cream/40 text-sm"
        >
          Sin datos disponibles
        </div>
      ) : (
        <div className="space-y-6">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(125,90,60,0.1)"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `Bs.${v}`}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={90}
              />
              <Tooltip
                formatter={(value) => [
                  `Bs. ${Number(value).toFixed(2)}`,
                  "Ingresos",
                ]}
                contentStyle={{
                  background: "var(--color-fondo, #f5f0eb)",
                  border: "1px solid rgba(125,90,60,0.2)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Tabla resumen */}
          <div className="space-y-2">
            {data.map((cat, index) => (
              <div
                key={cat.name}
                className="flex items-center justify-between gap-2 text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-choco dark:text-cream truncate">
                    {cat.name}
                  </span>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="text-choco/50 dark:text-cream/50 text-xs">
                    {cat.units} uds
                  </span>
                  <span className="font-semibold text-choco dark:text-cream">
                    Bs. {cat.revenue.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
