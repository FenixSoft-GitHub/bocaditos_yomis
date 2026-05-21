import { useLowStockProducts } from "@/hooks/analytics/useAnalytics";
import { AlertTriangle, Package } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function LowStockAlert() {
  const [threshold, setThreshold] = useState(10);
  const { data, isLoading } = useLowStockProducts(threshold);

  return (
    <div className="bg-cream/50 dark:bg-cream/5 border border-cocoa/20 dark:border-cream/10 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <div>
            <h2 className="text-lg font-bold text-choco dark:text-cream">
              Stock bajo
            </h2>
            <p className="text-sm text-choco/50 dark:text-cream/50">
              Productos que necesitan reabastecimiento
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-choco/50 dark:text-cream/50">
            Umbral:
          </span>
          <select
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="text-xs bg-cocoa/10 dark:bg-cream/5 border border-cocoa/20
              dark:border-cream/10 rounded-lg px-2 py-1.5 text-choco dark:text-cream
              focus:outline-none"
          >
            {[5, 10, 20, 50].map((v) => (
              <option key={v} value={v}>
                {v} unidades
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-14 bg-cocoa/5 dark:bg-cream/5
              rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : !data?.length ? (
        <div
          className="flex flex-col items-center justify-center gap-2 py-8
          text-choco/40 dark:text-cream/40"
        >
          <Package className="w-10 h-10" />
          <p className="text-sm">Todo el stock está bien 🎉</p>
        </div>
      ) : (
        <div className="space-y-2">
          {data.map((product) => {
            const stockPct = Math.min(
              100,
              ((product.stock ?? 0) / threshold) * 100,
            );
            const isCritical = (product.stock ?? 0) <= 3;
            return (
              <Link
                key={product.id}
                to={`/dashboard/product/edit/${product.id}`}
                className="flex items-center gap-3 p-3 bg-cocoa/5 dark:bg-cream/5
                  rounded-xl hover:bg-cocoa/10 dark:hover:bg-cream/10 transition-colors"
              >
                <img
                  src={product.image_url?.[0]}
                  alt={product.name}
                  className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm font-medium text-choco dark:text-cream truncate">
                    {product.name}
                  </p>
                  <div
                    className="h-1.5 bg-cocoa/10 dark:bg-cream/10
                    rounded-full overflow-hidden"
                  >
                    <div
                      className={`h-full rounded-full transition-all ${
                        isCritical
                          ? "bg-red-500"
                          : stockPct < 50
                            ? "bg-amber-500"
                            : "bg-green-500"
                      }`}
                      style={{ width: `${stockPct}%` }}
                    />
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span
                    className={`text-sm font-bold ${
                      isCritical ? "text-red-500" : "text-amber-500"
                    }`}
                  >
                    {product.stock ?? 0}
                  </span>
                  <p className="text-xs text-choco/40 dark:text-cream/40">
                    uds
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
