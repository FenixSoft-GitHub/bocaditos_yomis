import { FormDeliverys } from "@/components/dashboard/deliverys/FormDeliverys";
import { Loader } from "@/components/shared/Loader";
import { useDeliveryById } from "@/hooks/deliverys/useDeliveryById";
import { useParams } from "react-router-dom";


const DashboardDeliverysUpdatePage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { data: delivery, isLoading } = useDeliveryById(id); // solo si estás editando

  if (isEdit && isLoading) return <Loader size={60} />;
  return (
    <div>
      <FormDeliverys
        title={isEdit ? "Editar Delivery" : "Nuevo Delivery"}
        initialData={
          delivery
            ? {
                ...delivery,
                estimated_time: delivery.estimated_time ?? "", // transforma null a ""
              }
            : undefined
        }
      />
    </div>
  );
}

export default DashboardDeliverysUpdatePage
