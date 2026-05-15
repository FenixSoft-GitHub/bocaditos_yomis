import { Loader } from "@/components/shared/Loader";
import { useOrders } from "@/hooks";
import { Link, useNavigate } from "react-router-dom";
import { formatDateLong, formatPrice } from "@/helpers";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import { DashboardSection } from "@/components/dashboard/shared/DashboardSection";
import { DashboardCard } from "@/components/dashboard/shared/DashboardCard";
import { PageTransition } from "@/components/animations";
import {
  ShoppingBag,
  ChevronRight,
  Calendar,
  DollarSign,
  Package,
} from "lucide-react";

const OrdersUserPage = () => {
  const navigate = useNavigate();
  const { data: orders, isLoading } = useOrders();

  if (isLoading || !orders) return <Loader size={60} />;

  return (
    <PageTransition>
      <DashboardSection
        title="Mis Pedidos"
        description="Historial de todos tus pedidos realizados"
        count={orders.length}
        isEmpty={orders.length === 0}
        className={"mb-5"}
        empty={
          <>
            <ShoppingBag className="size-14" />
            <div className="text-center space-y-2">
              <p className="font-semibold text-choco dark:text-cream">
                Aún no tienes pedidos
              </p>
              <p className="text-sm text-choco/50 dark:text-cream/50">
                Explora nuestros productos y haz tu primer pedido
              </p>
            </div>
            <Link
              to="/products"
              className="btn-primary px-6 py-2.5 rounded-full text-sm"
            >
              Explorar productos
            </Link>
          </>
        }
      >
        {orders.map((order, index) => (
          <DashboardCard
            key={order.id}
            className={"p-3 gap-6 space-y-2.5"}
            onClick={() =>
              navigate(`/account/pedidos/${order.id}`, {
                state: { orderIndex: index + 1 },
              })
            }
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cocoa/15 dark:bg-cream/15 flex items-center justify-center">
                  <Package className="size-4 text-choco/70 dark:text-cream/70" />
                </div>
                <div>
                  <p className="text-xs font-medium text-choco/50 dark:text-cream/50">
                    Pedido # {index + 1}
                  </p>
                  <StatusBadge status={order.status} />
                </div>
              </div>
              <ChevronRight className="size-4 text-choco/30 dark:text-cream/30" />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-choco/50 dark:text-cream/50">
              <div className="flex items-center gap-1">
                <Calendar className="size-3" />
                {formatDateLong(order.created_at)}
              </div>
              <div className="flex items-center gap-1 font-bold text-choco dark:text-cream text-sm">
                <DollarSign className="size-3.5" />
                {formatPrice(order.total_amount).replace("$", "")}
              </div>
            </div>
          </DashboardCard>
        ))}
      </DashboardSection>
    </PageTransition>
  );
};

export default OrdersUserPage;
