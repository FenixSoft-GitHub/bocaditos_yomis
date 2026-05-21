import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Phone,
  CreditCard,
  Calendar,
  Upload,
  Hash,
  CheckCircle2,
} from "lucide-react";
import type {
  PaymentMethod,
  CreateOrderResponse,
} from "@/services/orderService";
import type { SubmitReceiptPayload } from "@/services/orderService";

interface Props {
  orderData: CreateOrderResponse;
  onSubmit: (payload: SubmitReceiptPayload) => void;
  loading: boolean;
  error: string | null;
}

export function PaymentInfo({ orderData, onSubmit, loading, error }: Props) {
  const { order_id, total_amount, payment_methods } = orderData;

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    payment_methods[0] ?? null,
  );
  const [referenceNumber, setReferenceNumber] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setReceiptFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMethod) return;
    if (!referenceNumber.trim()) return;

    onSubmit({
      order_id,
      payment_method_id: selectedMethod.id,
      reference_number: referenceNumber.trim(),
      amount: total_amount,
      payment_date: paymentDate,
      receipt_file: receiptFile ?? undefined,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Resumen del monto */}
      <div className="bg-oscuro rounded-2xl p-6 border border-white/10">
        <p className="text-sm text-muted mb-1">Total a pagar</p>
        <p className="text-4xl font-bold text-cream">
          $ {total_amount.toFixed(2)}
        </p>
        <p className="text-xs text-muted mt-1">
          Referencia de orden:{" "}
          <span className="text-cream font-mono">
            {order_id.slice(0, 8).toUpperCase()}
          </span>
        </p>
      </div>

      {/* Selector de método de pago si hay varios */}
      {payment_methods.length > 1 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-cream">Selecciona el banco:</p>
          <div className="grid gap-2">
            {payment_methods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method)}
                className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                  selectedMethod?.id === method.id
                    ? "border-cocoa bg-cocoa/10"
                    : "border-white/10 bg-oscuro hover:border-white/20"
                }`}
              >
                <Building2 className="size-5 text-cocoa flex-shrink-0" />
                <div>
                  <p className="font-medium text-cream">{method.bank_name}</p>
                  <p className="text-xs text-muted">{method.account_name}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Datos bancarios */}
      {selectedMethod && (
        <motion.div
          key={selectedMethod.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-oscuro rounded-2xl p-6 border border-white/10 space-y-4"
        >
          <p className="font-semibold text-cream flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cocoa" />
            Datos para el pago
          </p>

          <div className="grid gap-3">
            <DataRow label="Banco" value={selectedMethod.bank_name} />
            <DataRow label="Nombre" value={selectedMethod.account_name} />
            <DataRow label="RIF / Cédula" value={selectedMethod.id_number} />
            {selectedMethod.phone && (
              <DataRow
                label="Teléfono"
                value={selectedMethod.phone}
                icon={<Phone className="w-4 h-4" />}
              />
            )}
            {selectedMethod.account_number && (
              <DataRow
                label="Número de cuenta"
                value={selectedMethod.account_number}
                icon={<CreditCard className="w-4 h-4" />}
                mono
              />
            )}
          </div>
        </motion.div>
      )}

      {/* Formulario del comprobante */}
      <form
        onSubmit={handleSubmit}
        className="bg-oscuro rounded-2xl p-6 border border-white/10 space-y-5"
      >
        <p className="font-semibold text-cream">Enviar comprobante de pago</p>

        {/* Número de referencia */}
        <div className="space-y-1.5">
          <label className="text-sm text-muted flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5" />
            Número de referencia *
          </label>
          <input
            type="text"
            required
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            placeholder="Ej: 00123456"
            className="w-full bg-cream/10 border border-white/10 rounded-xl px-4 py-3 text-cream placeholder:text-muted focus:outline-none focus:border-cocoa transition-colors"
          />
        </div>

        {/* Fecha del pago */}
        <div className="space-y-1.5">
          <label className="text-sm text-muted flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Fecha del pago *
          </label>
          <input
            type="date"
            required
            value={paymentDate}
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) => setPaymentDate(e.target.value)}
            className="w-full bg-cream/10 border border-white/10 rounded-xl px-4 py-3 text-cream focus:outline-none focus:border-cocoa transition-colors"
          />
        </div>

        {/* Subir imagen */}
        <div className="space-y-1.5">
          <label className="text-sm text-muted flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" />
            Captura del comprobante (opcional pero recomendado)
          </label>

          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Comprobante"
                className="w-full max-h-48 object-contain rounded-xl border border-white/10"
              />
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  setReceiptFile(null);
                }}
                className="absolute top-2 right-2 bg-red-500/80 text-white text-xs px-2 py-1 rounded-lg"
              >
                Quitar
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-white/10 rounded-xl p-8 cursor-pointer hover:border-cocoa/50 transition-colors">
              <Upload className="w-8 h-8 text-muted" />
              <span className="text-sm text-muted">Toca para subir imagen</span>
              <span className="text-xs text-muted/60">JPG, PNG o PDF</span>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm bg-red-400/10 px-4 py-3 rounded-xl">
            {error}
          </p>
        )}

        {/* Botón */}
        <button
          type="submit"
          disabled={loading || !selectedMethod || !referenceNumber.trim()}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="animate-spin size-5 border-2 border-white/30 border-t-white rounded-full" />
          ) : (
            <>
              <CheckCircle2 className="size-5" />
              Confirmar pago
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}

// Componente auxiliar para mostrar un dato bancario
function DataRow({
  label,
  value,
  icon,
  mono = false,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  mono?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1.5 text-muted text-sm min-w-0">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`text-cream text-sm ${mono ? "font-mono" : "font-medium"}`}
        >
          {value}
        </span>
        <button
          type="button"
          onClick={copy}
          className="text-xs text-cocoa hover:text-cocoa/70 transition-colors"
        >
          {copied ? "✓" : "Copiar"}
        </button>
      </div>
    </div>
  );
}
