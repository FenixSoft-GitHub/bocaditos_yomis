import { Loader } from "@/components/shared/Loader";
import { useDeliverys } from "@/hooks";
import { useState, useMemo } from "react";
import { formatDate, formatPrice } from "@/helpers";
import { useNavigate } from "react-router-dom";
import { DropdownMenu } from "@/components/shared/DropdownMenu";
import { useDeleteDelivery } from "@/hooks/deliverys/useDeleteDelivery";
import { AdvancedFilter } from "@/components/shared/AdvancedFilter";
import { Pagination } from "@/components/shared/Pagination";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { DashboardSection } from "@/components/dashboard/shared/DashboardSection";
import { DashboardCard } from "@/components/dashboard/shared/DashboardCard";
import { DashboardAddButton } from "@/components/dashboard/shared/DashboardAddButton";
import { Truck, DollarSign, Clock, Calendar } from "lucide-react";

const ITEMS_PER_PAGE = 9;

export const TableDeliverys = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const navigate = useNavigate();
  const { deliverys, isLoading } = useDeliverys();
  const { mutate: deleteDelivery, isPending } = useDeleteDelivery();

  const filtered = useMemo(
    () =>
      (deliverys ?? []).filter((d) =>
        d.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [deliverys, searchTerm],
  );

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  if (!deliverys || isLoading || isPending) return <Loader size={60} />;

  return (
    <>
      <DashboardSection
        title="Métodos de Entrega"
        description="Configura los métodos de envío disponibles"
        count={deliverys.length}
        action={
          <DashboardAddButton
            to="/dashboard/deliverys/new"
            label="Nuevo Método"
          />
        }
        filters={
          <AdvancedFilter
            searchValue={searchTerm}
            onSearchChange={(v) => {
              setSearchTerm(v);
              setPage(1);
            }}
            onClear={() => {
              setSearchTerm("");
              setPage(1);
            }}
          />
        }
        isEmpty={filtered.length === 0}
        empty={
          <>
            <Truck className="size-12" />
            <p className="text-sm font-medium">
              No se encontraron métodos de entrega
            </p>
          </>
        }
      >
        {paginated.map((delivery) => (
          <DashboardCard key={delivery.id} className={"gap-4.5 m-1.5"}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-cocoa/15 dark:bg-cream/15 flex items-center justify-center shrink-0">
                  <Truck className="size-4 text-choco/70 dark:text-cream/70" />
                </div>
                <p className="font-semibold text-sm text-choco dark:text-cream truncate">
                  {delivery.name}
                </p>
              </div>
              <DropdownMenu
                onEdit={() =>
                  navigate(`/dashboard/deliverys/edit/${delivery.id}`)
                }
                onDelete={() => {
                  setSelectedDelivery({ id: delivery.id, name: delivery.name });
                  setIsModalOpen(true);
                }}
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-cocoa/10 dark:border-cream/10 text-sm">
              <div className="flex items-center gap-1.5 font-bold text-choco dark:text-cream">
                <DollarSign className="size-3.5 text-choco/50 dark:text-cream/50" />
                {delivery.price > 0 ? (
                  formatPrice(delivery.price)
                ) : (
                  <span className="text-green-600 dark:text-green-400 text-xs font-semibold">
                    Gratis
                  </span>
                )}
              </div>
              {delivery.estimated_time && (
                <div className="flex items-center gap-1 text-xs text-choco/60 dark:text-cream/60">
                  <Clock className="size-3" />
                  {delivery.estimated_time}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 text-[11px] text-choco/40 dark:text-cream/40">
              <Calendar className="size-3" />
              {formatDate(delivery.created_at as string)}
            </div>
          </DashboardCard>
        ))}

        {filtered.length > ITEMS_PER_PAGE && (
          <div className="sm:col-span-2 xl:col-span-3 pt-2 border-t border-cocoa/20 dark:border-cream/10">
            <Pagination
              page={page}
              setPage={setPage}
              totalItems={filtered.length}
            />
          </div>
        )}
      </DashboardSection>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          if (selectedDelivery) {
            deleteDelivery(selectedDelivery.id);
            setIsModalOpen(false);
          }
        }}
        title="¿Eliminar método de entrega?"
        message={
          <>
            ¿Eliminar{" "}
            <strong className="text-choco dark:text-cream">
              {selectedDelivery?.name}
            </strong>
            ?
          </>
        }
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        isConfirming={isPending}
      />
    </>
  );
};