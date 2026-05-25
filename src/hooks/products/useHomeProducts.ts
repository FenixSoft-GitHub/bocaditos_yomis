// src/hooks/useHomeProducts.ts
import { useQueries } from "@tanstack/react-query";
import {
  getRandomProducts,
  getRecentProducts,
  getDiscountedProducts,
} from "@/actions";

export const useHomeProducts = () => {
  const results = useQueries({
    queries: [
      { queryKey: ["recentProducts"], queryFn: getRecentProducts },
      { queryKey: ["popularProducts"], queryFn: getRandomProducts },
      { queryKey: ["discountedProducts"], queryFn: getDiscountedProducts },
    ],
  });

  const [recent, popular, discounted] = results;

  return {
    recentProducts: recent.data || [],
    popularProducts: popular.data || [],
    discountedProducts: discounted.data || [],
    // Exportamos también los estados individuales
    isRecentLoading: recent.isLoading,
    isPopularLoading: popular.isLoading,
    isDiscountedLoading: discounted.isLoading,
  };
};