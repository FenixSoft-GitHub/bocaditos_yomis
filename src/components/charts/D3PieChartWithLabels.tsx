import { pie, arc, PieArcDatum } from "d3";
import {
  ClientTooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/charts/ClientTooltip"; // Asegúrate de que esta ruta sea correcta
import { ChartDataItem } from "@/interfaces/sales.interface"; // Importa ChartDataItem


interface D3PieChartProps {
  data: ChartDataItem[]; // Ahora espera ChartDataItem
  title: string;
  // colors ya no es necesario aquí, ya que los colores están en ChartDataItem
}

export function D3PieChartWithLabels({ data }: D3PieChartProps) {
  // Dimensiones del gráfico
  const radius = 100; // Radio del gráfico en píxeles
  const gap = 0.01; // Espacio entre las rebanadas

  // Configuración del layout del pastel (pie layout)
  const pieLayout = pie<ChartDataItem>() // Usa ChartDataItem
    .sort(null) // No ordenar las rebanadas, mantener el orden de los datos
    .value((d) => d.value) // Usa 'value' de ChartDataItem
    .padAngle(gap); // Crea un pequeño espacio entre las rebanadas

  // Generador de arcos para las rebanadas del pastel
  const arcGenerator = arc<PieArcDatum<ChartDataItem>>() // Usa ChartDataItem
    .innerRadius(5) // Radio interior (para donut)
    .outerRadius(radius) // Radio exterior
    .cornerRadius(2); // Esquinas redondeadas para las rebanadas

  // Generador de arcos para la posición de las etiquetas
  const labelRadius = radius * 0.8; // Radio donde se colocarán las etiquetas
  const arcLabel = arc<PieArcDatum<ChartDataItem>>()
    .innerRadius(labelRadius)
    .outerRadius(labelRadius); // Usa ChartDataItem

  // Calcula los arcos (rebanadas) a partir de los datos
  const arcs = pieLayout(data);

  // Calcula el ángulo de cada rebanada en grados
  const computeAngle = (d: PieArcDatum<ChartDataItem>) => {
    // Usa ChartDataItem
    return ((d.endAngle - d.startAngle) * 180) / Math.PI;
  };

  // Ángulo mínimo para mostrar el texto de la etiqueta directamente en la rebanada
  const MIN_ANGLE = 10; // Reducido para que aparezcan más etiquetas

  return (
    <div className="p-4">
      <div className="relative max-w-xs mx-auto aspect-square">
        {" "}
        {/* Contenedor para el SVG, con tamaño responsivo */}
        <svg
          viewBox={`-${radius} -${radius} ${radius * 2} ${radius * 2}`} // Centra el SVG en el contenedor
          className="overflow-visible w-full h-full" // Hace que el SVG ocupe todo el espacio disponible
        >
          {/* Definiciones de gradientes */}
          <defs>
            {arcs.map((d, i) => {
              const midAngle = (d.startAngle + d.endAngle) / 2;
              return (
                <linearGradient
                  key={`pieColors-${i}`}
                  id={`pieColors-${i}`}
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                  // El gradientTransform crea el efecto de gradiente radial-like
                  gradientTransform={`rotate(${
                    (midAngle * 180) / Math.PI - 90
                  }, 0.5, 0.5)`}
                >
                  <stop offset="0%" stopColor={d.data.colorFrom} />
                  <stop offset="100%" stopColor={d.data.colorTo} />
                </linearGradient>
              );
            })}
          </defs>

          {/* Renderizado de las rebanadas */}
          {arcs.map((d, i) => {
            return (
              <ClientTooltip key={d.data.product_id}>
                {" "}
                {/* Clave única para cada rebanada */}
                <TooltipTrigger>
                  <g>
                    {/* La ruta usa la URL del gradiente definido */}
                    <path fill={`url(#pieColors-${i})`} d={arcGenerator(d)!} />
                  </g>
                </TooltipTrigger>
                <TooltipContent>
                  {/* Contenido del tooltip */}
                  <div>{d.data.name}</div> {/* Usa 'name' de ChartDataItem */}
                  <div className="text-choco dark:text-cream text-sm">
                    {d.data.value.toLocaleString("es-ES")}{" "}
                    {/* Usa 'value' de ChartDataItem */}
                  </div>
                </TooltipContent>
              </ClientTooltip>
            );
          })}
        </svg>
        {/* Etiquetas como divs posicionados absolutamente */}
        <div className="absolute inset-0 pointer-events-none">
          {arcs.map((d: PieArcDatum<ChartDataItem>, ) => {
            // Usa ChartDataItem
            const angle = computeAngle(d);
            if (angle <= MIN_ANGLE) return null; // No mostrar etiqueta si la rebanada es muy pequeña

            // Obtiene el centroide del arco para posicionar la etiqueta
            const [x, y] = arcLabel.centroid(d);

            // Convierte las coordenadas del centroide a porcentajes relativos al contenedor
            const CENTER_PCT = 50;
            const nameLeft = `${CENTER_PCT + (x / radius) * 40}%`;
            const nameTop = `${CENTER_PCT + (y / radius) * 40}%`;

            const valueLeft = `${CENTER_PCT + (x / radius) * 72}%`;
            const valueTop = `${CENTER_PCT + (y / radius) * 70}%`;

            return (
              <div key={d.data.product_id}>
                {" "}
                {/* Clave única para cada etiqueta */}
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: valueLeft, top: valueTop }}
                >
                  {d.data.value} {/* Muestra 'value' de ChartDataItem */}
                </div>
                <div
                  className="absolute max-w-[80px] text-fondo-dark truncate text-center text-sm font-medium"
                  style={{
                    left: nameLeft,
                    top: nameTop,
                    transform: "translate(-50%, -50%)", // Centra la etiqueta en su posición
                    marginLeft: x > 0 ? "2px" : "-2px", // Pequeño ajuste para la alineación
                    marginTop: y > 0 ? "2px" : "-2px", // Pequeño ajuste para la alineación
                  }}
                >
                  {d.data.name} {/* Muestra 'name' de ChartDataItem */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}