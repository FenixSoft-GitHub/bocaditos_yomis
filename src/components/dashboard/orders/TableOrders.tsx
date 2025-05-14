import { Loader } from "@/components/shared/Loader";
import { useAllOrders, useChangeStatusOrder } from "@/hooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CellTableProduct } from "../products/CellTableProduct";
import { formatDateLong, formatPrice } from "@/helpers";
import { GoMail } from "react-icons/go";
import { AdvancedFilter } from "@/components/shared/AdvancedFilter";

const headers = ["Cliente", "Fecha", "Estado", "Total"];

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

  const { mutate } = useChangeStatusOrder();

  const handleStatusChange = (id: string, status: string) => {
    mutate({ id, status });
  };

  const { data: orders, isLoading } = useAllOrders();

  if (isLoading || !orders) return <Loader size={60} />;

  const filteredOrders = orders.filter((order) => {
    const fullNameMatch = order.users.full_name
      ?.toLowerCase()
      .includes(filters.name.toLowerCase());

    const orderDate = new Date(order.created_at);
    const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
    const toDate = filters.toDate ? new Date(filters.toDate) : null;

    const dateInRange =
      (!fromDate || orderDate >= fromDate) &&
      (!toDate || orderDate <= toDate);

    return fullNameMatch && dateInRange;
  });

  return (
    <div className="flex flex-col h-full min-h-[500px] bg-fondo dark:bg-fondo-dark text-choco dark:text-cream border border-cocoa/30 dark:border-cream/30 rounded-lg px-3 py-2 gap-3">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]">
            Ordenes
          </h1>
          <p className="text-xs mb-1 font-regular">Administración de Ordenes</p>
        </div>

        <div className="w-full sm:max-w-sm relative">
          <AdvancedFilter
            searchValue={filters.name}
            onSearchChange={(value) => setFilters((prev) => ({ ...prev, name: value }))}
            dateRange={{ from: filters.fromDate, to: filters.toDate }}
            onDateChange={(range) => setFilters((prev) => ({
              ...prev,
              fromDate: range.from,
              toDate: range.to
            }))}
            onClear={() => setFilters({ name: "", fromDate: "", toDate: "" })}
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="relative w-full h-full overflow-x-auto">
        <table className="min-w-[600px] text-sm w-full caption-bottom sm:table-auto">
          <thead className="bg-cocoa/20 dark:bg-cream/10 text-choco dark:text-cream text-xs uppercase tracking-wide">
            <tr className="bg-cocoa/30 dark:bg-cream/30 text-choco dark:text-cream rounded-md">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className={`px-2 sm:px-4 py-2 font-semibold text-center ${index === 0 ? "rounded-l-md" : ""
                    } ${index === headers.length - 1 ? "rounded-r-md" : ""}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          {filteredOrders.length === 0 ? (
            <tbody>
              <tr>
                <td
                  colSpan={headers.length}
                  className="text-center py-10 text-choco dark:text-cream"
                >
                  No se encontraron ordenes con ese término.
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {filteredOrders.map((order, index) => {
                return (
                  <tr
                    key={index}
                    onClick={() =>
                      navigate(`/dashboard/orders/${order.id}`, {
                        state: { orderIndex: index + 1 },
                      })
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      navigate(`/dashboard/order/${order.id}`)
                    }
                    role="button"
                    tabIndex={0}
                    aria-label={`Ver detalles del pedido de ${order.users?.full_name}`}
                    className="hover:bg-cocoa/20 dark:hover:bg-cream/20 transition-colors cursor-pointer border-b border-cocoa/30 dark:border-cream/30"
                  >
                    <td className="px-4 py-2 text-left">
                      <div className="flex flex-col">
                        <span className="font-medium">{order.users.full_name}</span>
                        <span className="flex items-center text-xs mt-1 gap-1 text-choco dark:text-cream/70">
                          <GoMail className="size-4" />
                          {order.users.email}
                        </span>
                      </div>
                    </td>

                    <CellTableProduct
                      content={formatDateLong(order.created_at)}
                      className="text-left"
                    />

                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className="w-full bg-cream dark:bg-fondo-dark text-sm border border-cocoa/30 dark:border-cream/30 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-cream"
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    <CellTableProduct
                      className="text-center"
                      content={formatPrice(order.total_amount)}
                    />
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};