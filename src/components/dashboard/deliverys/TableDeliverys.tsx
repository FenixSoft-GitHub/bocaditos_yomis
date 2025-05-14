import { Loader } from "@/components/shared/Loader";
import { useDeliverys } from "@/hooks";
import { useState } from "react";
import { CellTableProduct } from "../products/CellTableProduct";
import { formatDate, formatPrice } from "@/helpers";
import { Link, useNavigate } from "react-router-dom";
import { MdAddCircleOutline } from "react-icons/md";
import { DropdownMenu } from "@/components/shared/DropdownMenu";
import { useDeleteDelivery } from "@/hooks/deliverys/useDeleteDelivery";
import { AdvancedFilter } from "@/components/shared/AdvancedFilter";


const tableHeaders = ["Nombre", "Precio", "Tiempo", "Fecha de creación", ""];

export const TableDeliverys = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const { deliverys, isLoading } = useDeliverys();
  const { mutate: deleteDelivery, isPending } = useDeleteDelivery();

  if (!deliverys || isLoading || isPending) return <Loader size={60} />;

  const filteredDeliverys = deliverys.filter(
    (delivery) =>
      delivery.name &&
      delivery.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full min-h-[500px] bg-fondo dark:bg-fondo-dark text-choco dark:text-cream border border-cocoa/30 dark:border-cream/30 rounded-lg px-3 py-2 gap-3">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-xl font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]">
            Deliverys
          </h1>
          <p className="text-xs mb-1 font-regular">
            Administración de Deliverys
          </p>
        </div>

        <div className="w-full sm:max-w-sm ">
          <AdvancedFilter
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            onClear={() => setSearchTerm("")}
          />
        </div>

        <div className="w-full sm:w-auto flex sm:justify-end">
          <Link
            to="/dashboard/deliverys/new"
            className="inline-flex items-center min-w-[220px] gap-2 px-4 py-2 bg-cocoa hover:bg-cocoa/90 text-white text-sm font-medium rounded-md transition justify-center"
          >
            <MdAddCircleOutline size={18} />
            Nuevo Delivery
          </Link>
        </div>
      </div>

      {/* Tabla */}
      <div className="relative w-full h-full overflow-x-auto">
        <table className="min-w-[600px] text-sm w-full caption-bottom  sm:table-auto">
          <thead className="bg-cocoa/20 dark:bg-cream/10 text-choco dark:text-cream text-xs uppercase tracking-wide">
            <tr className="bg-cocoa/30 dark:bg-cream/30 text-choco dark:text-cream rounded-md">
              {tableHeaders.map((header, index) => (
                <th
                  key={index}
                  className={`px-2 sm:px-4 py-2 font-semibold text-center ${index === 0 ? "rounded-l-md" : ""
                    } ${index === tableHeaders.length - 1 ? "rounded-r-md" : ""}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          {filteredDeliverys.length === 0 ? (
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
              {filteredDeliverys.map((delivery, index) => {
                return (
                  <tr key={index}>
                    <CellTableProduct
                      content={delivery.name}
                      className="text-left"
                    />

                    <CellTableProduct
                      className="text-right"
                      content={formatPrice(delivery?.price)}
                    />
                    <CellTableProduct
                      className="text-left"
                      content={delivery?.estimated_time as string}
                    />

                    <CellTableProduct
                      className="text-center"
                      content={formatDate(delivery.created_at as string)}
                    />

                    <td className="relative">
                      <DropdownMenu
                        onEdit={() =>
                          navigate(`/dashboard/deliverys/edit/${delivery.id}`)
                        }
                        onDelete={() => deleteDelivery(delivery.id)}
                      />
                    </td>
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
