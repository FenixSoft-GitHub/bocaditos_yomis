// src/hooks/useWishlist.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getWishlistIds,
  getWishlistProducts,
  toggleWishlist,
} from "@/actions/wishlist";
// import { useUser } from "@/hooks/auth/useUser"; 
import { useUser } from "@/hooks";
import toast from "react-hot-toast";

const WISHLIST_IDS_KEY = ["wishlist", "ids"];
const WISHLIST_PRODUCTS_KEY = ["wishlist", "products"];

// ── Hook principal ─────────────────────────────────────────────────────────

export const useWishlist = () => {
  const { userName } = useUser();
  const queryClient = useQueryClient();
  const isLoggedIn = !!userName;

  // IDs de favoritos — cargados una vez, usados en toda la app
  const { data: wishlistIds = [] } = useQuery<string[]>({
    queryKey: WISHLIST_IDS_KEY,
    queryFn: getWishlistIds,
    enabled: isLoggedIn,
    staleTime: 1000 * 60 * 5,
  });

  // Productos completos — solo para la WishlistPage
  const { data: wishlistProducts = [], isLoading: isLoadingProducts } =
    useQuery({
      queryKey: WISHLIST_PRODUCTS_KEY,
      queryFn: getWishlistProducts,
      enabled: isLoggedIn,
      staleTime: 1000 * 60 * 5,
    });

  // Toggle con optimistic update
  const { mutate: toggle, isPending } = useMutation({
    mutationFn: toggleWishlist,

    // Optimistic update: actualiza los IDs antes de que responda el servidor
    onMutate: async (productId: string) => {
      await queryClient.cancelQueries({ queryKey: WISHLIST_IDS_KEY });
      const previous = queryClient.getQueryData<string[]>(WISHLIST_IDS_KEY);

      queryClient.setQueryData<string[]>(WISHLIST_IDS_KEY, (old = []) =>
        old.includes(productId)
          ? old.filter((id) => id !== productId)
          : [...old, productId],
      );

      return { previous };
    },

    onSuccess: (action) => {
      if (action === "added") {
        toast.success("Añadido a favoritos", { position: "bottom-right" });
      } else {
        toast.success("Eliminado de favoritos", { position: "bottom-right" });
      }
      // Refresca los productos de la wishlist page
      queryClient.invalidateQueries({ queryKey: WISHLIST_PRODUCTS_KEY });
    },

    onError: (_err, _productId, context) => {
      // Rollback del optimistic update si falla
      queryClient.setQueryData(WISHLIST_IDS_KEY, context?.previous);
      toast.error("Error al actualizar favoritos", {
        position: "bottom-right",
      });
    },
  });

  const isFavorite = (productId: string) => wishlistIds.includes(productId);

  const handleToggle = (productId: string) => {
    if (!isLoggedIn) {
      toast.error("Inicia sesión para guardar favoritos", {
        position: "bottom-right",
      });
      return;
    }
    toggle(productId);
  };

  return {
    wishlistIds,
    wishlistProducts,
    isLoadingProducts,
    isFavorite,
    toggle: handleToggle,
    isPending,
    isLoggedIn,
  };
};
