import { useQuery } from "@tanstack/react-query";
import { getPaymentMethods } from "@/actions/order";
import type { PaymentMethod } from "@/interfaces/checkout.interface";

export const usePaymentMethods = (type?: string) => {
  const { data, isLoading, isError } = useQuery<PaymentMethod[], Error>({
    queryKey: ["payment_methods", type],
    queryFn: () => getPaymentMethods(type),
  });

  return {
    paymentMethods: data ?? [],
    isLoading,
    isError,
  };
};
