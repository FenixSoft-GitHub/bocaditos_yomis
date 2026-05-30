// src/components/shared/OnboardingModal.tsx

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Heart,
  Bell,
  ArrowRight,
  X,
  PackageCheck,
  Search,
  CreditCard,
} from "lucide-react";
import { usePushNotifications } from "@/hooks/push/usePushNotifications";

// ── Pasos del onboarding ───────────────────────────────────────────────────

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  items?: { icon: React.ReactNode; text: string }[];
}

const STEPS: Step[] = [
  {
    icon: <ShoppingBag className="size-10" />,
    title: "¡Bienvenido a Bocaditos Yomi's!",
    description:
      "Snacks y bocaditos artesanales hechos con amor. Aquí te explicamos cómo aprovechar al máximo tu experiencia.",
    color: "bg-cocoa/10 text-cocoa dark:bg-cream/10 dark:text-cream",
    items: [
      {
        icon: <Search className="size-4" />,
        text: "Busca productos por nombre o categoría",
      },
      {
        icon: <Heart className="size-4" />,
        text: "Guarda tus favoritos con el corazón",
      },
      {
        icon: <ShoppingBag className="size-4" />,
        text: "Agrega al carrito y compra fácilmente",
      },
    ],
  },
  {
    icon: <PackageCheck className="size-10" />,
    title: "¿Cómo funciona el proceso?",
    description:
      "Comprar es muy sencillo. Sigue estos pasos y recibe tus bocaditos en casa.",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    items: [
      {
        icon: <ShoppingBag className="size-4" />,
        text: "Agrega productos al carrito",
      },
      {
        icon: <CreditCard className="size-4" />,
        text: "Elige tu método de pago (Pago móvil, transferencia o USDT)",
      },
      {
        icon: <PackageCheck className="size-4" />,
        text: "Sube tu comprobante y listo — nosotros te confirmamos",
      },
    ],
  },
  {
    icon: <Bell className="size-10" />,
    title: "Activa las notificaciones",
    description:
      "Entérate en tiempo real cuando tu pedido sea confirmado, enviado o entregado.",
    color: "bg-green-500/10 text-green-600 dark:text-green-400",
  },
];

// ── Componente ─────────────────────────────────────────────────────────────

interface Props {
  onComplete: () => void;
}

export const OnboardingModal = ({ onComplete }: Props) => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const {
    status,
    toggle: togglePush,
    isLoading: isPushLoading,
  } = usePushNotifications();

  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleActivatePush = async () => {
    await togglePush();
    onComplete();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 16 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="relative bg-fondo dark:bg-oscuro border border-cocoa/20 dark:border-cream/10 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
        >
          {/* Botón cerrar */}
          <button
            onClick={onComplete}
            className="absolute top-4 right-4 p-1.5 rounded-full text-choco/40 dark:text-cream/40 hover:text-choco dark:hover:text-cream hover:bg-cocoa/10 dark:hover:bg-cream/10 transition-colors z-10"
            aria-label="Cerrar"
          >
            <X className="size-4" />
          </button>

          {/* Contenido animado por step */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
              className="p-7 pt-8"
            >
              {/* Ícono */}
              <div
                className={`w-16 h-16 rounded-2xl ${current.color} flex items-center justify-center mb-5`}
              >
                {current.icon}
              </div>

              {/* Título */}
              <h2 className="text-xl font-bold text-choco dark:text-cream mb-2 leading-tight">
                {current.title}
              </h2>

              {/* Descripción */}
              <p className="text-sm text-choco/60 dark:text-cream/60 leading-relaxed mb-5">
                {current.description}
              </p>

              {/* Items del paso */}
              {current.items && (
                <ul className="space-y-3 mb-5">
                  {current.items.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-3 text-sm text-choco/80 dark:text-cream/80"
                    >
                      <span className="size-8 rounded-xl bg-cocoa/8 dark:bg-cream/8 flex items-center justify-center shrink-0 text-choco/60 dark:text-cream/60">
                        {item.icon}
                      </span>
                      {item.text}
                    </motion.li>
                  ))}
                </ul>
              )}

              {/* Paso de notificaciones — UI especial */}
              {isLast && (
                <div className="space-y-3 mb-5">
                  {status === "subscribed" ? (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 text-sm text-green-700 dark:text-green-400">
                      <Bell className="size-4 shrink-0" />
                      ¡Notificaciones ya activadas!
                    </div>
                  ) : status === "denied" ? (
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-700 dark:text-amber-400">
                      Las notificaciones están bloqueadas. Puedes activarlas
                      desde la configuración de tu navegador.
                    </div>
                  ) : (
                    <button
                      onClick={handleActivatePush}
                      disabled={isPushLoading}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 text-white font-semibold text-sm hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      <Bell className="size-4" />
                      {isPushLoading
                        ? "Activando..."
                        : "Activar notificaciones"}
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer — indicadores + botones */}
          <div className="px-7 pb-7 flex items-center justify-between gap-4">
            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {STEPS.map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    width: i === step ? 20 : 6,
                    opacity: i === step ? 1 : 0.3,
                  }}
                  transition={{ duration: 0.2 }}
                  className="h-1.5 rounded-full bg-cocoa dark:bg-cream"
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              {/* Ir a productos */}
              {isLast && (
                <button
                  onClick={() => {
                    onComplete();
                    navigate("/products");
                  }}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-choco/60 dark:text-cream/60 hover:text-choco dark:hover:text-cream hover:bg-cocoa/10 dark:hover:bg-cream/10 transition-colors"
                >
                  Ver productos
                </button>
              )}

              {/* Siguiente / Finalizar */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-choco dark:bg-cream text-cream dark:text-oscuro font-semibold text-sm hover:bg-cocoa dark:hover:bg-butter transition-colors shadow-sm"
              >
                {isLast ? "¡Entendido!" : "Siguiente"}
                {!isLast && <ArrowRight className="size-4" />}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
