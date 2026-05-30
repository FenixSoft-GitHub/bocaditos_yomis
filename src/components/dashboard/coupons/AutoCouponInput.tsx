// src/components/checkout/AutoCouponInput.tsx
import { useState } from "react";
import { Tag, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAutoCoupon } from "@/hooks/autocoupon/useAutoCoupon";

interface AutoCouponInputProps {
  subtotal: number;
  onCouponApplied: (discount: number, couponId: string, code: string) => void;
  onCouponRemoved: () => void;
}

const typeLabels = {
  welcome: "🎉 Cupón de bienvenida",
  birthday: "🎂 Cupón de cumpleaños",
  review: "⭐ Cupón por reseña",
};

export function AutoCouponInput({
  subtotal,
  onCouponApplied,
  onCouponRemoved,
}: AutoCouponInputProps) {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState(false);
  const { couponResult, isValidating, validateCoupon, clearCoupon } =
    useAutoCoupon();

  const handleApply = async () => {
    if (!code.trim() || applied) return;
    await validateCoupon(code, subtotal);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleApply();
  };

  // Cuando la validación es exitosa, notificar al padre
  const handleConfirmApply = () => {
    if (
      couponResult?.valid &&
      couponResult.discount &&
      couponResult.coupon_id &&
      couponResult.code
    ) {
      onCouponApplied(
        couponResult.discount,
        couponResult.coupon_id,
        couponResult.code,
      );
      setApplied(true);
    }
  };

  const handleRemove = () => {
    setCode("");
    setApplied(false);
    clearCoupon();
    onCouponRemoved();
  };

  // Auto-confirmar cuando la validación es exitosa
  if (couponResult?.valid && !applied) {
    handleConfirmApply();
  }

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm font-medium text-texto">
        <Tag size={16} className="text-cocoa" />
        ¿Tienes un cupón?
      </label>

      {!applied ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              if (couponResult) clearCoupon();
            }}
            onKeyDown={handleKeyDown}
            placeholder="BIENVENIDO..."
            maxLength={20}
            className="
              flex-1 px-4 py-2.5 rounded-lg border text-sm
              bg-fondo dark:bg-fondo-dark border-borde dark:border-borde-dark text-texto
              placeholder:text-texto/40
              focus:outline-none focus:ring-2 focus:ring-cocoa/40
              font-mono tracking-widest uppercase
            "
          />
          <button
            onClick={handleApply}
            disabled={!code.trim() || isValidating}
            className="
              px-4 py-2.5 rounded-lg text-sm font-semibold
              bg-cocoa text-white
              hover:bg-cocoa/90
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors min-w-[80px] flex items-center justify-center
            "
          >
            {isValidating ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Aplicar"
            )}
          </button>
        </div>
      ) : null}

      <AnimatePresence>
        {/* Error */}
        {couponResult && !couponResult.valid && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg"
          >
            <AlertCircle size={15} />
            {couponResult.error}
          </motion.div>
        )}

        {/* Éxito */}
        {couponResult?.valid && applied && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center justify-between bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 px-4 py-3 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-600" />
              <div>
                <p className="text-sm font-semibold text-green-700 dark:text-green-400 font-mono tracking-wider">
                  {couponResult.code}
                </p>
                <p className="text-xs text-green-600 dark:text-green-500">
                  {couponResult.type && typeLabels[couponResult.type]}
                  {" · "}
                  {couponResult.discount}% de descuento aplicado
                </p>
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="text-green-600 hover:text-green-800 transition-colors"
              aria-label="Quitar cupón"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
