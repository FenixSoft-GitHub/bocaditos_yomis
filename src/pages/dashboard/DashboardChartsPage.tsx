import { KPICards } from "@/components/charts/KPICards";
import { SalesChart } from "@/components/charts/SalesChart";
import { TopProductsChart } from "@/components/charts/TopProductsChart";
import { PeakHoursChart } from "@/components/charts/PeakHoursChart";
import { CustomersChart } from "@/components/charts/CustomersChart";
import { CategoryChart } from "@/components/charts/CategoryChart";
import { LowStockAlert } from "@/components/charts/LowStockAlert";
import { WeeklyHeatmap } from "@/components/charts/WeeklyHeatmap";
import { YearOverYearChart } from "@/components/charts/YearOverYearChart";

export default function DashboardChartsPage() {
  return (
    <section className="space-y-8 p-6">
      {/* Título */}
      <div>
        <h1 className="text-2xl font-bold text-choco dark:text-cream">
          Analytics
        </h1>
        <p className="text-sm text-choco/50 dark:text-cream/50 mt-1">
          Resumen completo del negocio
        </p>
      </div>

      {/* KPIs */}
      <KPICards />

      {/* Gráfica principal de ventas */}
      <SalesChart />

      {/* Comparativa anual */}
      <YearOverYearChart />

      {/* Grid de 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomersChart />
        <CategoryChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PeakHoursChart />
        <WeeklyHeatmap />
      </div>

      {/* Productos */}
      <TopProductsChart />

      {/* Stock bajo — ancho completo al final */}
      <LowStockAlert />
    </section>
  );
}
