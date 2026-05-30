// src/hooks/useAutoCoupon.ts
import { useState } from "react";
import { supabase } from "@/supabase/client";
import { useUser } from "@/hooks/auth/useUser";

interface CouponResult {
  valid: boolean;
  coupon_id?: string;
  discount?: number;
  code?: string;
  type?: "welcome" | "birthday" | "review";
  error?: string;
}

interface UseAutoCouponReturn {
  couponResult: CouponResult | null;
  isValidating: boolean;
  validateCoupon: (code: string, subtotal: number) => Promise<void>;
  clearCoupon: () => void;
}

export function useAutoCoupon(): UseAutoCouponReturn {
  const { user } = useUser();
  const [couponResult, setCouponResult] = useState<CouponResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const validateCoupon = async (code: string, subtotal: number) => {
    if (!user?.id || !code.trim()) return;

    setIsValidating(true);
    try {
      const { data, error } = await supabase.rpc("validate_auto_coupon", {
        p_code: code.trim().toUpperCase(),
        p_user_id: user.id,
        p_subtotal: subtotal,
      });

      if (error) throw error;

      setCouponResult(data as unknown as CouponResult);
    } catch (err) {
      setCouponResult({
        valid: false,
        error: "Error al validar el cupón. Intenta de nuevo.",
      });
      console.error("Error validating coupon:", err);
    } finally {
      setIsValidating(false);
    }
  };

  const clearCoupon = () => setCouponResult(null);

  return { couponResult, isValidating, validateCoupon, clearCoupon };
}
