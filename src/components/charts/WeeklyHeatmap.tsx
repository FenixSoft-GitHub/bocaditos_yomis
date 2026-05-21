import { useOrdersByDayOfWeek } from "@/hooks/analytics/useAnalytics";
import { Loader } from "@/components/shared/Loader";
import { Calendar } from "lucide-react";

export function WeeklyHeatmap() {
  const { data, isLoading } = useOrdersByDayOfWeek();

  const maxOrders = Math.max(...(data?.map((d) => d.orders) ?? [1]));
  const maxRevenue = Math.max(...(data?.map((d) => d.revenue) ?? [1]));

  return (
    <div
      className="bg-cream/50 dark:bg-cream/5 border border-cocoa/20
      dark:border-cream/10 rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-1">
        <Calendar className="w-4 h-4 text-cocoa dark:text-cream/70" />
        <h2 className="text-lg font-bold text-choco dark:text-cream">
          Días más activos
        </h2>
      </div>
      <p className="text-sm text-choco/50 dark:text-cream/50 mb-6">
        Pedidos e ingresos por día de la semana
      </p>

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <Loader size={36} fullScreen={false} />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Heatmap de pedidos */}
          <div>
            <p className="text-xs text-choco/50 dark:text-cream/50 mb-2">
              Pedidos
            </p>
            <div className="grid grid-cols-7 gap-1.5">
              {data?.map((day) => {
                const intensity = maxOrders > 0 ? day.orders / maxOrders : 0;
                return (
                  <div
                    key={day.day}
                    className="flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-full aspect-square rounded-lg transition-all"
                      style={{
                        backgroundColor: `rgba(124, 74, 30, ${0.1 + intensity * 0.9})`,
                      }}
                      title={`${day.day}: ${day.orders} pedidos`}
                    />
                    <span className="text-xs text-choco/50 dark:text-cream/50">
                      {day.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tabla de datos */}
          <div
            className="grid grid-cols-7 gap-1.5 pt-2 border-t
            border-cocoa/10 dark:border-cream/10"
          >
            {data?.map((day) => {
              const intensity = maxRevenue > 0 ? day.revenue / maxRevenue : 0;
              const isBest = day.orders === maxOrders;
              return (
                <div
                  key={day.day}
                  className="flex flex-col items-center gap-0.5"
                >
                  <span
                    className={`text-xs font-bold ${
                      isBest
                        ? "text-cocoa dark:text-butter"
                        : "text-choco/70 dark:text-cream/70"
                    }`}
                  >
                    {day.orders}
                  </span>
                  <div
                    className="w-full h-1 rounded-full"
                    style={{
                      backgroundColor: `rgba(212, 169, 106, ${0.2 + intensity * 0.8})`,
                    }}
                  />
                  <span className="text-[10px] text-choco/40 dark:text-cream/40">
                    Bs.{day.revenue.toFixed(0)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
