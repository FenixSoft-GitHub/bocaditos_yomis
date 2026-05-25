// src/components/dashboard/orders/TableOrders.tsx
// Cambio: agregar botón exportar a Excel en el header

import { Loader } from "@/components/shared/Loader";
import { useAllOrders, useChangeStatusOrder } from "@/hooks";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { formatDateLong, formatPrice } from "@/helpers";
import { AdvancedFilter } from "@/components/shared/AdvancedFilter";
import { Pagination } from "@/components/shared/Pagination";
import { DashboardSection } from "@/components/dashboard/shared/DashboardSection";
import { DashboardCard } from "@/components/dashboard/shared/DashboardCard";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import { exportOrdersToExcel } from "@/lib/exportOrders";
import {
  ShoppingBag,
  User,
  Calendar,
  DollarSign,
  ChevronRight,
  Download,
} from "lucide-react";

const ITEMS_PER_PAGE = 9;

const statusOptions = [
  { value: "Pending", label: "Pendiente" },
  { value: "Paid", label: "Pagado" },
  { value: "preparing", label: "Preparando" },
  { value: "Shipped", label: "Enviado" },
  { value: "Delivered", label: "Entregado" },
  { value: "cancelled", label: "Cancelado" },
];

export const TableOrders = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    name: "",
    fromDate: "",
    toDate: "",
  });
  const [page, setPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  const { mutate } = useChangeStatusOrder();
  const { data: orders, isLoading } = useAllOrders();

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter((order) => {
      const nameMatch = order.users?.full_name
        ?.toLowerCase()
        .includes(filters.name.toLowerCase());
      const orderDate = new Date(order.created_at);
      const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
      const toDate = filters.toDate ? new Date(filters.toDate) : null;
      return (
        nameMatch &&
        (!fromDate || orderDate >= fromDate) &&
        (!toDate || orderDate <= toDate)
      );
    });
  }, [orders, filters]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrders, page]);

  const handleExport = () => {
    if (!filteredOrders.length) return;
    setIsExporting(true);
    try {
      exportOrdersToExcel(filteredOrders, {
        fromDate: filters.fromDate || undefined,
        toDate: filters.toDate || undefined,
      });
    } finally {
      setTimeout(() => setIsExporting(false), 1000);
    }
  };

  if (isLoading || !orders) return <Loader size={60} />;

  return (
    <DashboardSection
      title="Órdenes"
      description="Gestiona y actualiza el estado de los pedidos"
      count={filteredOrders.length}
      filters={
        <div className="flex items-center gap-2 w-full">
          <div className="flex-1">
            <AdvancedFilter
              searchValue={filters.name}
              onSearchChange={(value) =>
                handleFilterChange({ ...filters, name: value })
              }
              dateRange={{ from: filters.fromDate, to: filters.toDate }}
              onDateChange={(range) =>
                handleFilterChange({
                  ...filters,
                  fromDate: range.from,
                  toDate: range.to,
                })
              }
              onClear={() =>
                handleFilterChange({ name: "", fromDate: "", toDate: "" })
              }
            />
          </div>

          <div className="flex flex-col gap-2 items-end ml-2">
            <span className="text-sm font-medium text-choco dark:text-cream invisible md:block">
              &nbsp;
            </span>
            {/* Botón exportar */}
            <button
              onClick={handleExport}
              disabled={isExporting || filteredOrders.length === 0}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-cocoa/30 dark:border-cream/30 bg-transparent text-choco/70 dark:text-cream/70 hover:bg-cocoa/5 dark:hover:bg-cream/5 hover:text-choco dark:hover:text-cream transition-colors text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              title={`Exportar ${filteredOrders.length} pedidos a Excel`}
            >
              <Download className="size-4 text-green-500" />
              <span className="hidden sm:inline">
                {isExporting ? "Exportando..." : "Excel"}
              </span>
            </button>
          </div>
        </div>
      }
      isEmpty={filteredOrders.length === 0}
      empty={
        <>
          <ShoppingBag className="size-12" />
          <p className="text-sm font-medium">No se encontraron órdenes</p>
        </>
      }
    >
      {paginatedOrders.map((order, index) => (
        <DashboardCard
          key={order.id}
          className="gap-3 m-1.5"
          onClick={() =>
            navigate(`/dashboard/orders/${order.id}`, {
              state: { orderIndex: (page - 1) * ITEMS_PER_PAGE + index + 1 },
            })
          }
        >
          {/* Cliente */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-cocoa/20 dark:bg-cream/20 flex items-center justify-center shrink-0 text-sm font-bold text-choco dark:text-cream">
                <User className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-choco dark:text-cream truncate">
                  {order.users?.full_name}
                </p>
                <p className="text-xs text-choco/50 dark:text-cream/50 truncate">
                  {order.users?.email}
                </p>
              </div>
            </div>
            <ChevronRight className="size-4 text-choco/30 dark:text-cream/30 shrink-0 mt-1" />
          </div>

          {/* Estado + Total */}
          <div className="flex items-center justify-between pt-2 border-t border-cocoa/10 dark:border-cream/10">
            <select
              value={order.status}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => mutate({ id: order.id, status: e.target.value })}
              className="text-xs border border-cocoa/20 dark:border-cream/20 rounded-lg px-2 py-1.5 bg-fondo dark:bg-fondo-dark text-choco dark:text-cream focus:outline-none focus:ring-2 focus:ring-choco/20 cursor-pointer"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-1 font-bold text-sm text-choco dark:text-cream">
              <DollarSign className="size-3.5" />
              {formatPrice(order.total_amount).replace("$", "")}
            </div>
          </div>

          {/* StatusBadge + Fecha */}
          <div className="flex items-center justify-between">
            <StatusBadge status={order.status} />
            <div className="flex items-center gap-1 text-[11px] text-choco/40 dark:text-cream/40">
              <Calendar className="size-3" />
              {formatDateLong(order.created_at)}
            </div>
          </div>
        </DashboardCard>
      ))}

      {/* Paginación */}
      {filteredOrders.length > ITEMS_PER_PAGE && (
        <div className="sm:col-span-2 xl:col-span-3 pt-2 border-t border-cocoa/20 dark:border-cream/10">
          <Pagination
            page={page}
            setPage={setPage}
            totalItems={filteredOrders.length}
          />
        </div>
      )}
    </DashboardSection>
  );
};