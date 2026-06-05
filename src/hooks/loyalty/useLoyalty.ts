// src/hooks/useLoyalty.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/supabase/client";
import { useUser } from "@/hooks";

// ─── Tipos ───────────────────────────────────────────────────────────────────

export type LoyaltyLevel = "bronze" | "silver" | "gold";

export interface LoyaltyStats {
  points: number;
  lifetime_points: number;
  level: LoyaltyLevel;
  next_level: LoyaltyLevel | null;
  points_to_next: number;
  progress: number;
}

export interface LoyaltyReward {
  id: string;
  name: string;
  points_required: number;
  discount: number;
  is_active: boolean;
}

export interface LoyaltyTransaction {
  id: string;
  type: "earned" | "redeemed" | "expired" | "reversed";
  points: number;
  description: string;
  created_at: string;
}

export interface RedeemResult {
  success: boolean;
  coupon_code?: string;
  discount?: number;
  expires_at?: string;
  error?: string;
}

// ─── Level config ─────────────────────────────────────────────────────────────

export const levelConfig: Record<
  LoyaltyLevel,
  {
    label: string;
    emoji: string;
    color: string;
    bg: string;
    border: string;
    gradient: string;
  }
> = {
  bronze: {
    label: "Bronce",
    emoji: "🥉",
    color: "text-amber-700 dark:text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    gradient: "from-amber-800 to-amber-600",
  },
  silver: {
    label: "Plata",
    emoji: "🥈",
    color: "text-slate-500 dark:text-slate-300",
    bg: "bg-slate-500/10",
    border: "border-slate-500/30",
    gradient: "from-slate-600 to-slate-400",
  },
  gold: {
    label: "Oro",
    emoji: "🥇",
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    gradient: "from-yellow-600 to-amber-400",
  },
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLoyalty() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  // Stats del usuario
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["loyalty-stats", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_loyalty_stats", {
        p_user_id: user!.id,
      });
      if (error) throw error;
      return data as unknown as LoyaltyStats;
    },
    staleTime: 1000 * 60 * 2,
  });

  // Recompensas disponibles
  const { data: rewards, isLoading: isLoadingRewards } = useQuery({
    queryKey: ["loyalty-rewards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loyalty_rewards")
        .select("*")
        .eq("is_active", true)
        .order("points_required");
      if (error) throw error;
      return data as LoyaltyReward[];
    },
    staleTime: 1000 * 60 * 10,
  });

  // Historial de transacciones
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["loyalty-transactions", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loyalty_transactions")
        .select("id, type, points, description, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data as LoyaltyTransaction[];
    },
  });

  // Mutation: canjear puntos
  const { mutateAsync: redeem, isPending: isRedeeming } = useMutation({
    mutationFn: async (rewardId: string) => {
      const { data, error } = await supabase.rpc("redeem_loyalty_points", {
        p_user_id: user!.id,
        p_reward_id: rewardId,
      });
      if (error) throw error;
      return data as unknown as RedeemResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-stats", user?.id] });
      queryClient.invalidateQueries({
        queryKey: ["loyalty-transactions", user?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["user-coupons", user?.id] });
    },
  });

  return {
    stats,
    rewards: rewards ?? [],
    transactions: transactions ?? [],
    isLoadingStats,
    isLoadingRewards,
    isLoadingTransactions,
    redeem,
    isRedeeming,
  };
}
