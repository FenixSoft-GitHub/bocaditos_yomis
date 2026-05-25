// src/components/orders/OrderTimeline.tsx

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  CreditCard,
  ChefHat,
  Truck,
  PackageCheck,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "@/supabase/client";

// ── Definición de pasos ────────────────────────────────────────────────────

interface TimelineStep {
  key: string[]; // valores de status que activan este paso
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string; // clase de color activo
}

const STEPS: TimelineStep[] = [
  {
    key: ["Pending", "pending"],
    label: "Pedido recibido",
    description: "Tu pedido fue registrado correctamente",
    icon: <Clock className="size-4" />,
    color: "bg-amber-500 text-white",
  },
  {
    key: ["Paid", "paid", "confirmed"],
    label: "Pago confirmado",
    description: "Tu pago fue verificado por el equipo",
    icon: <CreditCard className="size-4" />,
    color: "bg-blue-500 text-white",
  },
  {
    key: ["preparing"],
    label: "Preparando",
    description: "Estamos preparando tu pedido con cariño",
    icon: <ChefHat className="size-4" />,
    color: "bg-purple-500 text-white",
  },
  {
    key: ["Shipped", "shipped"],
    label: "En camino",
    description: "Tu pedido está en camino",
    icon: <Truck className="size-4" />,
    color: "bg-cocoa text-white",
  },
  {
    key: ["Delivered", "delivered", "completed", "completado", "entregado"],
    label: "Entregado",
    description: "¡Tu pedido fue entregado!",
    icon: <PackageCheck className="size-4" />,
    color: "bg-green-500 text-white",
  },
];

const CANCELLED_KEYS = ["cancelled", "Cancelled", "cancelado"];

// ── Helpers ────────────────────────────────────────────────────────────────

const getStepIndex = (status: string): number => {
  return STEPS.findIndex((step) => step.key.includes(status));
};

// ── Componente principal ───────────────────────────────────────────────────

interface OrderTimelineProps {
  orderId: string;
  initialStatus: string;
}

export const OrderTimeline = ({
  orderId,
  initialStatus,
}: OrderTimelineProps) => {
  const [status, setStatus] = useState(initialStatus);

  // Supabase Realtime — escucha cambios en el status del pedido
  useEffect(() => {
    const channel = supabase
      .channel(`order-status-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          const newStatus = payload.new?.status;
          if (newStatus) setStatus(newStatus);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  const isCancelled = CANCELLED_KEYS.includes(status);
  const currentIndex = getStepIndex(status);

  // ── Cancelado ────────────────────────────────────────────────────────────
  if (isCancelled) {
    return (
      <div className="bg-cream dark:bg-oscuro border border-red-200 dark:border-red-900/40 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/20">
          <XCircle className="size-4 text-red-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-red-500">
            Estado del pedido
          </span>
        </div>
        <div className="px-5 py-5 flex items-center gap-3">
          <div className="size-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
            <XCircle className="size-5 text-red-500" />
          </div>
          <div>
            <p className="font-semibold text-red-600 dark:text-red-400">
              Pedido cancelado
            </p>
            <p className="text-xs text-choco/50 dark:text-cream/50 mt-0.5">
              Este pedido fue cancelado. Contáctanos si tienes dudas.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Timeline normal ───────────────────────────────────────────────────────
  return (
    <div className="bg-cream dark:bg-oscuro border border-cocoa/20 dark:border-cream/10 rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-cocoa/10 dark:border-cream/10 bg-cocoa/5 dark:bg-cream/5">
        <CheckCircle2 className="size-4 text-choco/60 dark:text-cream/60" />
        <span className="text-xs font-semibold uppercase tracking-wider text-choco/60 dark:text-cream/60">
          Seguimiento del pedido
        </span>
        {/* Indicador en vivo */}
        <div className="ml-auto flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] text-green-600 dark:text-green-400 font-medium">
            En vivo
          </span>
        </div>
      </div>

      <div className="px-5 py-5">
        {/* Desktop: horizontal / Mobile: vertical */}
        <div className="hidden sm:flex items-start justify-between relative">
          {/* Línea de progreso */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-cocoa/10 dark:bg-cream/10 mx-8" />
          <motion.div
            className="absolute top-5 left-0 h-0.5 bg-cocoa dark:bg-cream mx-8 origin-left"
            initial={{ scaleX: 0 }}
            animate={{
              scaleX: currentIndex >= 0 ? currentIndex / (STEPS.length - 1) : 0,
            }}
            style={{
              right: 0,
              width: `calc(100% - 4rem)`,
              scaleX: currentIndex >= 0 ? currentIndex / (STEPS.length - 1) : 0,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />

          {STEPS.map((step, index) => {
            const isCompleted = currentIndex >= index;
            const isCurrent = currentIndex === index;

            return (
              <div
                key={index}
                className="flex flex-col items-center gap-2 z-10 flex-1"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className={`size-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isCompleted
                      ? `${step.color} border-transparent shadow-md`
                      : "bg-cream dark:bg-oscuro border-cocoa/20 dark:border-cream/20 text-choco/30 dark:text-cream/30"
                  } ${isCurrent ? "ring-4 ring-cocoa/20 dark:ring-cream/20" : ""}`}
                >
                  {step.icon}
                </motion.div>
                <div className="text-center max-w-[80px]">
                  <p
                    className={`text-xs font-semibold leading-tight ${
                      isCompleted
                        ? "text-choco dark:text-cream"
                        : "text-choco/40 dark:text-cream/40"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile: vertical */}
        <div className="flex sm:hidden flex-col gap-0">
          {STEPS.map((step, index) => {
            const isCompleted = currentIndex >= index;
            const isCurrent = currentIndex === index;
            const isLast = index === STEPS.length - 1;

            return (
              <div key={index} className="flex gap-3">
                {/* Ícono + línea vertical */}
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className={`size-9 rounded-full flex items-center justify-center border-2 shrink-0 transition-all duration-300 ${
                      isCompleted
                        ? `${step.color} border-transparent shadow-sm`
                        : "bg-cream dark:bg-oscuro border-cocoa/20 dark:border-cream/20 text-choco/30 dark:text-cream/30"
                    } ${isCurrent ? "ring-3 ring-cocoa/20 dark:ring-cream/20" : ""}`}
                  >
                    {step.icon}
                  </motion.div>
                  {!isLast && (
                    <div
                      className={`w-0.5 flex-1 min-h-[24px] mt-1 mb-1 transition-colors duration-300 ${
                        currentIndex > index
                          ? "bg-cocoa dark:bg-cream"
                          : "bg-cocoa/10 dark:bg-cream/10"
                      }`}
                    />
                  )}
                </div>

                {/* Texto */}
                <div className={`pb-4 ${isLast ? "pb-0" : ""}`}>
                  <p
                    className={`text-sm font-semibold ${
                      isCompleted
                        ? "text-choco dark:text-cream"
                        : "text-choco/40 dark:text-cream/40"
                    }`}
                  >
                    {step.label}
                  </p>
                  {isCurrent && (
                    <p className="text-xs text-choco/50 dark:text-cream/50 mt-0.5">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Descripción del estado actual */}
        {currentIndex >= 0 && (
          <motion.p
            key={status}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden sm:block text-xs text-center text-choco/50 dark:text-cream/50 mt-4 pt-4 border-t border-cocoa/10 dark:border-cream/10"
          >
            {STEPS[currentIndex]?.description}
          </motion.p>
        )}
      </div>
    </div>
  );
};
