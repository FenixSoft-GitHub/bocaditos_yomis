import { Loader } from "@/components/shared/Loader";
import { useDeletePromo, usePromo } from "@/hooks";
import { useCallback, useEffect, useState } from "react";
import { CellTableProduct } from "../products/CellTableProduct";
import { formatDate, formatPrice } from "@/helpers";
import { Link, useNavigate } from "react-router-dom";
import { MdAddCircleOutline } from "react-icons/md";
import { DropdownMenu } from "@/components/shared/DropdownMenu";
import { useChangeStatusPromo } from "@/hooks/promo/useChangeStatusPromo";
import { AdvancedFilter } from "@/components/shared/AdvancedFilter";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";

const tableHeaders = [
  "Nombre",
  "% Descuento",
  "Desde",
  "Hasta",
  "Status",
  "Fecha de creación",
  "",
];

export const TablePromo = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { promotions, isLoading } = usePromo();
  const { mutate: deletePromo, isPending } = useDeletePromo();
  const { mutate } = useChangeStatusPromo();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<{
    id: string;
    code: string;
  } | null>(null);


  // Funciones
  const handleOpenModal = (id: string, code: string) => {
    setSelectedPromo({ id, code });
    setIsModalOpen(true);
  };
  
  const handleConfirmDelete = () => {
    if (selectedPromo) {
      deletePromo(selectedPromo.id);
      setIsModalOpen(false);
    }
  };


  const handleStatusChange = useCallback(
    (id: string, is_active: boolean) => {
      mutate({ id, is_active });
    },
    [mutate]
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
          if (isExpired && promo.is_active) {
            handleStatusChange(promo.id, false);
          }
          if (!isExpired && !promo.is_active) {
            handleStatusChange(promo.id, true);
          }
        }
      });
    }
  }, [promotions, handleStatusChange]);

  if (!promotions || isLoading || isPending) return <Loader size={60} />;

  const filteredPromotions = promotions.filter(
    (promotion) =>
      promotion.code &&
      promotion.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full min-h-[500px] bg-fondo dark:bg-fondo-dark text-choco dark:text-cream border border-cocoa/30 dark:border-cream/30 rounded-lg px-3 py-2 gap-3">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-xl font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]">
            Promociones
          </h1>
          <p className="text-xs mb-1 font-regular">
            Administración de Promociones
          </p>
        </div>

        <div className="w-full sm:max-w-sm">
          <AdvancedFilter
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            onClear={() => setSearchTerm("")}
          />
        </div>

        <div className="w-full sm:w-auto flex sm:justify-end">
          <Link
            to="/dashboard/promotions/new"
            className="inline-flex items-center min-w-[220px] gap-2 px-4 py-2 bg-cocoa hover:bg-cocoa/90 text-white text-sm font-medium rounded-md transition justify-center"
          >
            <MdAddCircleOutline size={20} className="inline-block mr-1" />
            Nueva Promoción
          </Link>
        </div>
      </div>

      {/* Tabla */}
      <div className="relative w-full h-full overflow-x-auto">
        <table className="min-w-[600px] text-sm w-full caption-bottom sm:table-auto">
          <thead className="bg-cocoa/20 dark:bg-cream/10 text-choco dark:text-cream text-xs uppercase tracking-wide">
            <tr className="bg-cocoa/30 dark:bg-cream/30 text-choco dark:text-cream rounded-md">
              {tableHeaders.map((header, index) => (
                <th
                  key={index}
                  className={`px-2 sm:px-4 py-2 font-semibold text-center ${
                    index === 0 ? "rounded-l-md" : ""
                  } ${index === tableHeaders.length - 1 ? "rounded-r-md" : ""}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          {filteredPromotions.length === 0 ? (
            <tbody>
              <tr>
                <td
                  colSpan={tableHeaders.length}
                  className="text-center py-10 text-choco dark:text-cream"
                >
                  No se encontraron productos con ese término.
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {filteredPromotions.map((promotion, index) => {
                return (
                  <tr key={index}>
                    <CellTableProduct
                      content={promotion.code}
                      className="text-left"
                    />

                    <CellTableProduct
                      className="text-right"
                      content={formatPrice(promotion?.discount_percent)}
                    />

                    <CellTableProduct
                      className="text-center"
                      content={formatDate(promotion.valid_from)}
                    />

                    <CellTableProduct
                      className="text-center"
                      content={formatDate(promotion.valid_until)}
                    />

                    <CellTableProduct
                      className={
                        promotion?.is_active
                          ? "text-center text-green-600 font-medium"
                          : "text-center text-red-600 font-medium"
                      }
                      content={promotion?.is_active ? "Activo" : "Expirado"}
                    />

                    <CellTableProduct
                      className="text-center"
                      content={formatDate(promotion.created_at as string)}
                    />

                    <td className="relative">
                      <DropdownMenu
                        onEdit={() =>
                          navigate(`/dashboard/promotions/edit/${promotion.id}`)
                        }
                        onDelete={() =>
                          handleOpenModal(promotion.id, promotion.code)
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar promoción?"
        message={
          <>
            ¿Estás seguro de que deseas eliminar la promoción <br />
            <strong className="text-amber-600">{selectedPromo?.code}</strong>?
          </>
        }
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        isConfirming={isPending}
      />
    </div>
  );
};
