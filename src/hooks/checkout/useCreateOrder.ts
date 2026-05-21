import { useMutation } from "@tanstack/react-query";
import { createOrderEdgeFunction } from "@/actions/order";
import type {
  CreateOrderPayload,
  CreateOrderResponse,
} from "@/interfaces/checkout.interface";

export const useCreateOrder = () => {
  const mutation = useMutation<CreateOrderResponse, Error, CreateOrderPayload>({
    mutationFn: createOrderEdgeFunction,
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};

// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { createOrder } from "@/actions";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// export const useCreateOrder = () => {
//   const queryClient = useQueryClient();
//   const navigate = useNavigate();

//   const { mutate, isPending } = useMutation({
//     mutationFn: createOrder,
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({
//         queryKey: ["orders"],
//       });
//       navigate(`/checkout/${data.id}/thank-you`);
//     },
//     onError: (error: unknown) => {
//       const message =
//         error instanceof Error ? error.message : "Error desconocido";

//       toast.error(`Error al actualizar: ${message}`, {
//         position: "bottom-right",
//       });
//     },
//   });

//   return {
//     mutate,
//     isPending,
//   };
// };
