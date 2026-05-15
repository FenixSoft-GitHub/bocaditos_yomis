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
import {
  ShoppingBag,
  User,
  Calendar,
  DollarSign,
  ChevronRight,
} from "lucide-react";

const ITEMS_PER_PAGE = 9;

const statusOptions = [
  { value: "Pending", label: "Pendiente" },
  { value: "Paid", label: "Pagado" },
  { value: "Shipped", label: "Enviado" },
  { value: "Delivered", label: "Entregado" },
];

export const TableOrders = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    name: "",
    fromDate: "",
    toDate: "",
  });
  const [page, setPage] = useState(1);

  const { mutate } = useChangeStatusOrder();
  const { data: orders, isLoading } = useAllOrders();

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter((order) => {
      const nameMatch = order.users.full_name
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

  // Reset page when filters change
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrders, page]);

  if (isLoading || !orders) return <Loader size={60} />;

  return (
    <DashboardSection
      title="Órdenes"
      description="Gestiona y actualiza el estado de los pedidos"
      count={filteredOrders.length}
      filters={
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
          className={"gap-3 m-1.5"}
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
                  {order.users.full_name}
                </p>
                <p className="text-xs text-choco/50 dark:text-cream/50 truncate">
                  {order.users.email}
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

          {/* Status Badge + Fecha */}
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
