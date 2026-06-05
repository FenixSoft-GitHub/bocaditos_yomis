// src/pages/account/LoyaltyPage.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Star,
  ArrowUpRight,
  ArrowDownLeft,
  RotateCcw,
  Gift,
  ChevronRight,
  Loader2,
  X,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  useLoyalty,
  levelConfig,
  type LoyaltyReward,
  type LoyaltyLevel,
} from "@/hooks/loyalty/useLoyalty";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-VE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── RedeemModal ──────────────────────────────────────────────────────────────

function RedeemModal({
  reward,
  points,
  onConfirm,
  onClose,
  isRedeeming,
}: {
  reward: LoyaltyReward;
  points: number;
  onConfirm: () => void;
  onClose: () => void;
  isRedeeming: boolean;
}) {
  const remaining = points - reward.points_required;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
      bg-black/60 p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-oscuro border border-borde rounded-2xl p-6
          w-full max-w-sm space-y-5"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-choco dark:text-cream text-lg">
            Canjear recompensa
          </h3>
          <button
            onClick={onClose}
            className="text-choco/50 dark:text-cream/50
              hover:text-choco dark:hover:text-cream transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Detalle */}
        <div
          className="bg-cocoa/5 border border-cocoa/20 rounded-xl p-4
          space-y-3 text-sm"
        >
          <div className="flex justify-between">
            <span className="text-choco/60 dark:text-cream/60">Recompensa</span>
            <span className="font-semibold text-choco dark:text-cream">
              {reward.name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-choco/60 dark:text-cream/60">Costo</span>
            <span className="font-semibold text-red-500">
              -{reward.points_required} pts
            </span>
          </div>
          <div className="flex justify-between border-t border-borde pt-3">
            <span className="text-choco/60 dark:text-cream/60">
              Puntos restantes
            </span>
            <span className="font-bold text-choco dark:text-cream">
              {remaining} pts
            </span>
          </div>
        </div>

        <p className="text-xs text-choco/50 dark:text-cream/50 text-center">
          El cupón será válido por 30 días y aparecerá en Mis cupones
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isRedeeming}
            className="flex-1 py-2.5 rounded-xl border border-borde
              text-choco/70 dark:text-cream/70 text-sm font-medium
              hover:text-choco dark:hover:text-cream transition-colors
              disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isRedeeming}
            className="flex-1 py-2.5 rounded-xl bg-cocoa text-white
              text-sm font-semibold hover:bg-cocoa/90 transition-colors
              disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isRedeeming ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Canjeando...
              </>
            ) : (
              <>
                <Gift size={15} /> Confirmar
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── SuccessModal ─────────────────────────────────────────────────────────────

function SuccessModal({
  couponCode,
  discount,
  expiresAt,
  onClose,
}: {
  couponCode: string;
  discount: number;
  expiresAt: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
      bg-black/60 p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-oscuro border border-borde rounded-2xl p-6
          w-full max-w-sm space-y-5 text-center"
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="size-16 rounded-full bg-green-500/10 flex items-center
            justify-center"
          >
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h3 className="font-bold text-choco dark:text-cream text-lg">
            ¡Canje exitoso!
          </h3>
          <p className="text-sm text-choco/60 dark:text-cream/60">
            Tu cupón de <strong>{discount}% OFF</strong> está listo para usar
          </p>
        </div>

        {/* Cupón */}
        <div
          className="bg-amber-500/10 border-2 border-dashed border-amber-500/40
          rounded-xl p-4"
        >
          <p
            className="text-xs text-amber-600 dark:text-amber-400 font-semibold
            uppercase tracking-widest mb-2"
          >
            Tu código
          </p>
          <p
            className="font-mono font-bold text-2xl tracking-[0.2em]
            text-cocoa dark:text-dorado"
          >
            {couponCode}
          </p>
          <p className="text-xs text-choco/40 dark:text-cream/40 mt-2">
            Válido hasta {formatDate(expiresAt)}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 py-2.5 rounded-xl border border-borde
              text-choco/70 dark:text-cream/70 text-sm font-medium
              hover:border-cocoa transition-colors"
          >
            {copied ? "✓ Copiado" : "Copiar código"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-cocoa text-white
              text-sm font-semibold hover:bg-cocoa/90 transition-colors"
          >
            Usar ahora →
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoyaltyPage() {
  const {
    stats,
    rewards,
    transactions,
    isLoadingStats,
    isLoadingRewards,
    isLoadingTransactions,
    redeem,
    isRedeeming,
  } = useLoyalty();

  const [selectedReward, setSelectedReward] = useState<LoyaltyReward | null>(
    null,
  );
  const [redeemResult, setRedeemResult] = useState<{
    coupon_code: string;
    discount: number;
    expires_at: string;
  } | null>(null);

  const level = (stats?.level ?? "bronze") as LoyaltyLevel;
  const levelConf = levelConfig[level];

  const handleRedeem = async () => {
    if (!selectedReward) return;
    try {
      const result = await redeem(selectedReward.id);
      if (!result.success) {
        toast.error(result.error ?? "Error al canjear");
        return;
      }
      setSelectedReward(null);
      setRedeemResult({
        coupon_code: result.coupon_code!,
        discount: result.discount!,
        expires_at: result.expires_at!,
      });
    } catch {
      toast.error("Error al canjear los puntos");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-choco dark:text-cream">
          Programa de fidelidad
        </h1>
        <p className="text-sm text-choco/50 dark:text-cream/50 mt-1">
          Gana puntos con cada compra y canjéalos por descuentos
        </p>
      </div>

      {/* Card principal — nivel + puntos */}
      {isLoadingStats ? (
        <div className="h-48 rounded-2xl bg-cocoa/10 animate-pulse" />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl overflow-hidden border ${levelConf.border}`}
        >
          {/* Header del card */}
          <div className={`bg-gradient-to-r ${levelConf.gradient} p-6`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{levelConf.emoji}</span>
                <div>
                  <p className="text-white/80 text-sm">Nivel actual</p>
                  <p className="text-white font-bold text-2xl">
                    {levelConf.label}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm">Puntos disponibles</p>
                <p className="text-white font-bold text-3xl">
                  {stats?.points ?? 0}
                </p>
              </div>
            </div>
          </div>

          {/* Progreso al siguiente nivel */}
          <div className="bg-oscuro/80 p-5 space-y-3">
            {stats?.next_level ? (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-choco/60 dark:text-cream/60">
                    Progreso a{" "}
                    {levelConfig[stats.next_level as LoyaltyLevel].label}{" "}
                    {levelConfig[stats.next_level as LoyaltyLevel].emoji}
                  </span>
                  <span className="font-semibold text-choco dark:text-cream">
                    {stats.points_to_next} pts para subir
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-borde overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full bg-gradient-to-r ${levelConf.gradient}`}
                  />
                </div>
                <div className="flex justify-between text-xs text-choco/40 dark:text-cream/40">
                  <span>{stats.lifetime_points} pts acumulados</span>
                  <span>{stats.progress}%</span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 text-yellow-500">
                <Trophy size={16} />
                <p className="text-sm font-semibold">
                  ¡Nivel máximo alcanzado! Ganas 2x puntos en cada compra
                </p>
              </div>
            )}

            {/* Multiplicador actual */}
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-lg
              ${levelConf.bg} ${levelConf.border} border text-xs`}
            >
              <Star size={13} className={levelConf.color} />
              <span className={levelConf.color}>
                {level === "bronze" &&
                  "Nivel Bronce — 1 punto por cada $1 de compra"}
                {level === "silver" &&
                  "Nivel Plata — 1.5 puntos por cada $1 de compra"}
                {level === "gold" &&
                  "Nivel Oro — 2 puntos por cada $1 de compra"}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recompensas */}
      <div className="space-y-3">
        <h2 className="font-semibold text-choco dark:text-cream flex items-center gap-2">
          <Gift size={18} className="text-cocoa" />
          Canjear puntos
        </h2>

        {isLoadingRewards ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-xl bg-cocoa/10 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {rewards.map((reward) => {
              const canRedeem = (stats?.points ?? 0) >= reward.points_required;
              return (
                <motion.button
                  key={reward.id}
                  whileHover={canRedeem ? { scale: 1.02 } : {}}
                  whileTap={canRedeem ? { scale: 0.98 } : {}}
                  onClick={() => canRedeem && setSelectedReward(reward)}
                  disabled={!canRedeem}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    canRedeem
                      ? "border-cocoa/40 bg-cocoa/5 hover:bg-cocoa/10 cursor-pointer"
                      : "border-borde bg-oscuro/30 opacity-60 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">
                      {reward.discount <= 5
                        ? "🎁"
                        : reward.discount <= 8
                          ? "🎀"
                          : "👑"}
                    </span>
                    {canRedeem && (
                      <ChevronRight size={16} className="text-cocoa mt-1" />
                    )}
                  </div>
                  <p className="font-bold text-choco dark:text-cream">
                    {reward.discount}% OFF
                  </p>
                  <p className="text-xs text-choco/50 dark:text-cream/50 mt-0.5">
                    {reward.points_required} puntos
                  </p>
                  {!canRedeem && (
                    <p className="text-xs text-red-400 mt-1">
                      Te faltan {reward.points_required - (stats?.points ?? 0)}{" "}
                      pts
                    </p>
                  )}
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* Historial */}
      <div className="space-y-3 mb-4">
        <h2 className="font-semibold text-choco dark:text-cream flex items-center gap-2">
          <Trophy size={18} className="text-cocoa" />
          Historial de puntos
        </h2>

        {isLoadingTransactions ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-14 rounded-xl bg-cocoa/10 animate-pulse"
              />
            ))}
          </div>
        ) : !transactions.length ? (
          <div
            className="flex flex-col items-center justify-center py-12 gap-3
            border border-borde rounded-2xl"
          >
            <Trophy size={32} className="text-choco/20 dark:text-cream/20" />
            <p className="text-sm text-choco/40 dark:text-cream/40">
              Aún no tienes movimientos
            </p>
            <p className="text-xs text-choco/30 dark:text-cream/30">
              Completa tu primera compra para ganar puntos
            </p>
          </div>
        ) : (
          <div className="border border-borde rounded-2xl overflow-hidden divide-y divide-borde">
            {transactions.map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 px-4 py-3
                  hover:bg-cocoa/5 dark:hover:bg-cream/5 transition-colors"
              >
                {/* Ícono */}
                <div
                  className={`size-9 rounded-full flex items-center justify-center shrink-0 ${
                    tx.type === "earned"
                      ? "bg-green-500/10"
                      : tx.type === "redeemed"
                        ? "bg-blue-500/10"
                        : tx.type === "reversed"
                          ? "bg-red-500/10"
                          : "bg-stone-500/10"
                  }`}
                >
                  {tx.type === "earned" && (
                    <ArrowUpRight size={16} className="text-green-500" />
                  )}
                  {tx.type === "redeemed" && (
                    <Gift size={16} className="text-blue-500" />
                  )}
                  {tx.type === "reversed" && (
                    <ArrowDownLeft size={16} className="text-red-500" />
                  )}
                  {tx.type === "expired" && (
                    <RotateCcw size={16} className="text-stone-500" />
                  )}
                </div>

                {/* Descripción */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-choco dark:text-cream truncate">
                    {tx.description}
                  </p>
                  <p className="text-xs text-choco/50 dark:text-cream/50">
                    {formatDate(tx.created_at)}
                  </p>
                </div>

                {/* Puntos */}
                <span
                  className={`font-bold text-sm shrink-0 ${
                    tx.points > 0 ? "text-green-500" : "text-red-400"
                  }`}
                >
                  {tx.points > 0 ? "+" : ""}
                  {tx.points} pts
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modales */}
      <AnimatePresence>
        {selectedReward && (
          <RedeemModal
            reward={selectedReward}
            points={stats?.points ?? 0}
            onConfirm={handleRedeem}
            onClose={() => setSelectedReward(null)}
            isRedeeming={isRedeeming}
          />
        )}
        {redeemResult && (
          <SuccessModal
            couponCode={redeemResult.coupon_code}
            discount={redeemResult.discount}
            expiresAt={redeemResult.expires_at}
            onClose={() => {
              setRedeemResult(null);
              window.location.href = "/products";
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
