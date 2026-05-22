// src/components/notifications/PushNotificationsBanner.tsx
// Coloca este componente en ClientLayout o en OrdersUserPage

import { Bell, BellOff, BellRing, X, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { usePushNotifications } from "@/hooks/push/usePushNotifications";

export const PushNotificationsBanner = () => {
  const { status, isLoading, toggle, isDenied } = usePushNotifications();
  const [dismissed, setDismissed] = useState(false);

  // No mostrar si: cargando, no soportado, ya suscrito, o fue descartado
  if (
    status === "loading" ||
    status === "unsupported" ||
    status === "subscribed" ||
    dismissed
  ) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
        className={`relative flex items-start gap-3 p-4 rounded-2xl border mb-4 ${
          isDenied
            ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/40"
            : "bg-cocoa/5 dark:bg-cream/5 border-cocoa/15 dark:border-cream/15"
        }`}
      >
        {/* Ícono */}
        <div
          className={`shrink-0 p-2 rounded-xl ${
            isDenied
              ? "bg-amber-100 dark:bg-amber-900/40"
              : "bg-cocoa/10 dark:bg-cream/10"
          }`}
        >
          {isDenied ? (
            <BellOff className="size-5 text-amber-600 dark:text-amber-400" />
          ) : (
            <BellRing className="size-5 text-choco dark:text-cream" />
          )}
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          {isDenied ? (
            <>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                Notificaciones bloqueadas
              </p>
              <p className="text-xs text-amber-700/70 dark:text-amber-400/70 mt-0.5">
                Actívalas desde la configuración de tu navegador para recibir
                actualizaciones de tus pedidos.
              </p>
              <a
                href="https://support.google.com/chrome/answer/3220216"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-amber-700 dark:text-amber-400 underline hover:no-underline"
              >
                Cómo activarlas
                <ExternalLink className="size-3" />
              </a>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-choco dark:text-cream">
                Activa las notificaciones de tus pedidos
              </p>
              <p className="text-xs text-choco/60 dark:text-cream/60 mt-0.5">
                Te avisaremos cuando tu pedido sea confirmado, enviado o
                entregado.
              </p>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => toggle()}
                disabled={isLoading}
                className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-xl bg-choco text-cream dark:bg-cream dark:text-oscuro text-xs font-semibold hover:bg-cocoa dark:hover:bg-butter transition-all disabled:opacity-50 shadow-sm"
              >
                <Bell className="size-3.5" />
                {isLoading ? "Activando..." : "Activar notificaciones"}
              </motion.button>
            </>
          )}
        </div>

        {/* Botón cerrar */}
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 p-1 rounded-lg text-choco/30 dark:text-cream/30 hover:text-choco dark:hover:text-cream hover:bg-choco/10 dark:hover:bg-cream/10 transition-colors"
          aria-label="Descartar"
        >
          <X className="size-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
