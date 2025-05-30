import { supabase } from "@/supabase/client";

import {
  DailySale,
  MonthlySale,
  WeeklySale,
  AnnualSale,
  SellingProduct,
  ChartDataItem,
} from "@/interfaces/sales.interface"; 

// Colores para los segmentos de los PieCharts (usados para generar colorFrom/colorTo)
const PIE_CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#d0ed57', '#a4de6c', '#00c49f', '#ff6f61', '#6b5b95'];

export const getDailySales = async (
  days: number = 30
): Promise<DailySale[]> => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    // Formatear fechas a ISO string para Supabase
    const startIso = startDate.toISOString();
    const endIso = endDate.toISOString();

    // Consulta la tabla 'orders' para obtener la fecha de creación y el monto total
    // Se asume que 'created_at' es un timestamp y 'total_amount' es un numeric.
    const { data: orders, error } = await supabase
      .from("orders")
      .select("created_at, total_amount")
      .gte("created_at", startIso)
      .lte("created_at", endIso)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching daily sales:", error.message);
      throw new Error(error.message);
    }

    if (!orders) return [];

    // Agregación en el cliente: Suma de ventas y conteo de pedidos por día
    const salesMap = new Map<
      string,
      { total_sales: number; total_orders: number }
    >();

    orders.forEach((order) => {
      // Extrae la parte de la fecha (YYYY-MM-DD) del timestamp ISO
      const date = new Date(order.created_at).toISOString().split("T")[0];
      if (!salesMap.has(date)) {
        salesMap.set(date, { total_sales: 0, total_orders: 0 });
      }
      const current = salesMap.get(date)!;
      current.total_sales += order.total_amount;
      current.total_orders += 1;
    });

    // Rellenar días sin ventas para un gráfico continuo
    const dailySales: DailySale[] = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split("T")[0];
      const salesData = salesMap.get(dateString) || {
        total_sales: 0,
        total_orders: 0,
      };
      dailySales.push({ date: dateString, ...salesData });
      currentDate.setDate(currentDate.getDate() + 1); // Avanza al siguiente día
    }

    return dailySales;
  } catch (error) {
    console.error("Error in getDailySales:", error);
    return [];
  }
};

export const getWeeklySales = async (
  weeks: number = 12
): Promise<WeeklySale[]> => {
  try {
    const endDate = new Date();
    // Para simplificar la lógica de "semanas hacia atrás", tomamos una ventana de tiempo más grande
    // y luego filtramos/rellenamos las semanas exactas.
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - weeks * 7 - 7); // Un poco más para asegurar semanas completas

    const { data: orders, error } = await supabase
      .from("orders")
      .select("created_at, total_amount")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching weekly sales:", error.message);
      throw new Error(error.message);
    }

    if (!orders) return [];

    const salesMap = new Map<
      string,
      { total_sales: number; total_orders: number }
    >();

    orders.forEach((order) => {
      const orderDate = new Date(order.created_at);
      // Calcular el inicio de la semana (Lunes) para la fecha del pedido
      const dayOfWeek = (orderDate.getDay() + 6) % 7; // 0 for Monday, 6 for Sunday
      const startOfWeek = new Date(orderDate);
      startOfWeek.setDate(orderDate.getDate() - dayOfWeek);
      startOfWeek.setHours(0, 0, 0, 0); // Limpiar la hora para la clave

      const weekKey = startOfWeek.toISOString().split("T")[0]; // 'YYYY-MM-DD' del Lunes

      if (!salesMap.has(weekKey)) {
        salesMap.set(weekKey, { total_sales: 0, total_orders: 0 });
      }
      const current = salesMap.get(weekKey)!;
      current.total_sales += order.total_amount;
      current.total_orders += 1;
    });

    // Rellenar semanas sin ventas para un gráfico continuo y asegurar el número de semanas
    const weeklySales: WeeklySale[] = [];
    const currentWeekStart = new Date(endDate);
    currentWeekStart.setDate(endDate.getDate() - ((endDate.getDay() + 6) % 7)); // Lunes de la semana actual
    currentWeekStart.setHours(0, 0, 0, 0);

    for (let i = 0; i < weeks; i++) {
      const weekKey = currentWeekStart.toISOString().split("T")[0];
      const salesData = salesMap.get(weekKey) || {
        total_sales: 0,
        total_orders: 0,
      };
      weeklySales.unshift({ week_start_date: weekKey, ...salesData }); // Añadir al principio para ordenar cronológicamente
      currentWeekStart.setDate(currentWeekStart.getDate() - 7); // Retroceder una semana
    }

    return weeklySales;
  } catch (error) {
    console.error("Error in getWeeklySales:", error);
    return [];
  }
};


export const getMonthlySales = async (
  months: number = 12
): Promise<MonthlySale[]> => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - months);
    startDate.setDate(1); // Empezar desde el primer día del mes para asegurar la agregación mensual correcta

    // Formatear fechas a ISO string para Supabase
    const { data: orders, error } = await supabase
      .from("orders")
      .select("created_at, total_amount")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching monthly sales:", error.message);
      throw new Error(error.message);
    }

    if (!orders) return [];

    // Agregación en el cliente: Suma de ventas y conteo de pedidos por mes
    const salesMap = new Map<
      string,
      { total_sales: number; total_orders: number }
    >();

    orders.forEach((order) => {
      const date = new Date(order.created_at);
      // Crea una clave de mes en formato 'YYYY-MM' (ej. '2023-01')
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
      if (!salesMap.has(monthKey)) {
        salesMap.set(monthKey, { total_sales: 0, total_orders: 0 });
      }
      const current = salesMap.get(monthKey)!;
      current.total_sales += order.total_amount;
      current.total_orders += 1;
    });

    // Rellenar meses sin ventas para un gráfico continuo
    const monthlySales: MonthlySale[] = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const monthKey = `${currentDate.getFullYear()}-${(
        currentDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}`;
      const salesData = salesMap.get(monthKey) || {
        total_sales: 0,
        total_orders: 0,
      };
      monthlySales.push({ month: monthKey, ...salesData });
      currentDate.setMonth(currentDate.getMonth() + 1); // Avanza al siguiente mes
    }

    return monthlySales;
  } catch (error) {
    console.error("Error in getMonthlySales:", error);
    return [];
  }
};

