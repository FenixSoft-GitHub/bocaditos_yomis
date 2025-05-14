import { IoChevronBack } from "react-icons/io5";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useOrderAdmin } from "@/hooks";
import { Loader } from "@/components/shared/Loader";
import { formatDateLong, formatPrice } from "@/helpers";

const tableHeaders = [
  { label: "Producto", position: "left" },
  { label: "Precio", position: "center" },
  { label: "Cantidad", position: "center" },
  { label: "Total", position: "right" },
];

const DashboardOrderPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrderAdmin(String(id));
  
  //Recibir el número de id
  const location = useLocation();
  const orderIndex = location.state?.orderIndex;

  if (isLoading || !order) return <Loader size={60} />;

  return (
    <section className="flex flex-col gap-4 dark:bg-fondo-dark dark:text-cream bg-fondo text-choco">
      {/* Encabezado */}
      <header className="flex justify-between items-center">
        <button
          className="flex items-center gap-2 text-sm border border-cocoa dark:border-cream/30 rounded-full bg-cream dark:bg-cocoa/20 shadow-gray-400 shadow-md hover:bg-cocoa/20 hover:font-semibold dark:hover:bg-cocoa/20 px-6 py-1 w-fit mt-10"
          onClick={() => navigate(-1)}
        >
          <IoChevronBack size={16} />
          Volver
        </button>

        <div className="text-center flex flex-col gap-1">
          <h1 className="text-3xl font-bold">Pedido # {orderIndex ?? id}</h1>
          <p className="text-sm">{formatDateLong(order.created_at)}</p>
        </div>

        <div className="w-6" />
      </header>

      {/* Tabla de productos */}
      <div className="overflow-x-auto border border-cocoa dark:border-cream/40 rounded-lg shadow-sm">
        <table className="w-full text-xs uppercase tracking-wide">
          <thead className="w-full bg-cocoa/50 dark:bg-cream/30 text-xs uppercase text-choco dark:text-cream tracking-wide border-b border-cocoa dark:border-cream/40">
            <tr>
              {tableHeaders.map((header, idx) => (
                <th
                  key={idx}
                  className={`px-4 py-3 ${
                    header.position === "center"
                      ? "text-center"
                      : header.position === "right"
                      ? "text-right"
                      : "text-left"
                  }`}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {order.orderItems.map((item, idx) => (
              <tr
                key={idx}
                className="border-b border-cocoa/70 dark:border-cream/30 "
              >
                <td className="py-2 px-3 font-medium tracking-tighter flex gap-3 items-center">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="size-16 object-cover rounded-lg border border-cocoa/70 dark:border-cream/30"
                  />
                  <div className="space-y-2">
                    <h3>{item.productName}</h3>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  {formatPrice(item.price)}
                </td>
                <td className="px-4 py-3 text-center font-medium">
                  {item.quantity}
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  {formatPrice(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totales */}

      <div className="flex flex-col gap-1.5 text-sm self-end w-md p-4 border border-cocoa dark:border-cream/30 shadow-sm rounded-xl">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>{formatPrice(order.totalAmount)}</p>
        </div>
        <div className="flex justify-between font-semibold">
          <p>Total</p>
          <p>{formatPrice(order.totalAmount)}</p>
        </div>
        <div className="flex justify-between">
          <p>Envío: </p>
          <p>{order.delivery_options}</p>
        </div>
      </div>

      {/* Dirección */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Dirección</h2>
        <div className="w-full overflow-x-auto rounded-xl border border-cocoa dark:border-cream/30 shadow-sm p-3 flex flex-col gap-5">
          <div className="space-y-1 dark:bg-cream/20 bg-cocoa/20 p-3 rounded-md">
            <h3 className="font-medium">
              Cliente:
            </h3>
            <p className="text-sm">
              {order.customer.full_name}
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-1">
              Envío:
            </h3>
            <div className="text-sm  space-y-0.5">
              <p>{order.address.address_1}</p>
              {order.address.address_2 && <p>{order.address.address_2}</p>}
              <p>{order.address.city}</p>
              <p>{order.address.state}</p>
              <p>{order.address.postalCode}</p>
              <p>{order.address.country}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardOrderPage;