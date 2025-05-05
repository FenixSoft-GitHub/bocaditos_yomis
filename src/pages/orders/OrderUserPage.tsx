import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useOrder } from "@/hooks";
import { Loader } from "@/components/shared/Loader";
import { IoChevronBack } from "react-icons/io5";
import { formatDateLong, formatPrice } from "@/helpers";

const tableHeaders = ["Producto", "Cantidad", "Precio Unit.", "Importe"];

const OrderUserPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const orderIndex = location.state?.orderIndex;

  const { data: order, isLoading } = useOrder(id as string);

  const navigate = useNavigate();

  if (isLoading || !order) return <Loader size={60} />;

  return (
    <div className="">
      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
        {/* Botón Volver */}
        <button
          className="flex items-center gap-2 text-sm border border-cocoa dark:border-cream/70 rounded-full bg-cream dark:bg-cream/30 shadow-gray-400 shadow-md hover:bg-cocoa/20 hover:font-semibold dark:hover:bg-cocoa/20 px-6 py-1.5"
          onClick={() => navigate(-1)}
        >
          <IoChevronBack size={16} />
          Volver
        </button>
        {/* Título centrado */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <h1 className="text-3xl font-bold">Pedido # {orderIndex ?? id}</h1>
          <p className="text-sm">{formatDateLong(order.created_at)}</p>
        </div>
        {/* Div vacío para alinear visualmente el centro */}
        <div className="w-[112px] hidden md:block" />{" "}
        {/* Aproximadamente el ancho del botón */}
      </div>

      <div className="flex flex-col mt-10 mb-5 gap-5 ">
        <div className="w-full overflow-x-auto rounded-xl border border-cocoa dark:border-cream/70 shadow-sm">
          <table className="text-sm w-full caption-bottom overflow-auto">
            <thead className="w-full bg-cocoa/50 dark:bg-cream/30 text-xs uppercase text-choco dark:text-cream tracking-wide border-b border-cocoa dark:border-cream/70">
              <tr>
                {tableHeaders.map((header, index) => (
                  <th
                    key={index}
                    className="h-12 text-center uppercase tracking-wide font-semibold"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {order.orderItems.map((product, index) => (
                <tr
                  key={index}
                  className="border-b border-cocoa/70 dark:border-cream/30 "
                >
                  <td className="py-2 px-3 font-medium tracking-tighter flex gap-3 items-center">
                    <img
                      src={product.productImage}
                      alt={product.productName}
                      className="size-16 object-cover rounded-lg border border-cocoa/70 dark:border-cream/30"
                    />
                    <div className="space-y-2">
                      <h3>{product.productName}</h3>
                    </div>
                  </td>
                  <td className="p-4 font-medium tracking-tighter text-center">
                    {product.quantity}
                  </td>
                  <td className="p-4 font-medium tracking-tighter text-center">
                    {formatPrice(product.unit_price)}
                  </td>
                  <td className="p-4 font-medium tracking-tighter text-right">
                    {formatPrice(product.subtotal)}
                    {/* {formatPrice(product.price * product.quantity)} */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-1.5 text-sm self-end w-md p-4 border border-cocoa dark:border-cream/70 shadow-sm rounded-xl">
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
            <p>{order.deliveryOption}</p>
          </div>
          <div className="flex justify-between">
            <p>Promoción: </p>
            <p>{order.promoCode}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold">Dirección</h2>

          <div className="w-full overflow-x-auto rounded-xl border border-cocoa dark:border-cream/70 shadow-sm p-3 flex flex-col gap-5">
            <div className="space-y-1 dark:bg-cream/20 bg-cocoa/20 p-3 rounded-md">
              <h3 className="font-medium">Cliente:</h3>
              <p>{order.user.full_name}</p>
            </div>

            <div className="flex flex-col gap-1 px-2 text-sm">
              <h3 className="font-medium text-base">Envío:</h3>
              <p>{order.address.address_1}</p>
              <p>{order.address.address_2 && order.address.address_2}</p>
              <p>{order.address.city}</p>
              <p>{order.address.state}</p>
              <p>{order.address.postalCode}</p>
              <p>{order.address.country}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderUserPage;