export const getAnnualSales = async (
  years: number = 5
): Promise<AnnualSale[]> => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - years);
    startDate.setMonth(0, 1); // Primer día del año de inicio

    const { data: orders, error } = await supabase
      .from("orders")
      .select("created_at, total_amount")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching annual sales:", error.message);
      throw new Error(error.message);
    }

    if (!orders) return [];

    const salesMap = new Map<
      string,
      { total_sales: number; total_orders: number }
    >();

    orders.forEach((order) => {
      const yearKey = new Date(order.created_at).getFullYear().toString(); // 'YYYY'
      if (!salesMap.has(yearKey)) {
        salesMap.set(yearKey, { total_sales: 0, total_orders: 0 });
      }
      const current = salesMap.get(yearKey)!;
      current.total_sales += order.total_amount;
      current.total_orders += 1;
    });

    // Rellenar años sin ventas para un gráfico continuo
    const annualSales: AnnualSale[] = [];
    let currentYear = startDate.getFullYear();
    while (currentYear <= endDate.getFullYear()) {
      const yearString = currentYear.toString();
      const salesData = salesMap.get(yearString) || {
        total_sales: 0,
        total_orders: 0,
      };
      annualSales.push({ year: yearString, ...salesData });
      currentYear++;
    }

    return annualSales;
  } catch (error) {
    console.error("Error in getAnnualSales:", error);
    return [];
  }
};

export const getTopSellingProducts = async (limit: number = 8): Promise<ChartDataItem[]> => {
    try {
      const { data, error } = await supabase
        .from("order_items")
        .select(`
          product_id,
          quantity,
          products (name)
        `)
        .limit(1000); // Limita el número de order_items a traer para evitar sobrecarga, ajusta según necesidad
  
      if (error) {
        console.error("Error fetching top selling products:", error.message);
        throw new Error(error.message);
      }
  
      if (!data) return [];
  
      const productSalesMap = new Map<string, { total_quantity_sold: number; product_name: string }>();
  
      data.forEach(item => {
        const productId = item.product_id;
        const productName = (item.products as { name?: string } | null)?.name || 'Producto Desconocido';
        const quantity = item.quantity;
  
        if (!productSalesMap.has(productId)) {
          productSalesMap.set(productId, { total_quantity_sold: 0, product_name: productName });
        }
        productSalesMap.get(productId)!.total_quantity_sold += quantity;
      });
  
      const topSellingProducts: SellingProduct[] = Array.from(productSalesMap.entries())
        .map(([productId, { total_quantity_sold, product_name }]) => ({
          product_id: productId,
          product_name: product_name,
          total_quantity_sold: total_quantity_sold,
        }))
        .sort((a, b) => b.total_quantity_sold - a.total_quantity_sold)
        .slice(0, limit);
  
      // Mapear a ChartDataItem y asignar colores
      return topSellingProducts.map((product, index) => ({
        ...product,
        name: product.product_name, // Mapea product_name a name para D3
        value: product.total_quantity_sold, // Mapea total_quantity_sold a value para D3
        colorFrom: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length], // Asigna color
        colorTo: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length],   // Mismo color para un gradiente sutil
      }));
    } catch (error) {
      console.error("Error in getTopSellingProducts:", error);
      return [];
    }
  };
    
  export const getLeastSellingProducts = async (limit: number = 8): Promise<ChartDataItem[]> => {
    try {
      const { data, error } = await supabase
        .from("order_items")
        .select(`
          product_id,
          quantity,
          products (name)
        `)
        .limit(1000); 
  
      if (error) {
        console.error("Error fetching least selling products:", error.message);
        throw new Error(error.message);
      }
  
      if (!data) return [];
  
      const productSalesMap = new Map<string, { total_quantity_sold: number; product_name: string }>();
  
      data.forEach(item => {
        const productId = item.product_id;
        const productName = (item.products as { name?: string } | null)?.name || 'Producto Desconocido';
        const quantity = item.quantity;
  
        if (!productSalesMap.has(productId)) {
          productSalesMap.set(productId, { total_quantity_sold: 0, product_name: productName });
        }
        productSalesMap.get(productId)!.total_quantity_sold += quantity;
      });
  
      const leastSellingProducts: SellingProduct[] = Array.from(productSalesMap.entries())
        .map(([productId, { total_quantity_sold, product_name }]) => ({
          product_id: productId,
          product_name: product_name,
          total_quantity_sold: total_quantity_sold,
        }))
        .sort((a, b) => a.total_quantity_sold - b.total_quantity_sold) // Orden ascendente
        .slice(0, limit);
  
      // Mapear a ChartDataItem y asignar colores
      return leastSellingProducts.map((product, index) => ({
        ...product,
        name: product.product_name, // Mapea product_name a name para D3
        value: product.total_quantity_sold, // Mapea total_quantity_sold a value para D3
        colorFrom: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length], // Asigna color
        colorTo: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length],   // Mismo color para un gradiente sutil
      }));
    } catch (error) {
      console.error("Error in getLeastSellingProducts:", error);
      return [];
    }
  };
  
