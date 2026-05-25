// src/lib/exportOrders.ts
// Exporta los pedidos del dashboard a Excel (.xlsx)

import * as XLSX from "xlsx";
import { formatPrice } from "@/helpers";

interface OrderRow {
  id: string;
  total_amount: number;
  status: string;
  payment_type: string;
  created_at: string;
  users: { full_name: string | null; email: string | null } | null;
  promo_codes: { code: string } | null;
  delivery_options: { name: string } | null;
}

const STATUS_LABELS: Record<string, string> = {
  Pending: "Pendiente",
  pending: "Pendiente",
  confirmed: "Confirmado",
  Paid: "Pagado",
  paid: "Pagado",
  preparing: "Preparando",
  Shipped: "Enviado",
  shipped: "Enviado",
  Delivered: "Entregado",
  delivered: "Entregado",
  cancelled: "Cancelado",
  Cancelled: "Cancelado",
};

const PAYMENT_LABELS: Record<string, string> = {
  pago_movil: "Pago móvil",
  transferencia: "Transferencia",
  usdt: "USDT",
};

export const exportOrdersToExcel = (
  orders: OrderRow[],
  filters?: { fromDate?: string; toDate?: string; name?: string },
) => {
  // ── Construir filas ──────────────────────────────────────────────────────
  const rows = orders.map((order, index) => ({
    "#": index + 1,
    "ID Pedido": order.id.slice(0, 8).toUpperCase(),
    Cliente: order.users?.full_name ?? "—",
    Email: order.users?.email ?? "—",
    Estado: STATUS_LABELS[order.status] ?? order.status,
    "Método de pago": PAYMENT_LABELS[order.payment_type] ?? order.payment_type,
    Envío: order.delivery_options?.name ?? "—",
    Promo: order.promo_codes?.code ?? "—",
    Total: formatPrice(order.total_amount),
    "Monto (número)": order.total_amount,
    Fecha: new Date(order.created_at).toLocaleDateString("es-VE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    Hora: new Date(order.created_at).toLocaleTimeString("es-VE", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  // ── Crear workbook ───────────────────────────────────────────────────────
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);

  // Ancho de columnas
  ws["!cols"] = [
    { wch: 5 }, // #
    { wch: 12 }, // ID
    { wch: 28 }, // Cliente
    { wch: 30 }, // Email
    { wch: 14 }, // Estado
    { wch: 16 }, // Método de pago
    { wch: 18 }, // Envío
    { wch: 12 }, // Promo
    { wch: 12 }, // Total
    { wch: 14 }, // Monto número
    { wch: 12 }, // Fecha
    { wch: 8 }, // Hora
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Pedidos");

  // ── Nombre del archivo con fecha ─────────────────────────────────────────
  const today = new Date()
    .toLocaleDateString("es-VE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");

  const filterSuffix =
    filters?.fromDate && filters?.toDate
      ? `_${filters.fromDate}_a_${filters.toDate}`
      : "";

  XLSX.writeFile(wb, `pedidos_yomis_${today}${filterSuffix}.xlsx`);
};
