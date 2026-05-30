// src/components/account/ReferralCard.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/supabase/client";
import { useUser } from "@/hooks";
import { Copy, CheckCheck, Users, Gift, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

interface ReferralStats {
  ref_code: string;
  total: number;
  completed: number;
  pending: number;
}

function useReferralStats() {
  const { user } = useUser();

  return useQuery({
    queryKey: ["referral-stats", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_referral_stats", {
        p_user_id: user!.id,
      });
      if (error) throw error;
      return data as unknown as ReferralStats; // ← cambio aquí
    },
  });
}

export function ReferralCard() {
  const [copied, setCopied] = useState(false);
  const { data: stats, isLoading } = useReferralStats();

  const APP_URL =
    import.meta.env.VITE_APP_URL ?? "https://bocaditos-yomis.vercel.app";
  const referralLink = `${APP_URL}/register?ref=${stats?.ref_code ?? ""}`;

  const handleCopyCode = async () => {
    if (!stats?.ref_code) return;
    await navigator.clipboard.writeText(stats.ref_code);
    setCopied(true);
    toast.success("Código copiado");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(referralLink);
    toast.success("Enlace copiado");
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Bocaditos Yomi's",
        text: `¡Prueba los mejores bocaditos artesanales! Usa mi código ${stats?.ref_code} al registrarte y obtén un descuento especial.`,
        url: referralLink,
      });
    } else {
      handleCopyLink();
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-borde bg-oscuro p-6 space-y-4 animate-pulse">
        <div className="h-6 w-48 rounded bg-cocoa/10" />
        <div className="h-16 rounded-xl bg-cocoa/10" />
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-cocoa/10" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-cocoa/30 bg-gradient-to-br
        from-oscuro to-cocoa/5 overflow-hidden mb-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-cocoa to-amber-600 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/20">
            <Users size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">
              Programa de referidos
            </h3>
            <p className="text-white/80 text-sm">
              Invita amigos y ambos ganan 5% de descuento
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Código */}
        <div>
          <p
            className="text-xs font-medium text-choco/50 dark:text-cream/50
            uppercase tracking-widest mb-2"
          >
            Tu código de referido
          </p>
          <div className="flex gap-2">
            <div
              className="flex-1 bg-fondo dark:bg-oscuro/80 border-2
              border-dashed border-cocoa/40 rounded-xl px-4 py-3 text-center"
            >
              <span
                className="font-mono font-bold text-2xl tracking-[0.2em]
                text-cocoa dark:text-dorado"
              >
                {stats?.ref_code ?? "——"}
              </span>
            </div>
            <button
              onClick={handleCopyCode}
              className="px-4 rounded-xl border border-borde
                text-choco/60 dark:text-cream/60
                hover:border-cocoa hover:text-cocoa
                transition-colors flex items-center gap-2 text-sm font-medium"
            >
              {copied ? (
                <CheckCheck size={16} className="text-green-500" />
              ) : (
                <Copy size={16} />
              )}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="border border-borde rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-choco dark:text-cream">
              {stats?.total ?? 0}
            </p>
            <p className="text-xs text-choco/50 dark:text-cream/50 mt-0.5">
              Referidos
            </p>
          </div>
          <div className="border border-borde rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-green-500">
              {stats?.completed ?? 0}
            </p>
            <p className="text-xs text-choco/50 dark:text-cream/50 mt-0.5">
              Completados
            </p>
          </div>
          <div className="border border-borde rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-amber-500">
              {stats?.pending ?? 0}
            </p>
            <p className="text-xs text-choco/50 dark:text-cream/50 mt-0.5">
              Pendientes
            </p>
          </div>
        </div>

        {/* Cómo funciona */}
        <div className="bg-fondo dark:bg-oscuro/50 rounded-xl p-4 space-y-3">
          <p
            className="text-xs font-semibold text-choco/50 dark:text-cream/50
            uppercase tracking-wider"
          >
            ¿Cómo funciona?
          </p>
          <div className="space-y-2.5">
            {[
              { icon: "1️⃣", text: "Comparte tu código con amigos" },
              {
                icon: "2️⃣",
                text: "Tu amigo se registra y hace su primera compra",
              },
              {
                icon: "3️⃣",
                text: "¡Ambos reciben un cupón de 5% de descuento!",
              },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-lg">{step.icon}</span>
                <p className="text-sm text-choco/70 dark:text-cream/70">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 py-3 rounded-xl
              border border-borde text-choco/70 dark:text-cream/70
              hover:border-cocoa hover:text-cocoa
              transition-colors text-sm font-medium"
          >
            <Copy size={15} />
            Copiar enlace
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 py-3 rounded-xl
              bg-cocoa text-white text-sm font-semibold
              hover:bg-cocoa/90 transition-colors"
          >
            <Gift size={15} />
            Compartir
          </button>
        </div>

        {/* Cupones ganados */}
        {(stats?.completed ?? 0) > 0 && (
          <div
            className="flex items-center gap-3 bg-green-500/10
            border border-green-500/30 rounded-xl px-4 py-3"
          >
            <Gift size={18} className="text-green-500 shrink-0" />
            <p className="text-sm text-green-600 dark:text-green-400">
              Ganaste <strong>{stats!.completed} cupón(es)</strong> por tus
              referidos completados. ¡Revísalos en Mis cupones!
            </p>
          </div>
        )}

        {/* Pendientes */}
        {(stats?.pending ?? 0) > 0 && (
          <div
            className="flex items-center gap-3 bg-amber-500/10
            border border-amber-500/30 rounded-xl px-4 py-3"
          >
            <Clock size={18} className="text-amber-500 shrink-0" />
            <p className="text-sm text-amber-600 dark:text-amber-400">
              Tienes <strong>{stats!.pending} amigo(s)</strong> registrados
              esperando hacer su primera compra.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
