import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom"; // ← Importar
import { useDeleteProduct, useProductPages, useProductsAll } from "@/hooks";
import { Loader } from "@/components/shared/Loader";
import { Pagination } from "@/components/shared/Pagination";
import { AdvancedFilter } from "@/components/shared/AdvancedFilter";
import { DashboardSection } from "@/components/dashboard/shared/DashboardSection";
import { DashboardAddButton } from "@/components/dashboard/shared/DashboardAddButton";
import { ProductCard } from "./ProductCard";
import { Package } from "lucide-react";

export const TableProduct = () => {
  const [filters, setFilters] = useState({ name: "", category: "" });
  const [page, setPage] = useState(1);
  const navigate = useNavigate(); // ← Añadir

  const { products, isLoading, totalProducts } = useProductPages({ page });
  const { productsAll, isLoading: isLoadingAll } = useProductsAll();
  const { mutate: deleteProduct, isPending } = useDeleteProduct();

  const filteredProducts = useMemo(() => {
    const shouldFilter = filters.name !== "" || filters.category !== "";
    const sourceProducts = (shouldFilter ? productsAll : products) || [];

    return sourceProducts.filter((product) => {
      const nameMatch = product.name
        .toLowerCase()
        .includes(filters.name.toLowerCase());
      const categoryMatch = product.categories.name
        .toLowerCase()
        .includes(filters.category.toLowerCase());
      return nameMatch && categoryMatch;
    });
  }, [products, productsAll, filters]);

  if (isLoading || isLoadingAll || isPending) {
    return <Loader size={60} />;
  }

  return (
    <DashboardSection
      title="Productos"
      description="Gestiona tu catálogo de productos"
      count={totalProducts}
      action={
        <DashboardAddButton
          to="/dashboard/product/new"
          label="Nuevo Producto"
        />
      }
      filters={
        <AdvancedFilter 
          searchValue={filters.name}
          onSearchChange={(value) =>
            setFilters((prev) => ({ ...prev, name: value }))
          }
          selects={[
            {
              label: "Categoría",
              value: filters.category,
              onChange: (value) =>
                setFilters((prev) => ({ ...prev, category: value })),
              options: Array.from(
                new Set((productsAll || []).map((p) => p.categories.name)),
              ).map((cat) => ({ label: cat, value: cat })),
            },
          ]}
          onClear={() => setFilters({ name: "", category: "" })}
        />
      }
      isEmpty={filteredProducts.length === 0}
      empty={
        <>
          <Package className="size-12" />
          <p className="text-sm font-medium">No se encontraron productos</p>
        </>
      }
    >
      {filteredProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={(id) => navigate(`/dashboard/product/edit/${id}`)}
          onDelete={(id) => deleteProduct(id)}
        />
      ))}

      {!filters.name && !filters.category && (
        <div className="sm:col-span-2 xl:col-span-3 pt-2 border-t border-cocoa/20 dark:border-cream/10">
          <Pagination
            page={page}
            setPage={setPage}
            totalItems={totalProducts}
          />
        </div>
      )}
    </DashboardSection>
  );
};