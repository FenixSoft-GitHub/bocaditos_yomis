import { useMutation } from "@tanstack/react-query";
import { submitPaymentReceipt } from "@/actions/order";
import type { SubmitReceiptPayload } from "@/interfaces/checkout.interface";

export const useSubmitReceipt = () => {
  const mutation = useMutation<void, Error, SubmitReceiptPayload>({
    mutationFn: submitPaymentReceipt,
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};
