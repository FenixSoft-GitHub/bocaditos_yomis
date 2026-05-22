// src/hooks/reviews/useCanReview.ts

import { useQuery } from "@tanstack/react-query";
import { canReview } from "@/actions/reviews";
import { useUser } from "@/hooks/auth/useUser";

export const useCanReview = (productId?: string) => {
  const { userName } = useUser();

  return useQuery({
    queryKey: ["can_review", productId],
    queryFn: () => canReview(productId!),
    enabled: !!productId && !!userName,
    staleTime: 1000 * 60 * 5,
  });
};
