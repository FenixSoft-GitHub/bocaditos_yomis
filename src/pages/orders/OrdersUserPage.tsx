import { Loader } from "@/components/shared/Loader";
import { useOrders } from "@/hooks";
import { Link } from "react-router-dom";
import { TableOrders } from "@/components/orders/TableOrders";

const OrdersUserPage = () => {
  const { data: orders, isLoading } = useOrders();

  if (isLoading || !orders) return <Loader size={60} />;

  return (
    <div className="w-full flex flex-col gap-2 items-center bg-transparent dark:text-cream">
      <div className="flex gap-2">
        <h1 className="text-3xl font-bold text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]">
          Pedidos
        </h1>
        <span className="w-5 h-5 rounded-full font-semibold bg-choco text-fondo dark:bg-cream/70 dark:text-choco text-[11px] flex justify-center items-center mt-1 drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]">
          {orders.length}
        </span>
      </div>

      {orders.length === 0 ? (
        <>
          <p className="text-slate-600 text-[13px]">
            Todavía no has hecho ningún pedido
          </p>
          <Link
            to="/products/"
            className="uppercase font-semibold tracking-widest text-xs py-4 rounded-full px-8 shadow-lg transition-all duration-300 ease-in-out hover:scale-105 mt-4 outline-2 outline-offset-2 outline-gray-600"
          >
            Empezar a comprar
          </Link>
        </>
      ) : (
        <TableOrders orders={orders} />
      )}
    </div>
  );
};

export default OrdersUserPage;
