import { motion } from "framer-motion";
import { CheckCircle2, Clock, MessageCircle } from "lucide-react";

interface Props {
  orderId: string;
  onViewOrders: () => void;
}

export function OrderConfirmed({ orderId, onViewOrders }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto text-center space-y-6 py-12"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto"
      >
        <CheckCircle2 className="w-10 h-10 text-green-400" />
      </motion.div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-cream">¡Comprobante enviado!</h1>
        <p className="text-muted text-sm">
          Orden{" "}
          <span className="font-mono text-cream">
            {orderId.slice(0, 8).toUpperCase()}
          </span>
        </p>
      </div>

      <div className="bg-oscuro rounded-2xl p-5 border border-white/10 text-left space-y-3">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-cocoa flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-cream">¿Qué sigue?</p>
            <p className="text-sm text-muted mt-1">
              Verificaremos tu pago en un plazo de{" "}
              <strong className="text-cream">1 a 24 horas hábiles</strong>. Te
              notificaremos cuando tu pedido sea confirmado.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MessageCircle className="w-5 h-5 text-cocoa flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-cream">¿Tienes dudas?</p>
            <p className="text-sm text-muted mt-1">
              Escríbenos por WhatsApp y te respondemos de inmediato.
            </p>
          </div>
        </div>
      </div>

      <button onClick={onViewOrders} className="btn-primary w-full">
        Ver mis pedidos
      </button>
    </motion.div>
  );
}
