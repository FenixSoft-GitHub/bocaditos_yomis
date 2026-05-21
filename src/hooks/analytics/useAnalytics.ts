import { useQuery } from "@tanstack/react-query";
import {
  getOrdersByHour,
  getNewVsReturningCustomers,
  getTopCustomers,
  getSalesByCategory,
  getLowStockProducts,
  getOrdersByDayOfWeek,
  getYearOverYearComparison,
} from "@/actions/analytics";

export const useOrdersByHour = () =>
  useQuery({
    queryKey: ["ordersByHour"],
    queryFn: getOrdersByHour,
    staleTime: 1000 * 60 * 30,
  });

export const useNewVsReturning = () =>
  useQuery({
    queryKey: ["newVsReturning"],
    queryFn: getNewVsReturningCustomers,
    staleTime: 1000 * 60 * 60,
  });

export const useTopCustomers = (limit = 8) =>
  useQuery({
    queryKey: ["topCustomers", limit],
    queryFn: () => getTopCustomers(limit),
    staleTime: 1000 * 60 * 30,
  });

export const useSalesByCategory = () =>
  useQuery({
    queryKey: ["salesByCategory"],
    queryFn: getSalesByCategory,
    staleTime: 1000 * 60 * 30,
  });

export const useLowStockProducts = (threshold = 10) =>
  useQuery({
    queryKey: ["lowStock", threshold],
    queryFn: () => getLowStockProducts(threshold),
    staleTime: 1000 * 60 * 5,
  });

export const useOrdersByDayOfWeek = () =>
  useQuery({
    queryKey: ["ordersByDayOfWeek"],
    queryFn: getOrdersByDayOfWeek,
    staleTime: 1000 * 60 * 60,
  });

export const useYearOverYear = () =>
  useQuery({
    queryKey: ["yearOverYear"],
    queryFn: getYearOverYearComparison,
    staleTime: 1000 * 60 * 60 * 24,
  });
