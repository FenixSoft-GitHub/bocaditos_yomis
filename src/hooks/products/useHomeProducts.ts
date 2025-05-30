import { useQueries } from "@tanstack/react-query";
import {
  getRandomProducts,
  getRecentProducts,
  getDiscountedProducts,
} from "@/actions"; 

export const useHomeProducts = () => {
  const results = useQueries({
    queries: [
      {
        queryKey: ["recentProducts"],
        queryFn: getRecentProducts,
      },
      {
        queryKey: ["popularProducts"],
        queryFn: getRandomProducts,
      },
      {
        queryKey: ["discountedProducts"],
        queryFn: getDiscountedProducts,
      },
    ],
  });

  const [
    recentProductsResult,
    popularProductsResult,
    discountedProductsResult,
  ] = results;

  const isLoading =
    recentProductsResult.isLoading ||
    popularProductsResult.isLoading ||
    discountedProductsResult.isLoading;

  const isError =
    recentProductsResult.isError ||
    popularProductsResult.isError ||
    discountedProductsResult.isError;

  return {
    recentProducts: recentProductsResult.data || [],
    popularProducts: popularProductsResult.data || [],
    discountedProducts: discountedProductsResult.data || [],
    isLoading,
    isError,
  };
};