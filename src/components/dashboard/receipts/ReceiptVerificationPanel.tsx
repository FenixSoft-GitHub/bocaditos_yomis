// src/components/dashboard/receipts/ReceiptVerificationPanel.tsx
// Cambio: mostrar "Hash de transacción" y link a TronScan cuando payment_type === 'usdt'

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Eye,
  ZoomIn,
  User,
  Hash,
  Calendar,
  DollarSign,
  Building2,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/supabase/client.ts";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge.tsx";

interface Receipt {
  id: string;
  reference_number: string;
  amount: number;
  payment_date: string;
  receipt_url: string | null;
  status: "pending" | "verified" | "rejected";
  admin_notes: string | null;
  created_at: string;
  orders: {
    id: string;
    total_amount: number;
    payment_type: string;
  };
  users: {
    full_name: string;
    email: string;
  };
  payment_methods: {
    bank_name: string;
    type: string;
  };
}

export function ReceiptVerificationPanel() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "pending" | "verified" | "rejected" | "all"
  >("pending");
  const [selected, setSelected] = useState<Receipt | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    fetchReceipts();

    const channel = supabase
      .channel("receipts-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "payment_receipts" },
        () => fetchReceipts(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filter]);

  async function fetchReceipts() {
    setLoading(true);
    let query = supabase
      .from("payment_receipts")
      .select(
        `*, orders ( id, total_amount, payment_type ), users ( full_name, email ), payment_methods ( bank_name, type )`,
      )
      .order("created_at", { ascending: false });

    if (filter !== "all") query = query.eq("status", filter);

    const { data } = await query;
    setReceipts((data as Receipt[]) ?? []);
    setLoading(false);
  }

  async function handleVerify(
    receipt: Receipt,
    action: "verified" | "rejected",
  ) {
    setActionLoading(true);
    try {
      const { error: receiptError } = await supabase
        .from("payment_receipts")
        .update({ status: action, admin_notes: adminNotes.trim() || null })
        .eq("id", receipt.id);

      if (receiptError) throw receiptError;

      const newOrderStatus = action === "verified" ? "paid" : "cancelled";
      const updateData: Record<string, unknown> = { status: newOrderStatus };
      if (action === "verified") updateData.paid_at = new Date().toISOString();

      const { error: orderError } = await supabase
        .from("orders")
        .update(updateData)
        .eq("id", receipt.orders.id);

      if (orderError) throw orderError;

      if (action === "verified") {
        const { data: items } = await supabase
          .from("order_items")
          .select("product_id, quantity")
          .eq("order_id", receipt.orders.id);

        if (items) {
          for (const item of items) {
            await supabase.rpc("decrement_stock", {
              p_product_id: item.product_id,
              p_quantity: item.quantity,
            });
          }
        }
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const supabaseUrl = import.meta.env.VITE_PROJECT_URL_SUPABASE;

      if (action === "verified") {
        const { data: orderItems } = await supabase
          .from("order_items")
          .select("quantity, unit_price, products(name)")
          .eq("order_id", receipt.orders.id);

        await fetch(`${supabaseUrl}/functions/v1/send-email`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "payment_verified",
            payload: {
              clientName: receipt.users?.full_name ?? "Cliente",
              clientEmail: receipt.users?.email,
              orderId: receipt.orders.id,
              amount: receipt.amount,
              items:
                orderItems?.map((i) => ({
                  name:
                    (i.products as { name?: string } | null)?.name ??
                    "Producto",
                  quantity: i.quantity,
                  price: Number(i.unit_price),
                })) ?? [],
            },
          }),
        });
      } else {
        await fetch(`${supabaseUrl}/functions/v1/send-email`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "payment_rejected",
            payload: {
              clientName: receipt.users?.full_name ?? "Cliente",
              clientEmail: receipt.users?.email,
              orderId: receipt.orders.id,
              adminNotes: adminNotes.trim() || null,
            },
          }),
        });
      }

      setSelected(null);
      setAdminNotes("");
      await fetchReceipts();
    } catch (err) {
      console.error("Error al procesar comprobante:", err);
    } finally {
      setActionLoading(false);
    }
  }

  const pendingCount = receipts.filter((r) => r.status === "pending").length;
  const isUsdt = (receipt: Receipt) =>
    receipt.orders?.payment_type === "usdt" ||
    receipt.payment_methods?.type === "usdt";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-cream">Comprobantes de pago</h2>
          {pendingCount > 0 && (
            <p className="text-sm text-amber-400 mt-0.5">
              {pendingCount} comprobante{pendingCount > 1 ? "s" : ""} pendiente
              {pendingCount > 1 ? "s" : ""} de verificar
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {(["pending", "verified", "rejected", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-cocoa text-white"
                  : "bg-oscuro text-muted hover:text-cream border border-white/10"
              }`}
            >
              {f === "pending" && "Pendientes"}
              {f === "verified" && "Verificados"}
              {f === "rejected" && "Rechazados"}
              {f === "all" && "Todos"}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="grid gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-oscuro rounded-xl animate-pulse" />
          ))}
        </div>
      ) : receipts.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>
            No hay comprobantes{" "}
            {filter !== "all"
              ? filter === "pending"
                ? "pendientes"
                : filter === "verified"
                  ? "verificados"
                  : "rechazados"
              : ""}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          <AnimatePresence>
            {receipts.map((receipt) => (
              <motion.div
                key={receipt.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-oscuro rounded-xl p-4 border border-white/10 hover:border-white/20 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-cocoa/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-cocoa font-bold text-sm">
                        {receipt.users?.full_name?.charAt(0)?.toUpperCase() ??
                          "?"}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-cream truncate">
                          {receipt.users?.full_name ?? "Usuario"}
                        </p>
                        {isUsdt(receipt) && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-yellow-400/20 text-yellow-400 shrink-0">
                            USDT
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted truncate">
                        {receipt.users?.email}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {receipt.payment_methods?.bank_name}
                        </span>
                        <span className="text-xs text-muted flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          {isUsdt(receipt)
                            ? "Hash USDT"
                            : receipt.reference_number}
                        </span>
                        <span className="text-xs text-muted flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(receipt.payment_date).toLocaleDateString(
                            "es-VE",
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="font-bold text-cream">
                        {isUsdt(receipt)
                          ? `$${receipt.amount.toFixed(2)} USDT`
                          : `Bs. ${receipt.amount.toFixed(2)}`}
                      </p>
                      <StatusBadge status={receipt.status} />
                    </div>
                    <button
                      onClick={() => {
                        setSelected(receipt);
                        setAdminNotes("");
                      }}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 text-muted" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal de detalle */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-oscuro rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-5 border border-white/10"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-cream text-lg">
                    Verificar comprobante
                  </h3>
                  {isUsdt(selected) && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-yellow-400/20 text-yellow-400">
                      USDT
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-muted hover:text-cream transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Datos */}
              <div className="grid grid-cols-2 gap-3">
                <InfoCard
                  icon={<User className="w-4 h-4" />}
                  label="Cliente"
                  value={selected.users?.full_name}
                />
                <InfoCard
                  icon={<DollarSign className="w-4 h-4" />}
                  label="Monto"
                  value={
                    isUsdt(selected)
                      ? `$${selected.amount.toFixed(2)} USDT`
                      : `Bs. ${selected.amount.toFixed(2)}`
                  }
                />
                <InfoCard
                  icon={<Hash className="w-4 h-4" />}
                  label={
                    isUsdt(selected) ? "Hash de transacción" : "Referencia"
                  }
                  value={selected.reference_number}
                  mono
                />
                <InfoCard
                  icon={<Building2 className="w-4 h-4" />}
                  label={isUsdt(selected) ? "Red" : "Banco"}
                  value={selected.payment_methods?.bank_name}
                />
                <InfoCard
                  icon={<Calendar className="w-4 h-4" />}
                  label="Fecha pago"
                  value={new Date(selected.payment_date).toLocaleDateString(
                    "es-VE",
                  )}
                />
                <InfoCard
                  icon={<DollarSign className="w-4 h-4" />}
                  label="Total orden"
                  value={
                    isUsdt(selected)
                      ? `$${selected.orders?.total_amount?.toFixed(2)} USDT`
                      : `Bs. ${selected.orders?.total_amount?.toFixed(2)}`
                  }
                />
              </div>

              {/* Link a TronScan si es USDT */}
              {isUsdt(selected) && selected.reference_number && (
                <a
                  href={`https://tronscan.org/#/transaction/${selected.reference_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-yellow-400 hover:underline"
                >
                  <ExternalLink className="size-4" />
                  Verificar hash en TronScan
                </a>
              )}

              {/* Imagen del comprobante */}
              {selected.receipt_url ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted">Comprobante adjunto:</p>
                  <a
                    href={selected.receipt_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="relative group">
                      <img
                        src={selected.receipt_url}
                        alt="Comprobante"
                        className="w-full rounded-xl border border-white/10 max-h-64 object-contain"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                        <ZoomIn className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </a>
                </div>
              ) : (
                <div className="bg-white/5 rounded-xl p-4 text-center text-muted text-sm">
                  {isUsdt(selected)
                    ? "Sin captura adjunta — verificar hash en TronScan"
                    : "Sin imagen adjunta — solo número de referencia"}
                </div>
              )}

              {/* Notas del admin */}
              {selected.status === "pending" && (
                <div className="space-y-1.5">
                  <label className="text-sm text-muted">
                    Nota para el cliente (opcional):
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Ej: Pago verificado correctamente / Hash no encontrado..."
                    rows={2}
                    className="w-full bg-oscuro border border-white/10 rounded-xl px-4 py-3 text-cream placeholder:text-muted focus:outline-none focus:border-cocoa transition-colors resize-none text-sm"
                  />
                </div>
              )}

              {/* Acciones */}
              {selected.status === "pending" ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleVerify(selected, "rejected")}
                    disabled={actionLoading}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl font-medium transition-colors disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    Rechazar
                  </button>
                  <button
                    onClick={() => handleVerify(selected, "verified")}
                    disabled={actionLoading}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl font-medium transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? (
                      <span className="animate-spin w-4 h-4 border-2 border-green-400/30 border-t-green-400 rounded-full" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    Verificar
                  </button>
                </div>
              ) : (
                <div
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${selected.status === "verified" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}
                >
                  {selected.status === "verified" ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Pago verificado
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" /> Pago rechazado
                    </>
                  )}
                  {selected.admin_notes && (
                    <span className="text-muted ml-2">
                      — {selected.admin_notes}
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="bg-oscuro rounded-xl p-3 border border-white/10">
      <div className="flex items-center gap-1.5 text-muted text-xs mb-1">
        {icon}
        {label}
      </div>
      <p
        className={`text-cream text-sm font-medium truncate ${mono ? "font-mono" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   CheckCircle2,
//   XCircle,
//   Eye,
//   ZoomIn,
//   User,
//   Hash,
//   Calendar,
//   DollarSign,
//   Building2,
// } from "lucide-react";
// import { supabase } from "@/supabase/client.ts";
// import { StatusBadge } from "@/components/dashboard/shared/StatusBadge.tsx";

// interface Receipt {
//   id: string;
//   reference_number: string;
//   amount: number;
//   payment_date: string;
//   receipt_url: string | null;
//   status: "pending" | "verified" | "rejected";
//   admin_notes: string | null;
//   created_at: string;
//   orders: {
//     id: string;
//     total_amount: number;
//     payment_type: string;
//   };
//   users: {
//     full_name: string;
//     email: string;
//   };
//   payment_methods: {
//     bank_name: string;
//     type: string;
//   };
// }

// export function ReceiptVerificationPanel() {
//   const [receipts, setReceipts] = useState<Receipt[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState<
//     "pending" | "verified" | "rejected" | "all"
//   >("pending");
//   const [selected, setSelected] = useState<Receipt | null>(null);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [adminNotes, setAdminNotes] = useState("");

//   useEffect(() => {
//     fetchReceipts();

//     // Realtime — actualizar cuando llegue un comprobante nuevo
//     const channel = supabase
//       .channel("receipts-changes")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "payment_receipts" },
//         () => fetchReceipts(),
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [filter]);

//   async function fetchReceipts() {
//     setLoading(true);
//     let query = supabase
//       .from("payment_receipts")
//       .select(
//         `
//         *,
//         orders ( id, total_amount, payment_type ),
//         users ( full_name, email ),
//         payment_methods ( bank_name, type )
//       `,
//       )
//       .order("created_at", { ascending: false });

//     if (filter !== "all") query = query.eq("status", filter);

//     const { data } = await query;
//     setReceipts((data as Receipt[]) ?? []);
//     setLoading(false);
//   }

//   async function handleVerify(
//     receipt: Receipt,
//     action: "verified" | "rejected",
//   ) {
//     setActionLoading(true);
//     try {
//       // ── 1. Actualizar el comprobante ──────────────────────────────
//       const { error: receiptError } = await supabase
//         .from("payment_receipts")
//         .update({
//           status: action,
//           admin_notes: adminNotes.trim() || null,
//         })
//         .eq("id", receipt.id);

//       if (receiptError) throw receiptError;

//       // ── 2. Actualizar el estado de la orden ───────────────────────
//       const newOrderStatus = action === "verified" ? "paid" : "cancelled";
//       const updateData: Record<string, unknown> = { status: newOrderStatus };
//       if (action === "verified") updateData.paid_at = new Date().toISOString();

//       const { error: orderError } = await supabase
//         .from("orders")
//         .update(updateData)
//         .eq("id", receipt.orders.id);

//       if (orderError) throw orderError;

//       // ── 3. Descontar stock si fue verificado ──────────────────────
//       if (action === "verified") {
//         const { data: items } = await supabase
//           .from("order_items")
//           .select("product_id, quantity")
//           .eq("order_id", receipt.orders.id);

//         if (items) {
//           for (const item of items) {
//             await supabase.rpc("decrement_stock", {
//               p_product_id: item.product_id,
//               p_quantity: item.quantity,
//             });
//           }
//         }
//       }

//       // ── 4. Enviar email al cliente ────────────────────────────────
//       const { data: sessionData } = await supabase.auth.getSession();
//       const token = sessionData.session?.access_token;
//       const supabaseUrl = import.meta.env.VITE_PROJECT_URL_SUPABASE;

//       if (action === "verified") {
//         // Obtener items para el email
//         const { data: orderItems } = await supabase
//           .from("order_items")
//           .select("quantity, unit_price, products(name)")
//           .eq("order_id", receipt.orders.id);

//         await fetch(`${supabaseUrl}/functions/v1/send-email`, {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             type: "payment_verified",
//             payload: {
//               clientName: receipt.users?.full_name ?? "Cliente",
//               clientEmail: receipt.users?.email,
//               orderId: receipt.orders.id,
//               amount: receipt.amount,
//               items:
//                 orderItems?.map((i) => ({
//                   name:
//                     (i.products as { name?: string } | null)?.name ??
//                     "Producto",
//                   quantity: i.quantity,
//                   price: Number(i.unit_price),
//                 })) ?? [],
//             },
//           }),
//         });
//       } else {
//         await fetch(`${supabaseUrl}/functions/v1/send-email`, {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             type: "payment_rejected",
//             payload: {
//               clientName: receipt.users?.full_name ?? "Cliente",
//               clientEmail: receipt.users?.email,
//               orderId: receipt.orders.id,
//               adminNotes: adminNotes.trim() || null,
//             },
//           }),
//         });
//       }

//       setSelected(null);
//       setAdminNotes("");
//       await fetchReceipts();
//     } catch (err) {
//       console.error("Error al procesar comprobante:", err);
//     } finally {
//       setActionLoading(false);
//     }
//   }

//   // async function handleVerify(
//   //   receipt: Receipt,
//   //   action: "verified" | "rejected",
//   // ) {
//   //   setActionLoading(true);
//   //   try {
//   //     // 1. Actualizar el comprobante
//   //     const { error: receiptError } = await supabase
//   //       .from("payment_receipts")
//   //       .update({
//   //         status: action,
//   //         admin_notes: adminNotes.trim() || null,
//   //       })
//   //       .eq("id", receipt.id);

//   //     if (receiptError) throw receiptError;

//   //     // 2. Actualizar el estado de la orden
//   //     const newOrderStatus = action === "verified" ? "paid" : "cancelled";
//   //     const updateData: Record<string, unknown> = { status: newOrderStatus };
//   //     if (action === "verified") updateData.paid_at = new Date().toISOString();

//   //     const { error: orderError } = await supabase
//   //       .from("orders")
//   //       .update(updateData)
//   //       .eq("id", receipt.orders.id);

//   //     if (orderError) throw orderError;

//   //     // 3. Si fue verificado → descontar stock
//   //     if (action === "verified") {
//   //       const { data: items } = await supabase
//   //         .from("order_items")
//   //         .select("product_id, quantity")
//   //         .eq("order_id", receipt.orders.id);

//   //       if (items) {
//   //         for (const item of items) {
//   //           await supabase.rpc("decrement_stock", {
//   //             p_product_id: item.product_id,
//   //             p_quantity: item.quantity,
//   //           });
//   //         }
//   //       }
//   //     }

//   //     setSelected(null);
//   //     setAdminNotes("");
//   //     await fetchReceipts();
//   //   } catch (err) {
//   //     console.error("Error al procesar comprobante:", err);
//   //   } finally {
//   //     setActionLoading(false);
//   //   }
//   // }

//   const pendingCount = receipts.filter((r) => r.status === "pending").length;

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-xl font-bold text-cream">Comprobantes de pago</h2>
//           {pendingCount > 0 && (
//             <p className="text-sm text-amber-400 mt-0.5">
//               {pendingCount} comprobante{pendingCount > 1 ? "s" : ""} pendiente
//               {pendingCount > 1 ? "s" : ""} de verificar
//             </p>
//           )}
//         </div>

//         {/* Filtros */}
//         <div className="flex gap-2">
//           {(["pending", "verified", "rejected", "all"] as const).map((f) => (
//             <button
//               key={f}
//               onClick={() => setFilter(f)}
//               className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
//                 filter === f
//                   ? "bg-cocoa text-white"
//                   : "bg-oscuro text-muted hover:text-cream border border-white/10"
//               }`}
//             >
//               {f === "pending" && "Pendientes"}
//               {f === "verified" && "Verificados"}
//               {f === "rejected" && "Rechazados"}
//               {f === "all" && "Todos"}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Lista */}
//       {loading ? (
//         <div className="grid gap-3">
//           {[...Array(3)].map((_, i) => (
//             <div key={i} className="h-24 bg-oscuro rounded-xl animate-pulse" />
//           ))}
//         </div>
//       ) : receipts.length === 0 ? (
//         <div className="text-center py-16 text-muted">
//           <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
//           <p>
//             No hay comprobantes{" "}
//             {filter !== "all"
//               ? `${filter === "pending" ? "pendientes" : filter === "verified" ? "verificados" : "rechazados"}`
//               : ""}
//           </p>
//         </div>
//       ) : (
//         <div className="grid gap-3">
//           <AnimatePresence>
//             {receipts.map((receipt) => (
//               <motion.div
//                 key={receipt.id}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 className="bg-oscuro rounded-xl p-4 border border-white/10 hover:border-white/20 transition-colors"
//               >
//                 <div className="flex items-center justify-between gap-4">
//                   <div className="flex items-center gap-4 min-w-0">
//                     {/* Avatar inicial */}
//                     <div className="w-10 h-10 rounded-full bg-cocoa/20 flex items-center justify-center flex-shrink-0">
//                       <span className="text-cocoa font-bold text-sm">
//                         {receipt.users?.full_name?.charAt(0)?.toUpperCase() ??
//                           "?"}
//                       </span>
//                     </div>

//                     <div className="min-w-0">
//                       <p className="font-medium text-cream truncate">
//                         {receipt.users?.full_name ?? "Usuario"}
//                       </p>
//                       <p className="text-xs text-muted truncate">
//                         {receipt.users?.email}
//                       </p>
//                       <div className="flex items-center gap-3 mt-1">
//                         <span className="text-xs text-muted flex items-center gap-1">
//                           <Building2 className="w-3 h-3" />
//                           {receipt.payment_methods?.bank_name}
//                         </span>
//                         <span className="text-xs text-muted flex items-center gap-1">
//                           <Hash className="w-3 h-3" />
//                           {receipt.reference_number}
//                         </span>
//                         <span className="text-xs text-muted flex items-center gap-1">
//                           <Calendar className="w-3 h-3" />
//                           {new Date(receipt.payment_date).toLocaleDateString(
//                             "es-VE",
//                           )}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3 flex-shrink-0">
//                     <div className="text-right">
//                       <p className="font-bold text-cream">
//                         Bs. {receipt.amount.toFixed(2)}
//                       </p>
//                       <StatusBadge status={receipt.status} />
//                     </div>

//                     <button
//                       onClick={() => {
//                         setSelected(receipt);
//                         setAdminNotes("");
//                       }}
//                       className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
//                     >
//                       <Eye className="w-4 h-4 text-muted" />
//                     </button>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </AnimatePresence>
//         </div>
//       )}

//       {/* Modal de detalle */}
//       <AnimatePresence>
//         {selected && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
//             onClick={(e) => e.target === e.currentTarget && setSelected(null)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.95, opacity: 0 }}
//               className="bg-fondo rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-5 border border-white/10"
//             >
//               <div className="flex items-center justify-between">
//                 <h3 className="font-bold text-cream text-lg">
//                   Verificar comprobante
//                 </h3>
//                 <button
//                   onClick={() => setSelected(null)}
//                   className="text-muted hover:text-cream transition-colors"
//                 >
//                   ✕
//                 </button>
//               </div>

//               {/* Datos del comprobante */}
//               <div className="grid grid-cols-2 gap-3">
//                 <InfoCard
//                   icon={<User className="w-4 h-4" />}
//                   label="Cliente"
//                   value={selected.users?.full_name}
//                 />
//                 <InfoCard
//                   icon={<DollarSign className="w-4 h-4" />}
//                   label="Monto"
//                   value={`Bs. ${selected.amount.toFixed(2)}`}
//                 />
//                 <InfoCard
//                   icon={<Hash className="w-4 h-4" />}
//                   label="Referencia"
//                   value={selected.reference_number}
//                   mono
//                 />
//                 <InfoCard
//                   icon={<Building2 className="w-4 h-4" />}
//                   label="Banco"
//                   value={selected.payment_methods?.bank_name}
//                 />
//                 <InfoCard
//                   icon={<Calendar className="w-4 h-4" />}
//                   label="Fecha pago"
//                   value={new Date(selected.payment_date).toLocaleDateString(
//                     "es-VE",
//                   )}
//                 />
//                 <InfoCard
//                   icon={<DollarSign className="w-4 h-4" />}
//                   label="Total orden"
//                   value={`Bs. ${selected.orders?.total_amount?.toFixed(2)}`}
//                 />
//               </div>

//               {/* Imagen del comprobante */}
//               {selected.receipt_url ? (
//                 <div className="space-y-2">
//                   <p className="text-sm text-muted">Comprobante adjunto:</p>
//                   <a
//                     href={selected.receipt_url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     <div className="relative group">
//                       <img
//                         src={selected.receipt_url}
//                         alt="Comprobante"
//                         className="w-full rounded-xl border border-white/10 max-h-64 object-contain"
//                       />
//                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
//                         <ZoomIn className="w-8 h-8 text-white" />
//                       </div>
//                     </div>
//                   </a>
//                 </div>
//               ) : (
//                 <div className="bg-white/5 rounded-xl p-4 text-center text-muted text-sm">
//                   Sin imagen adjunta — solo número de referencia
//                 </div>
//               )}

//               {/* Notas del admin */}
//               {selected.status === "pending" && (
//                 <div className="space-y-1.5">
//                   <label className="text-sm text-muted">
//                     Nota para el cliente (opcional):
//                   </label>
//                   <textarea
//                     value={adminNotes}
//                     onChange={(e) => setAdminNotes(e.target.value)}
//                     placeholder="Ej: Pago verificado correctamente / Monto no coincide..."
//                     rows={2}
//                     className="w-full bg-oscuro border border-white/10 rounded-xl px-4 py-3 text-cream placeholder:text-muted focus:outline-none focus:border-cocoa transition-colors resize-none text-sm"
//                   />
//                 </div>
//               )}

//               {/* Acciones */}
//               {selected.status === "pending" ? (
//                 <div className="grid grid-cols-2 gap-3">
//                   <button
//                     onClick={() => handleVerify(selected, "rejected")}
//                     disabled={actionLoading}
//                     className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl font-medium transition-colors disabled:opacity-50"
//                   >
//                     <XCircle className="w-4 h-4" />
//                     Rechazar
//                   </button>
//                   <button
//                     onClick={() => handleVerify(selected, "verified")}
//                     disabled={actionLoading}
//                     className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl font-medium transition-colors disabled:opacity-50"
//                   >
//                     {actionLoading ? (
//                       <span className="animate-spin w-4 h-4 border-2 border-green-400/30 border-t-green-400 rounded-full" />
//                     ) : (
//                       <CheckCircle2 className="w-4 h-4" />
//                     )}
//                     Verificar
//                   </button>
//                 </div>
//               ) : (
//                 <div
//                   className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
//                     selected.status === "verified"
//                       ? "bg-green-500/10 text-green-400"
//                       : "bg-red-500/10 text-red-400"
//                   }`}
//                 >
//                   {selected.status === "verified" ? (
//                     <>
//                       <CheckCircle2 className="w-4 h-4" /> Pago verificado
//                     </>
//                   ) : (
//                     <>
//                       <XCircle className="w-4 h-4" /> Pago rechazado
//                     </>
//                   )}
//                   {selected.admin_notes && (
//                     <span className="text-muted ml-2">
//                       — {selected.admin_notes}
//                     </span>
//                   )}
//                 </div>
//               )}
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// function InfoCard({
//   icon,
//   label,
//   value,
//   mono = false,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   value: string;
//   mono?: boolean;
// }) {
//   return (
//     <div className="bg-oscuro rounded-xl p-3 border border-white/10">
//       <div className="flex items-center gap-1.5 text-muted text-xs mb-1">
//         {icon}
//         {label}
//       </div>
//       <p
//         className={`text-cream text-sm font-medium truncate ${mono ? "font-mono" : ""}`}
//       >
//         {value}
//       </p>
//     </div>
//   );
// }
