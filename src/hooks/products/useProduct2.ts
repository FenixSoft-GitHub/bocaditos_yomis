import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/actions";

export const useProduct2 = () => {
  const { data, error, isLoading } = useQuery( {
    queryKey: ["products"],
    queryFn: () => getProducts(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
//   const products = data?.map((product) => ({
//     ...product,
//     image: product.image ? product.image : "/images/default-product.png",
//   }));
  return {
    products: data,
    error,
    isLoading,
  } ;          
}
