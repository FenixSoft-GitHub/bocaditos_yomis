import { Loader } from "@/components/shared/Loader";
import { useDeletePromo, usePromo } from "@/hooks";
import { useCallback, useEffect, useState, useMemo } from "react";
import { formatDate } from "@/helpers";
import { useNavigate } from "react-router-dom";
import { DropdownMenu } from "@/components/shared/DropdownMenu";
import { useChangeStatusPromo } from "@/hooks/promo/useChangeStatusPromo";
import { AdvancedFilter } from "@/components/shared/AdvancedFilter";
import { Pagination } from "@/components/shared/Pagination";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { DashboardSection } from "@/components/dashboard/shared/DashboardSection";
import { DashboardCard } from "@/components/dashboard/shared/DashboardCard";
import { DashboardAddButton } from "@/components/dashboard/shared/DashboardAddButton";
import { Tag, Calendar, CheckCircle2, XCircle } from "lucide-react";

const ITEMS_PER_PAGE = 9;

export const TablePromo = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<{
    id: string;
    code: string;
  } | null>(null);
  const navigate = useNavigate();
  const { promotions, isLoading } = usePromo();
  const { mutate: deletePromo, isPending } = useDeletePromo();
  const { mutate } = useChangeStatusPromo();

  const handleStatusChange = useCallback(
    (id: string, is_active: boolean) => mutate({ id, is_active }),
    [mutate],
  );

  useEffect(() => {
    const now = new Date();
    if (promotions) {
      promotions.forEach((promo) => {
        const validUntil = promo.valid_until
          ? new Date(promo.valid_until)
          : null;
        if (validUntil) {
          const isExpired = validUntil < now;
          if (isExpired && promo.is_active) handleStatusChange(promo.id, false);
          if (!isExpired && !promo.is_active)
            handleStatusChange(promo.id, true);
        }
      });
    }
  }, [promotions, handleStatusChange]);

  const filtered = useMemo(
    () =>
      (promotions ?? []).filter((p) =>
        p.code?.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [promotions, searchTerm],
  );

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  if (!promotions || isLoading || isPending) return <Loader size={60} />;

  return (
    <>
      <DashboardSection
        title="Promociones"
        description="Gestiona los descuentos y promociones activas"
        count={promotions.length}
        action={
          <DashboardAddButton
            to="/dashboard/promotions/new"
            label="Nueva Promoción"
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
            <Tag className="size-12" />
            <p className="text-sm font-medium">No se encontraron promociones</p>
          </>
        }
      >
        {paginated.map((promo) => (
          <DashboardCard key={promo.id} className={"gap-4.5 m-1.5"}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-9 rounded-lg bg-dorado/15 flex items-center justify-center shrink-0">
                  <Tag className="size-4 text-dorado" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-choco dark:text-cream tracking-wider uppercase">
                    {promo.code}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {promo.is_active ? (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-green-600 dark:text-green-400">
                        <CheckCircle2 className="size-3" /> Activa
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-red-500 dark:text-red-400">
                        <XCircle className="size-3" /> Expirada
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <DropdownMenu
                onEdit={() =>
                  navigate(`/dashboard/promotions/edit/${promo.id}`)
                }
                onDelete={() => {
                  setSelectedPromo({ id: promo.id, code: promo.code });
                  setIsModalOpen(true);
                }}
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-cocoa/10 dark:border-cream/10">
              <div className="flex items-center gap-1 font-bold text-choco dark:text-cream">
                {/* <Percent className="size-3.5 text-dorado" /> */}
                <span className="text-dorado">{promo.discount_percent}%</span>
                <span className="text-xs font-normal text-choco/50 dark:text-cream/50">
                  descuento
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-choco/40 dark:text-cream/40">
              <span className="flex items-center gap-1">
                <Calendar className="size-3" />
                {formatDate(promo.valid_from)}
              </span>
              <span>→</span>
              <span className="flex items-center gap-1">
                <Calendar className="size-3" />
                {formatDate(promo.valid_until)}
              </span>
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
          if (selectedPromo) {
            deletePromo(selectedPromo.id);
            setIsModalOpen(false);
          }
        }}
        title="¿Eliminar promoción?"
        message={
          <>
            ¿Eliminar{" "}
            <strong className="text-choco dark:text-cream">
              {selectedPromo?.code}
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