// src/pages/ThankyouPage.tsx
// Cambio: sección de pago dinámica según payment_type

import { Link, useParams } from "react-router-dom";
import { useOrder } from "@/hooks";
import { Loader } from "@/components/shared/Loader";
import { formatPrice, formatToTwoDecimals } from "@/helpers";
import {
  ShieldCheck,
  PackageCheck,
  ArrowRight,
  Copy,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";

// ── Componente de datos de pago según tipo ─────────────────────────────────

const USDTPaymentInfo = ({
  wallet,
  amount,
}: {
  wallet: string;
  amount: number;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(wallet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-cocoa/30 dark:border-cream/20 rounded-xl p-5 space-y-4 bg-yellow-50/50 dark:bg-yellow-900/10">
      <div className="flex items-center gap-2">
        <ShieldCheck className="size-5 text-yellow-600 dark:text-yellow-400" />
        <h2 className="font-semibold">Pago con USDT</h2>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-yellow-400/20 text-yellow-600 dark:text-yellow-400">
          TRC20
        </span>
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <p className="text-xs text-choco/50 dark:text-cream/50 mb-1 font-semibold uppercase tracking-wider">
            Monto a enviar
          </p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            ${formatToTwoDecimals(amount)} USDT
          </p>
        </div>

        <div>
          <p className="text-xs text-choco/50 dark:text-cream/50 mb-1.5 font-semibold uppercase tracking-wider">
            Dirección de wallet (TRC20)
          </p>
          <div className="flex items-center gap-2 bg-cocoa/5 dark:bg-cream/5 border border-cocoa/20 dark:border-cream/10 rounded-xl px-4 py-3">
            <p className="flex-1 font-mono text-xs break-all text-choco dark:text-cream">
              {wallet}
            </p>
            <button
              onClick={handleCopy}
              className="shrink-0 p-1.5 rounded-lg hover:bg-cocoa/10 dark:hover:bg-cream/10 transition-colors"
              aria-label="Copiar dirección"
            >
              <Copy className="size-4 text-choco/60 dark:text-cream/60" />
            </button>
          </div>
          {copied && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              ✓ Dirección copiada
            </p>
          )}
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-3 space-y-1">
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
            ⚠️ Instrucciones importantes
          </p>
          <ul className="text-xs text-amber-700/80 dark:text-amber-400/80 space-y-0.5 list-disc list-inside">
            <li>
              Usa únicamente la red <strong>TRC20</strong>
            </li>
            <li>Envía exactamente el monto indicado</li>
            <li>Guarda el hash de la transacción</li>
          </ul>
        </div>

        <p className="text-xs text-choco/60 dark:text-cream/50">
          Una vez realizado el pago, envía el{" "}
          <strong>hash de la transacción</strong> a{" "}
          <strong>ventas@bocaditosyomis.com</strong> para procesar tu entrega.
        </p>

        <a
          href="https://tronscan.org"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-yellow-600 dark:text-yellow-400 hover:underline"
        >
          Verificar transacción en TronScan
          <ExternalLink className="size-3" />
        </a>
      </div>
    </div>
  );
};

const BankPaymentInfo = ({ paymentType }: { paymentType: string | null }) => (
  <div className="border border-cocoa/30 dark:border-cream/20 rounded-xl p-5 space-y-3 bg-cream/50 dark:bg-cream/5">
    <div className="flex items-center gap-2">
      <ShieldCheck className="size-5 text-choco dark:text-cocoa" />
      <h2 className="font-semibold">
        {paymentType === "pago_movil"
          ? "Datos para pago móvil"
          : "Datos para transferencia"}
      </h2>
    </div>
    <ul className="text-sm space-y-1 text-choco/80 dark:text-cream/80">
      <li>
        <strong>Razón Social:</strong> Bocaditos Yomi's
      </li>
      <li>
        <strong>Banco:</strong> Venezuela
      </li>
      <li>
        <strong>RIF:</strong> 123456789000
      </li>
      <li>
        <strong>Cuenta:</strong> 1234567890
      </li>
    </ul>
    <p className="text-xs text-choco/60 dark:text-cream/50 pt-1">
      Envía tu comprobante a <strong>ventas@bocaditosyomis.com</strong> para
      procesar tu entrega.
    </p>
  </div>
);

// ── Página principal ───────────────────────────────────────────────────────

const USDT_WALLET = "TU_DIRECCION_WALLET_USDT"; // ← mismo valor que pusiste en el SQL

const ThankyouPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useOrder(String(id));

  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center text-choco dark:text-cream">
        <p>
          Error al cargar la orden.{" "}
          <Link to="/products" className="underline">
            Volver a productos
          </Link>
        </p>
      </div>
    );

  if (isLoading || !data) return <Loader size={50} />;

  const isUsdt = data.payment_type === "usdt";

  return (
    <main className="min-h-screen bg-fondo dark:bg-fondo-dark text-choco dark:text-cream px-4 py-10">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <PackageCheck className="size-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold">
            ¡Gracias, {data.user.full_name}!
          </h1>
          <p className="text-sm text-choco/60 dark:text-cream/60">
            Tu pedido fue confirmado. Pronto nos pondremos en contacto contigo.
          </p>
        </div>

        {/* Datos de pago — dinámico según tipo */}
        {isUsdt ? (
          <USDTPaymentInfo wallet={USDT_WALLET} amount={data.totalAmount} />
        ) : (
          <BankPaymentInfo paymentType={data.payment_type} />
        )}

        {/* Detalles del pedido */}
        <div className="border border-cocoa/30 dark:border-cream/20 rounded-xl overflow-hidden">
          <div className="bg-cocoa/10 dark:bg-cream/10 px-5 py-3">
            <h2 className="font-semibold">Detalles del pedido</h2>
          </div>
          <div className="p-5 space-y-5">
            <ul className="space-y-4">
              {data.orderItems.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-4 py-2 border-b border-cocoa/10 dark:border-cream/10 last:border-0"
                >
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-14 h-14 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">
                      {item.productName}
                    </p>
                    <p className="text-xs text-choco/50 dark:text-cream/50">
                      {formatPrice(item.unit_price)} ×{" "}
                      {formatToTwoDecimals(item.quantity)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold shrink-0">
                    {formatPrice(item.subtotal)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="flex justify-between font-bold text-base pt-2">
              <span>Total</span>
              <span>{formatPrice(data.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Info adicional */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="font-semibold text-xs uppercase tracking-wider text-choco/50 dark:text-cream/50">
              Contacto
            </p>
            <p>{data.user.email}</p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-xs uppercase tracking-wider text-choco/50 dark:text-cream/50">
              Método de pago
            </p>
            <p>
              {data.payment_type === "pago_movil" && "Pago móvil"}
              {data.payment_type === "transferencia" &&
                "Transferencia bancaria"}
              {data.payment_type === "usdt" && "USDT (TRC20)"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-xs uppercase tracking-wider text-choco/50 dark:text-cream/50">
              Dirección
            </p>
            <p>{data.address.address_1}</p>
            {data.address.address_2 && <p>{data.address.address_2}</p>}
            <p>
              {data.address.city}, {data.address.state}
            </p>
            <p>{data.address.country}</p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-xs uppercase tracking-wider text-choco/50 dark:text-cream/50">
              Envío
            </p>
            <p>{data.deliveryOption}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
          <Link
            to="/contact-us"
            className="text-sm text-choco/60 dark:text-cream/60 hover:text-choco dark:hover:text-cream underline underline-offset-4 transition-colors"
          >
            ¿Necesitas ayuda? Contáctanos
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 btn-primary px-6 py-3 rounded-full text-sm"
          >
            Seguir comprando
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ThankyouPage;