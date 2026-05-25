// src/pages/account/OrderUserPage.tsx

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useOrder } from "@/hooks";
import { Loader } from "@/components/shared/Loader";
import {
  ChevronLeft,
  Package,
  MapPin,
  Truck,
  Tag,
  DollarSign,
  Calendar,
} from "lucide-react";
import { formatDateLong, formatPrice, formatToTwoDecimals } from "@/helpers";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import { FadeIn } from "@/components/animations";
import { OrderTimeline } from "@/components/dashboard/orders/OrderTimeline";

const OrderUserPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const orderIndex = location.state?.orderIndex;
  const { data: order, isLoading } = useOrder(id as string);

  if (isLoading || !order) return <Loader size={60} />;

  return (
    <FadeIn>
      <div className="max-w-3xl mx-auto px-4 py-2 mb-6 text-choco dark:text-cream">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-cocoa/10 dark:bg-cream/10 hover:bg-cocoa/20 dark:hover:bg-cream/20 transition-colors"
            aria-label="Volver"
          >
            <ChevronLeft className="size-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold">
                Pedido # {orderIndex ?? id?.slice(0, 8)}
              </h1>
              <StatusBadge status={order.status} />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-choco/50 dark:text-cream/50 mt-1">
              <Calendar className="size-3" />
              {formatDateLong(order.created_at)}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {/* ── Timeline de seguimiento ──────────────────────────── */}
          <OrderTimeline orderId={id as string} initialStatus={order.status} />

          {/* ── Productos ───────────────────────────────────────── */}
          <div className="bg-cream dark:bg-oscuro border border-cocoa/20 dark:border-cream/10 rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-cocoa/10 dark:border-cream/10 bg-cocoa/5 dark:bg-cream/5">
              <Package className="size-4 text-choco/60 dark:text-cream/60" />
              <span className="text-xs font-semibold uppercase tracking-wider text-choco/60 dark:text-cream/60">
                Productos
              </span>
            </div>
            <ul className="divide-y divide-cocoa/10 dark:divide-cream/10">
              {order.orderItems.map((item, index) => (
                <li key={index} className="flex items-center gap-4 px-5 py-4">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-14 h-14 object-cover rounded-xl border border-cocoa/15 dark:border-cream/10 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm line-clamp-2">
                      {item.productName}
                    </p>
                    <p className="text-xs text-choco/50 dark:text-cream/50 mt-0.5">
                      {formatPrice(item.unit_price)} ×{" "}
                      {formatToTwoDecimals(item.quantity)}
                    </p>
                  </div>
                  <p className="font-bold text-sm shrink-0">
                    {formatPrice(item.subtotal)}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Resumen de pago ──────────────────────────────────── */}
          <div className="bg-cream dark:bg-oscuro border border-cocoa/20 dark:border-cream/10 rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-cocoa/10 dark:border-cream/10 bg-cocoa/5 dark:bg-cream/5">
              <DollarSign className="size-4 text-choco/60 dark:text-cream/60" />
              <span className="text-xs font-semibold uppercase tracking-wider text-choco/60 dark:text-cream/60">
                Resumen de pago
              </span>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-choco/60 dark:text-cream/60">
                  <Truck className="size-4" />
                  <span>Método de envío</span>
                </div>
                <span className="font-medium">
                  {order.deliveryOption || "—"}
                </span>
              </div>
              {order.promoCode && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-choco/60 dark:text-cream/60">
                    <Tag className="size-4" />
                    <span>Código promocional</span>
                  </div>
                  <span className="font-mono font-semibold text-dorado">
                    {order.promoCode}
                  </span>
                </div>
              )}
              <div className="border-t border-cocoa/10 dark:border-cream/10 pt-3 flex items-center justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-lg">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* ── Dirección ────────────────────────────────────────── */}
          <div className="bg-cream dark:bg-oscuro border border-cocoa/20 dark:border-cream/10 rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-cocoa/10 dark:border-cream/10 bg-cocoa/5 dark:bg-cream/5">
              <MapPin className="size-4 text-choco/60 dark:text-cream/60" />
              <span className="text-xs font-semibold uppercase tracking-wider text-choco/60 dark:text-cream/60">
                Dirección de entrega
              </span>
            </div>
            <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-choco/40 dark:text-cream/40 mb-1.5">
                  Cliente
                </p>
                <p className="font-semibold">{order.user.full_name}</p>
                <p className="text-sm text-choco/60 dark:text-cream/60">
                  {order.user.email}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-choco/40 dark:text-cream/40 mb-1.5">
                  Dirección
                </p>
                <div className="text-sm text-choco/80 dark:text-cream/80 space-y-0.5">
                  <p>{order.address.address_1}</p>
                  {order.address.address_2 && <p>{order.address.address_2}</p>}
                  <p>
                    {order.address.city}, {order.address.state}
                  </p>
                  {order.address.postalCode && (
                    <p>CP: {order.address.postalCode}</p>
                  )}
                  <p>{order.address.country}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
};

export default OrderUserPage;