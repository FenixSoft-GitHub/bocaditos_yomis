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
          <p className="text-[13px]">
            Todavía no has hecho ningún pedido
          </p>
          <Link
            to="/products/"
            className="mt-4 bg-amber-600 hover:bg-amber-500 text-oscuro text-sm font-semibold py-3 px-6 rounded-md shadow-sm transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-600"
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
