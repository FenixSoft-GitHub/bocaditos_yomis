import { useNavigate } from "react-router-dom";
import { formatDateLong, formatPrice, getStatus } from "@/helpers";
import { OrderItemSingle } from "@/interfaces";

interface Props {
  orders: OrderItemSingle[];
}

const tableHeaders = ["ID", "Fecha", "Estado", "Total"];

export const TableOrders = ({ orders }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="w-full rounded-xl border border-cocoa dark:border-cream/70 shadow-sm">
      <table className="min-w-full text-sm text-left text-gray-900 dark:text-gray-100">
        <thead className="bg-cocoa/50 dark:bg-cream/30 text-xs uppercase text-choco dark:text-cream tracking-wide border-b border-cocoa dark:border-cream/70">
          <tr>
            {tableHeaders.map((header, index) => (
              <th key={index} className="px-6 py-4">
                {header}
              </th>
            ))}
          </tr>
        </thead>
      </table>

      {/* Scrollable tbody */}
      <div className="max-h-[calc(100vh-350px)] overflow-y-auto">
        <table className="min-w-full text-sm text-left text-gray-900 dark:text-gray-100">
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-6 text-center text-gray-400 dark:text-gray-100"
                >
                  No hay pedidos registrados.
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr
                  key={order.id}
                  className="hover:bg-cocoa/20 dark:hover:bg-cream/20 text-choco dark:text-cream transition-colors cursor-pointer"
                  onClick={() =>
                    navigate(`/account/pedidos/${order.id}`, {
                      state: { orderIndex: index + 1 },
                    })
                  }
                >
                  <td className="px-6 py-4 font-medium">{index + 1}</td>
                  <td className="px-6 py-4">
                    {formatDateLong(order.created_at)}
                  </td>
                  <td className="px-6 py-4">{getStatus(order.status)}</td>
                  <td className="px-6 py-4">
                    {formatPrice(order.total_amount)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};