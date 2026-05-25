// src/hooks/useDashboardNotifications.ts

import { useState, useEffect } from "react";
import { supabase } from "@/supabase/client";

interface DashboardNotifications {
  pendingOrders: number; // pedidos con status Pending
  pendingReceipts: number; // comprobantes sin verificar
  total: number;
}

export const useDashboardNotifications = (): DashboardNotifications => {
  const [pendingOrders, setPendingOrders] = useState(0);
  const [pendingReceipts, setPendingReceipts] = useState(0);

  const fetchCounts = async () => {
    const [ordersRes, receiptsRes] = await Promise.all([
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .or("status.eq.Pending,status.eq.pending"),
      supabase
        .from("payment_receipts")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
    ]);

    setPendingOrders(ordersRes.count ?? 0);
    setPendingReceipts(receiptsRes.count ?? 0);
  };

  // Re-fetch con delay para dar tiempo a Supabase a procesar el cambio
  const fetchCountsDelayed = () => {
    setTimeout(fetchCounts, 300);
  };

  useEffect(() => {
    fetchCounts();

    const channel = supabase
      .channel("dashboard-notifications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        fetchCountsDelayed,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "payment_receipts" },
        fetchCountsDelayed,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    pendingOrders,
    pendingReceipts,
    total: pendingOrders + pendingReceipts,
  };
};
