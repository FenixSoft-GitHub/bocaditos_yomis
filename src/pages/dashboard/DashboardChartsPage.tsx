import React from "react";
import {
  useDailySales,
  useMonthlySales,
  useWeeklySales,
  useAnnualSales,
  useTopSellingProducts,
  useLeastSellingProducts,
} from "@/hooks"; // Asegúrate de la ruta correcta y de importar los nuevos hooks
import { Loader } from "@/components/shared/Loader"; // Tu componente Loader
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { formatToTwoDecimals } from "@/helpers"; // Tu función de formato de precio
import { D3PieChartWithLabels } from "@/components/charts/D3PieChartWithLabels"; // Asegúrate de la ruta correcta

const DashboardChartsPage: React.FC = () => {
  const {
    data: dailySales,
    isLoading: isLoadingDaily,
    isError: isErrorDaily,
  } = useDailySales(30); // Últimos 30 días
  const {
    data: monthlySales,
    isLoading: isLoadingMonthly,
    isError: isErrorMonthly,
  } = useMonthlySales(12); // Últimos 12 meses
  const {
    data: weeklySales,
    isLoading: isLoadingWeekly,
    isError: isErrorWeekly,
  } = useWeeklySales(12); // Últimas 12 semanas
  const {
    data: annualSales,
    isLoading: isLoadingAnnual,
    isError: isErrorAnnual,
  } = useAnnualSales(5); // Últimos 5 años
  // Hooks para productos más/menos vendidos
  const {
    data: topSellingProducts,
    isLoading: isLoadingTopSelling,
    isError: isErrorTopSelling,
  } = useTopSellingProducts(8);
  const {
    data: leastSellingProducts,
    isLoading: isLoadingLeastSelling,
    isError: isErrorLeastSelling,
  } = useLeastSellingProducts(8);

  if (
    isLoadingDaily ||
    isLoadingMonthly ||
    isLoadingWeekly ||
    isLoadingAnnual ||
    isLoadingTopSelling ||
    isLoadingLeastSelling
  ) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size={60} />
      </div>
    );
  }

  if (
    isErrorDaily ||
    isErrorMonthly ||
    isErrorWeekly ||
    isErrorAnnual ||
    isErrorTopSelling ||
    isErrorLeastSelling
  ) {
    return (
      <div className="text-center text-red-500 py-10">
        <p>
          Error al cargar los datos de ventas. Por favor, inténtalo de nuevo más
          tarde.
        </p>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8 mt-20 text-choco dark:text-cream bg-fondo dark:bg-fondo-dark">
      <h1 className="text-3xl font-bold text-center mb-10 drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]">
        Análisis de Ventas
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Gráfico de Ventas Diarias */}
        <div className="bg-cream dark:bg-cocoa/10 p-6 rounded-lg shadow-md border border-cocoa dark:border-cream/30">
          <h2 className="text-xl font-semibold mb-6 text-center">
            Ventas Diarias (Últimos 30 Días)
          </h2>
          {dailySales && dailySales.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={dailySales}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis
                  tickFormatter={(value) => formatToTwoDecimals(value)}
                  tick={{ fontSize: 12 }} // Ajuste de tamaño de fuente del tick
                  label={{
                    value: "Ventas",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 16 }, // Ajuste de tamaño de fuente de la etiqueta del eje
                  }}
                />
                <Tooltip
                  formatter={(value) => formatToTwoDecimals(value as number)}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total_sales"
                  stroke="#8884d8"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                  name="Total Ventas $"
                />
                <Line
                  type="monotone"
                  dataKey="total_orders"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="Total Pedidos #"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500">
              No hay datos de ventas diarias disponibles.
            </p>
          )}
        </div>

        {/* Gráfico de Ventas Semanales */}
        <div className="bg-cream dark:bg-cocoa/10 p-6 rounded-lg shadow-md border border-cocoa dark:border-cream/30">
          <h2 className="text-xl font-semibold mb-6 text-center">
            Ventas Semanales (Últimas 12 Semanas)
          </h2>
          {weeklySales && weeklySales.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={weeklySales}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="week_start_date" tick={{ fontSize: 12 }} />{" "}
                {/* dataKey para ventas semanales */}
                <YAxis
                  tickFormatter={(value) => formatToTwoDecimals(value)}
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Ventas",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  formatter={(value) => formatToTwoDecimals(value as number)}
                />
                <Legend />
                <Bar
                  dataKey="total_sales"
                  fill="#ffc658"
                  name="Total Ventas $"
                  barSize={30}
                />{" "}
                {/* Nuevo color para diferenciar */}
                <Bar
                  dataKey="total_orders"
                  fill="#ff7300"
                  name="Total Pedidos #"
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500">
              No hay datos de ventas semanales disponibles.
            </p>
          )}
        </div>

        {/* Gráfico de Ventas Mensuales */}
        <div className="bg-cream dark:bg-cocoa/10 p-6 rounded-lg shadow-md border border-cocoa dark:border-cream/30">
          <h2 className="text-xl font-semibold mb-6 text-center">
            Ventas Mensuales (Últimos 12 Meses)
          </h2>
          {monthlySales && monthlySales.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={monthlySales}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis
                  tickFormatter={(value) => formatToTwoDecimals(value)}
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Ventas",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  formatter={(value) => formatToTwoDecimals(value as number)}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total_sales"
                  stroke="#8884d8"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                  name="Total Ventas $"
                />
                <Line
                  type="monotone"
                  dataKey="total_orders"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="Total Pedidos #"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500">
              No hay datos de ventas mensuales disponibles.
            </p>
          )}
        </div>

        {/* Gráfico de Ventas Anuales */}
        <div className="bg-cream dark:bg-cocoa/10 p-6 rounded-lg shadow-md border border-cocoa dark:border-cream/30">
          <h2 className="text-xl font-semibold mb-6 text-center">
            Ventas Anuales (Últimos 5 Años)
          </h2>
          {annualSales && annualSales.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={annualSales}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />{" "}
                {/* dataKey para ventas anuales */}
                <YAxis
                  tickFormatter={(value) => formatToTwoDecimals(value)}
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Ventas",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  formatter={(value) => formatToTwoDecimals(value as number)}
                />
                <Legend />
                <Bar
                  dataKey="total_sales"
                  fill="#a4de6c"
                  barSize={30}
                  name="Total Ventas $"
                />{" "}
                {/* Nuevo color para diferenciar */}
                <Bar
                  dataKey="total_orders"
                  fill="#00c49f"
                  barSize={30}
                  name="Total Pedidos #"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500">
              No hay datos de ventas anuales disponibles.
            </p>
          )}
        </div>
        {/* Nuevo Gráfico: Top 8 Productos Más Vendidos (D3 Pie Chart) */}
        <div className="bg-cream dark:bg-cocoa/10 p-6 rounded-lg shadow-md border border-cocoa dark:border-cream/30">
          <h2 className="text-xl font-semibold mb-6 text-center">
            Top 8 Productos Más Vendidos
          </h2>
          {topSellingProducts && topSellingProducts.length > 0 ? (
            <D3PieChartWithLabels
              data={topSellingProducts}
              title="Top 8 Productos Más Vendidos"
            />
          ) : (
            <p className="text-center text-gray-500">
              No hay datos de productos más vendidos disponibles.
            </p>
          )}
        </div>

        {/* Nuevo Gráfico: Top 8 Productos Menos Vendidos (D3 Pie Chart) */}
        <div className="bg-cream dark:bg-cocoa/10 p-6 rounded-lg shadow-md border border-cocoa dark:border-cream/30">
          <h2 className="text-xl font-semibold mb-6 text-center">
            Top 8 Productos Menos Vendidos
          </h2>
          {leastSellingProducts && leastSellingProducts.length > 0 ? (
            <D3PieChartWithLabels
              data={leastSellingProducts}
              title="Top 8 Productos Menos Vendidos"
            />
          ) : (
            <p className="text-center text-gray-500">
              No hay datos de productos menos vendidos disponibles.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default DashboardChartsPage;
