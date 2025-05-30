import { useQuery } from "@tanstack/react-query";
import { getAnnualSales, getDailySales, getLeastSellingProducts, getMonthlySales, getTopSellingProducts, getWeeklySales } from "@/actions/sales"; // Asegúrate de la ruta correcta

export const useDailySales = (days: number = 30) => {
  return useQuery({
    queryKey: ["dailySales", days],
    queryFn: () => getDailySales(days),
    staleTime: 1000 * 60 * 5, // 5 minutos de caché
  });
};

export const useWeeklySales = (weeks: number = 4) => {
  return useQuery({
    queryKey: ["weeklySales", weeks],
    queryFn: () => getWeeklySales(weeks),

    staleTime: 1000 * 60 * 5, // 5 minutos de caché
  });
};

export const useMonthlySales = (months: number = 12) => {
  return useQuery({
    queryKey: ["monthlySales", months],
    queryFn: () => getMonthlySales(months),
    staleTime: 1000 * 60 * 60 * 24, // 24 horas de caché
  });
};

export const useAnnualSales = (years: number = 1) => {
  return useQuery({
    queryKey: ["annualSales", years],
    queryFn: () => getAnnualSales(years),
    staleTime: 1000 * 60 * 60 * 24, // 24 horas de caché
  });
};

// Nuevos hooks para productos más/menos vendidos
export const useTopSellingProducts = (limit: number = 8) => {
  return useQuery({
    queryKey: ["topSellingProducts", limit],
    queryFn: () => getTopSellingProducts(limit),
    staleTime: 1000 * 60 * 30, // 30 minutos de caché
  });
};

export const useLeastSellingProducts = (limit: number = 8) => {
  return useQuery({
    queryKey: ["leastSellingProducts", limit],
    queryFn: () => getLeastSellingProducts(limit),
    staleTime: 1000 * 60 * 30, // 30 minutos de caché
  });
};