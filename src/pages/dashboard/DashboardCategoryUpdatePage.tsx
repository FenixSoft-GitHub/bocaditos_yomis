import { FormCategories } from "@/components/dashboard";
import { Loader } from "@/components/shared/Loader";
import { useCategoryById } from "@/hooks";
import { useParams } from "react-router-dom";

const DashboardCategoryUpdatePage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { data: category, isLoading } = useCategoryById(id); // solo si estás editando

  if (isEdit && isLoading) return <Loader size={60} />;

  return (
    <div>
      <FormCategories
        title={isEdit ? "Editar Categoría" : "Nueva Categoría"}
        initialData={
          category
            ? {
                ...category,
                created_at: category.created_at
                  ? new Date(category.created_at)
                  : undefined,
              }
            : null
        }
      />
    </div>
  );
};

export default DashboardCategoryUpdatePage;
