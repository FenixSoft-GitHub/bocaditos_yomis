import { FormProduct } from "@/components/dashboard";
import { useParams } from "react-router-dom";
import { useByIdProduct } from "@/hooks";
import { Loader } from "@/components/shared/Loader";
import { ProductFormValues } from "@/lib/validators";

const DashboardProductUpdatePage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { data: products, isLoading } = useByIdProduct(id); // solo si estás editando

  if (isEdit && isLoading) return <Loader size={60} />;

  // Transformar fechas
  const transformedProduct: ProductFormValues | undefined = products
    ? {
        ...products,
        created_at: products.created_at
          ? new Date(products.created_at)
          : undefined,
        updated_at: products.updated_at
          ? new Date(products.updated_at)
          : undefined,
      }
    : undefined;

  return (
    <div>
      <FormProduct
        title={isEdit ? "Editar Producto" : "Nuevo Producto"}
        initialData={transformedProduct}
      />
    </div>
  );
};

export default DashboardProductUpdatePage;
