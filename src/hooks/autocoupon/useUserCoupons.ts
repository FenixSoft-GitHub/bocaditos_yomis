// src/hooks/useUserCoupons.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/supabase/client";
import { useUser } from "@/hooks/auth/useUser";

export type CouponStatus = "active" | "used" | "expired";

export interface UserCoupon {
  id: string;
  code: string;
  type: "welcome" | "birthday" | "review";
  discount: number;
  min_order: number;
  expires_at: string;
  used_at: string | null;
  created_at: string;
}

function getCouponStatus(coupon: UserCoupon): CouponStatus {
  if (coupon.used_at) return "used";
  if (new Date(coupon.expires_at) < new Date()) return "expired";
  return "active";
}

export function useUserCoupons() {
  const { user } = useUser();

  return useQuery({
    queryKey: ["user-coupons", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("auto_coupons")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const coupons = (data as UserCoupon[]).map((c) => ({
        ...c,
        status: getCouponStatus(c),
      }));

      return {
        active: coupons.filter((c) => c.status === "active"),
        used: coupons.filter((c) => c.status === "used"),
        expired: coupons.filter((c) => c.status === "expired"),
        all: coupons,
      };
    },
  });
}
