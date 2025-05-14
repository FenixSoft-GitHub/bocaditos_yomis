import { FormPromo } from "@/components/dashboard";
import { Loader } from "@/components/shared/Loader";
import { useByIdPromo } from "@/hooks";
import { useParams } from "react-router-dom";

const DashboardPromoUpdatePage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { data: promo, isLoading } = useByIdPromo(id); // solo si estás editando

  if (isEdit && isLoading) return <Loader size={60} />;
  return (
    <div>
      <FormPromo
        title={isEdit ? "Editar Promoción" : "Nueva Promoción"}
        initialData={promo} 
      />
    </div>
  );
};

export default DashboardPromoUpdatePage;
