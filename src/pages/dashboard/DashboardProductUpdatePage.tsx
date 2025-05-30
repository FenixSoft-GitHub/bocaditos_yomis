import { FormProduct } from "@/components/dashboard";
import { useParams } from "react-router-dom";
import { useByIdProduct } from "@/hooks"; // Este hook ahora retorna SupabaseProductWithDiscount | null
import { Loader } from "@/components/shared/Loader";
import { ProductFormValues, DiscountFormValues } from "@/lib/validators"; // Asegúrate de importar DiscountFormValues
const DashboardProductUpdatePage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  // data: products ahora puede ser SupabaseProductWithDiscount | null | undefined
  const { data: products, isLoading } = useByIdProduct(id);

  if (isEdit && isLoading) return <Loader size={60} />;
  // Si estamos editando y no se encontró el producto, podrías mostrar un error o redirigir
  if (isEdit && !products && !isLoading) {
    return <div>Producto no encontrado o error al cargar.</div>;
  }

  // Transformar los datos de Supabase al formato de ProductFormValues
  // Asegurarse de que las fechas sean objetos Date y que el descuento sea manejado correctamente
  const transformedProduct: ProductFormValues | undefined = products
    ? {
        ...products, // Copiamos las propiedades directas del producto
        // Convertir strings de fecha a objetos Date para ProductFormValues
        created_at: products.created_at
          ? new Date(products.created_at)
          : undefined,
        updated_at: products.updated_at
          ? new Date(products.updated_at)
          : undefined,
        // Manejar el objeto de descuento:
        // Si products.discount es un objeto (no null), lo mapeamos a la estructura esperada.
        // Si products.discount es null, el campo 'discount' en transformedProduct será undefined.
        discount: products.discount
          ? ({
              id: products.discount.id,
              discount_type: products.discount.discount_type,
              value: products.discount.value,
              // Convertir strings de fecha del descuento a objetos Date
              starts_at: products.discount.starts_at
                ? new Date(products.discount.starts_at)
                : undefined,
              ends_at: products.discount.ends_at
                ? new Date(products.discount.ends_at)
                : undefined,
            } as DiscountFormValues) // <--- Casting explícito para resolver el error de tipo
          : undefined, // Si no hay descuento de Supabase, el campo 'discount' es undefined
        // has_discount no viene de la DB, se calcula en FormProduct (o aquí si lo prefieres)
        has_discount: products.discount ? true : false,
      }
    : undefined; // Si 'products' es null o undefined, transformedProduct también lo es

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