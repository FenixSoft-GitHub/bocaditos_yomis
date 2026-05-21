import { useTopSellingProducts, useLeastSellingProducts } from "@/hooks";
import { D3PieChartWithLabels } from "./D3PieChartWithLabels";
import { Loader } from "@/components/shared/Loader";
import { useState } from "react";

type View = "top" | "least";

export function TopProductsChart() {
  const [view, setView] = useState<View>("top");

  const top = useTopSellingProducts(8);
  const least = useLeastSellingProducts(8);

  const { data, isLoading } = view === "top" ? top : least;

  return (
    <div className="bg-cream/50 dark:bg-cream/5 border border-cocoa/20 dark:border-cream/10 rounded-2xl p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-choco dark:text-cream">
            Productos
          </h2>
          <p className="text-sm text-choco/50 dark:text-cream/50">
            Ranking por unidades vendidas
          </p>
        </div>
        <div className="flex gap-1 bg-cocoa/10 dark:bg-cream/5 rounded-xl p-1">
          <button
            onClick={() => setView("top")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              view === "top"
                ? "bg-choco dark:bg-cream text-cream dark:text-oscuro shadow"
                : "text-choco/60 dark:text-cream/60 hover:text-choco dark:hover:text-cream"
            }`}
          >
            Más vendidos
          </button>
          <button
            onClick={() => setView("least")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              view === "least"
                ? "bg-choco dark:bg-cream text-cream dark:text-oscuro shadow"
                : "text-choco/60 dark:text-cream/60 hover:text-choco dark:hover:text-cream"
            }`}
          >
            Menos vendidos
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader size={40} fullScreen={false} />
        </div>
      ) : !data?.length ? (
        <div
          className="flex items-center justify-center h-64
          text-choco/40 dark:text-cream/40 text-sm"
        >
          Sin datos disponibles
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Barras horizontales */}
          <div className="space-y-3">
            {data.map((product, index) => {
              const maxValue = data[0]?.value ?? 1;
              const pct = (product.value / maxValue) * 100;
              return (
                <div key={product.product_id} className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-choco dark:text-cream truncate flex-1">
                      <span className="text-choco/40 dark:text-cream/40 mr-2 text-xs">
                        #{index + 1}
                      </span>
                      {product.name}
                    </p>
                    <span className="text-sm font-semibold text-choco dark:text-cream flex-shrink-0">
                      {product.value} uds
                    </span>
                  </div>
                  <div className="h-2 bg-cocoa/10 dark:bg-cream/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: product.colorFrom,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pie chart D3 */}
          <D3PieChartWithLabels
            data={data}
            title={view === "top" ? "Más vendidos" : "Menos vendidos"}
          />
        </div>
      )}
    </div>
  );
}
