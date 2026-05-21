import { useMonthlySales, useTopSellingProducts } from "@/hooks";
import { TrendingUp, ShoppingBag, DollarSign, Package } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend?: { value: number; positive: boolean } | null;
}

function KPICard({ title, value, subtitle, icon, trend }: KPICardProps) {
  return (
    <div className="bg-cream/50 dark:bg-cream/5 border border-cocoa/20 dark:border-cream/10 rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-choco/60 dark:text-cream/60">{title}</p>
        <div className="w-9 h-9 rounded-xl bg-cocoa/10 dark:bg-cream/5 flex items-center justify-center text-cocoa dark:text-cream/70">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-choco dark:text-cream">{value}</p>
        <p className="text-xs text-choco/50 dark:text-cream/50 mt-0.5">
          {subtitle}
        </p>
      </div>
      {trend && (
        <div
          className={`flex items-center gap-1 text-xs font-medium ${
            trend.positive ? "text-green-500" : "text-red-400"
          }`}
        >
          <TrendingUp
            className={`w-3 h-3 ${!trend.positive ? "rotate-180" : ""}`}
          />
          {trend.positive ? "+" : ""}
          {trend.value.toFixed(1)}% vs mes anterior
        </div>
      )}
    </div>
  );
}

export function KPICards() {
  const { data: monthlySales } = useMonthlySales(12);
  const { data: topProducts } = useTopSellingProducts(1);

  // Calcular KPIs del mes actual y anterior
  const currentMonth = monthlySales?.[monthlySales.length - 1];
  const previousMonth = monthlySales?.[monthlySales.length - 2];

  const totalRevenue =
    monthlySales?.reduce((acc, m) => acc + m.total_sales, 0) ?? 0;

  const totalOrders =
    monthlySales?.reduce((acc, m) => acc + m.total_orders, 0) ?? 0;

  const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Tendencia del mes actual vs anterior
  const revenueTrend =
    currentMonth && previousMonth && previousMonth.total_sales > 0
      ? {
          value:
            ((currentMonth.total_sales - previousMonth.total_sales) /
              previousMonth.total_sales) *
            100,
          positive: currentMonth.total_sales >= previousMonth.total_sales,
        }
      : null;

  const ordersTrend =
    currentMonth && previousMonth && previousMonth.total_orders > 0
      ? {
          value:
            ((currentMonth.total_orders - previousMonth.total_orders) /
              previousMonth.total_orders) *
            100,
          positive: currentMonth.total_orders >= previousMonth.total_orders,
        }
      : null;

  const kpis: KPICardProps[] = [
    {
      title: "Ingresos totales",
      value: `Bs. ${totalRevenue.toFixed(2)}`,
      subtitle: "Últimos 12 meses",
      icon: <DollarSign className="w-4 h-4" />,
      trend: revenueTrend,
    },
    {
      title: "Pedidos totales",
      value: totalOrders.toLocaleString("es-VE"),
      subtitle: "Últimos 12 meses",
      icon: <ShoppingBag className="w-4 h-4" />,
      trend: ordersTrend,
    },
    {
      title: "Ticket promedio",
      value: `Bs. ${avgTicket.toFixed(2)}`,
      subtitle: "Por orden",
      icon: <TrendingUp className="w-4 h-4" />,
      trend: null,
    },
    {
      title: "Producto estrella",
      value: topProducts?.[0]?.name ?? "—",
      subtitle: `${topProducts?.[0]?.value ?? 0} unidades vendidas`,
      icon: <Package className="w-4 h-4" />,
      trend: null,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <KPICard key={kpi.title} {...kpi} />
      ))}
    </div>
  );
}
