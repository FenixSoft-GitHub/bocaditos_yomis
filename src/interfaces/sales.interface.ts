export interface DailySale {
  date: string; // Formato 'YYYY-MM-DD'
  total_sales: number;
  total_orders: number;
}

export interface WeeklySale {
  week_start_date: string; // Formato 'YYYY-WW'
  total_sales: number;
  total_orders: number;
}

export interface MonthlySale {
  month: string; // Formato 'YYYY-MM'
  total_sales: number;
  total_orders: number;
}
export interface AnnualSale {
  year: string; // Formato 'YYYY'
  total_sales: number;
  total_orders: number;
}

// Nueva interfaz para productos más/menos vendidos
export interface SellingProduct {
  product_id: string;
  product_name: string;
  total_quantity_sold: number;
  // Puedes añadir image_url si quieres mostrar la imagen del producto en el tooltip o leyenda
  // image_url?: string;
}

// Nueva interfaz para los datos que el gráfico D3 espera
// Incluye las propiedades de color para el gradiente
export interface ChartDataItem extends SellingProduct {
  name: string; // Mapea a product_name
  value: number; // Mapea a total_quantity_sold
  colorFrom: string; // Color hexadecimal para el inicio del gradiente
  colorTo: string;   // Color hexadecimal para el final del gradiente (puede ser el mismo)
}