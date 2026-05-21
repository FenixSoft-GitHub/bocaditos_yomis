import { supabase } from "@/supabase/client";

// ─── Horas pico ───────────────────────────────────────────────────────────────
export const getOrdersByHour = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select("created_at")
    .not("status", "eq", "cancelled");

  if (error) throw new Error(error.message);
  if (!data) return [];

  const hourMap = new Map<number, number>();
  for (let i = 0; i < 24; i++) hourMap.set(i, 0);

  data.forEach((order) => {
    const hour = new Date(order.created_at).getHours();
    hourMap.set(hour, (hourMap.get(hour) ?? 0) + 1);
  });

  return Array.from(hourMap.entries()).map(([hour, orders]) => ({
    hour: `${hour.toString().padStart(2, "0")}:00`,
    orders,
  }));
};

// ─── Clientes nuevos vs recurrentes ──────────────────────────────────────────
export const getNewVsReturningCustomers = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select("user_id, created_at")
    .not("status", "eq", "cancelled")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  if (!data) return { new: 0, returning: 0, chartData: [] };

  // Primer orden de cada usuario
  const firstOrderMap = new Map<string, string>();
  data.forEach((order) => {
    if (!firstOrderMap.has(order.user_id)) {
      firstOrderMap.set(order.user_id, order.created_at);
    }
  });

  // Agrupar por mes
  const monthMap = new Map<string, { new: number; returning: number }>();

  data.forEach((order) => {
    const date = new Date(order.created_at);
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;

    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, { new: 0, returning: 0 });
    }

    const current = monthMap.get(monthKey)!;
    const firstOrder = firstOrderMap.get(order.user_id);
    const isNew =
      firstOrder === order.created_at ||
      (new Date(firstOrder!).getMonth() === date.getMonth() &&
        new Date(firstOrder!).getFullYear() === date.getFullYear());

    if (isNew) current.new++;
    else current.returning++;
  });

  const chartData = Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([month, values]) => ({ month, ...values }));

  const totalNew = chartData.reduce((acc, m) => acc + m.new, 0);
  const totalReturning = chartData.reduce((acc, m) => acc + m.returning, 0);

  return { new: totalNew, returning: totalReturning, chartData };
};

// ─── Top clientes ─────────────────────────────────────────────────────────────
export const getTopCustomers = async (limit = 8) => {
  const { data, error } = await supabase
    .from("orders")
    .select("user_id, total_amount, users(full_name, email)")
    .eq("status", "paid");

  if (error) throw new Error(error.message);
  if (!data) return [];

  const customerMap = new Map<
    string,
    {
      full_name: string;
      email: string;
      total_spent: number;
      total_orders: number;
    }
  >();

  data.forEach((order) => {
    const userId = order.user_id;
    const user = order.users as { full_name?: string; email?: string } | null;

    if (!customerMap.has(userId)) {
      customerMap.set(userId, {
        full_name: user?.full_name ?? "Cliente",
        email: user?.email ?? "",
        total_spent: 0,
        total_orders: 0,
      });
    }

    const current = customerMap.get(userId)!;
    current.total_spent += Number(order.total_amount);
    current.total_orders += 1;
  });

  return Array.from(customerMap.values())
    .sort((a, b) => b.total_spent - a.total_spent)
    .slice(0, limit);
};

// ─── Ventas por categoría ─────────────────────────────────────────────────────
export const getSalesByCategory = async () => {
  const { data, error } = await supabase
    .from("order_items")
    .select(
      `
      quantity,
      unit_price,
      products (
        category_id,
        categories (name)
      )
    `,
    )
    .limit(2000);

  if (error) throw new Error(error.message);
  if (!data) return [];

  const categoryMap = new Map<
    string,
    { name: string; revenue: number; units: number }
  >();

  data.forEach((item) => {
    const product = item.products as {
      category_id?: string;
      categories?: { name?: string } | null;
    } | null;

    const categoryName = product?.categories?.name ?? "Sin categoría";
    const revenue = Number(item.unit_price) * item.quantity;

    if (!categoryMap.has(categoryName)) {
      categoryMap.set(categoryName, {
        name: categoryName,
        revenue: 0,
        units: 0,
      });
    }

    const current = categoryMap.get(categoryName)!;
    current.revenue += revenue;
    current.units += item.quantity;
  });

  return Array.from(categoryMap.values()).sort((a, b) => b.revenue - a.revenue);
};

// ─── Stock bajo ───────────────────────────────────────────────────────────────
export const getLowStockProducts = async (threshold = 10) => {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, stock, image_url, categories(name)")
    .lte("stock", threshold)
    .eq("is_active", true)
    .order("stock", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
};

// ─── Mapa de calor semanal ────────────────────────────────────────────────────
export const getOrdersByDayOfWeek = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select("created_at, total_amount")
    .not("status", "eq", "cancelled");

  if (error) throw new Error(error.message);
  if (!data) return [];

  const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const dayMap = new Map<number, { orders: number; revenue: number }>();
  for (let i = 0; i < 7; i++) dayMap.set(i, { orders: 0, revenue: 0 });

  data.forEach((order) => {
    const day = new Date(order.created_at).getDay();
    const current = dayMap.get(day)!;
    current.orders += 1;
    current.revenue += Number(order.total_amount);
  });

  return Array.from(dayMap.entries()).map(([dayIndex, values]) => ({
    day: days[dayIndex],
    ...values,
  }));
};

// ─── Comparativa anual por mes ────────────────────────────────────────────────
export const getYearOverYearComparison = async () => {
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  const { data, error } = await supabase
    .from("orders")
    .select("created_at, total_amount")
    .gte("created_at", `${previousYear}-01-01`)
    .lte("created_at", `${currentYear}-12-31`)
    .not("status", "eq", "cancelled");

  if (error) throw new Error(error.message);
  if (!data) return [];

  const months = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  const map = new Map<string, { current: number; previous: number }>();
  months.forEach((m) => map.set(m, { current: 0, previous: 0 }));

  data.forEach((order) => {
    const date = new Date(order.created_at);
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const current = map.get(month)!;
    if (year === currentYear) current.current += Number(order.total_amount);
    if (year === previousYear) current.previous += Number(order.total_amount);
  });

  return Array.from(map.entries()).map(([month, values]) => ({
    month,
    [`${currentYear}`]: values.current,
    [`${previousYear}`]: values.previous,
  }));
};
