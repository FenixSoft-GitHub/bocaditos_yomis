import { Loader } from "@/components/shared/Loader";
import { useCategories, useDeleteCategory } from "@/hooks";
import { useState, useMemo } from "react";
import { formatDate } from "@/helpers";
import { useNavigate } from "react-router-dom";
import { DropdownMenu } from "@/components/shared/DropdownMenu";
import { AdvancedFilter } from "@/components/shared/AdvancedFilter";
import { Pagination } from "@/components/shared/Pagination";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { DashboardSection } from "@/components/dashboard/shared/DashboardSection";
import { DashboardCard } from "@/components/dashboard/shared/DashboardCard";
import { DashboardAddButton } from "@/components/dashboard/shared/DashboardAddButton";
import { LayoutGrid, Calendar, FileText } from "lucide-react";

const ITEMS_PER_PAGE = 9;

export const TableCategory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const navigate = useNavigate();
  const { categories, isLoading } = useCategories();
  const { mutate: deleteCat, isPending } = useDeleteCategory();

  const filtered = useMemo(
    () =>
      (categories ?? []).filter((c) =>
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [categories, searchTerm],
  );

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  if (!categories || isLoading || isPending) return <Loader size={60} />;

  return (
    <>
      <DashboardSection
        title="Categorías"
        description="Organiza tus productos por categorías"
        count={categories.length}
        action={
          <DashboardAddButton
            to="/dashboard/category/new"
            label="Nueva Categoría"
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
            <LayoutGrid className="size-12" />
            <p className="text-sm font-medium">No se encontraron categorías</p>
          </>
        }
      >
        {paginated.map((category) => (
          <DashboardCard key={category.id} className={"gap-4.5 m-1.5"}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-9 rounded-lg bg-cocoa/15 dark:bg-cream/15 flex items-center justify-center shrink-0">
                  <LayoutGrid className="size-4 text-choco/70 dark:text-cream/70" />
                </div>
                <p className="font-semibold text-sm text-choco dark:text-cream capitalize">
                  {category.name}
                </p>
              </div>
              <DropdownMenu
                onEdit={() =>
                  navigate(`/dashboard/category/edit/${category.id}`)
                }
                onDelete={() => {
                  setSelectedCategory({ id: category.id, name: category.name });
                  setIsModalOpen(true);
                }}
              />
            </div>

            {category.description && (
              <div className="flex items-start gap-1.5 text-xs text-choco/60 dark:text-cream/60 pt-2 border-t border-cocoa/10 dark:border-cream/10">
                <FileText className="size-3 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{category.description}</span>
              </div>
            )}

            <div className="flex items-center gap-1 text-[11px] text-choco/40 dark:text-cream/40">
              <Calendar className="size-3" />
              {formatDate(category.created_at as string)}
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
          if (selectedCategory) {
            deleteCat(selectedCategory.id);
            setIsModalOpen(false);
          }
        }}
        title="¿Eliminar categoría?"
        message={
          <>
            ¿Eliminar{" "}
            <strong className="text-choco dark:text-cream">
              {selectedCategory?.name}
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