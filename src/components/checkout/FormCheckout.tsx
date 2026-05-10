import { useForm } from "react-hook-form";
import { AddressFormValues, addressSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { ItemsCheckout } from "./ItemsCheckout";
import { useCreateOrder, useDeliverys } from "@/hooks";
import { useCartStore } from "@/store/cart.store";
import { Separator } from "@/components/shared/Separator";
import { Loader } from "@/components/shared/Loader";
import { ShieldCheck, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ShippingSection } from "./ShippingSection";
import toast from "react-hot-toast";

export const FormCheckout = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
  });

  const { mutate: createOrder, isPending } = useCreateOrder();
  const cleanCart = useCartStore((state) => state.cleanCart);
  const cartItems = useCartStore((state) => state.items);
  const totalAmount = useCartStore((state) => state.totalAmount);
  const navigate = useNavigate();
  const { deliverys: deliveryOptions, isLoading: loadingDelivery } =
    useDeliverys();

  const onSubmit = handleSubmit((data) => {
    const orderInput = {
      address: data,
      cartItems: cartItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        image_url: item.image_url,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
      delivery_option_id: data.delivery_option_id,
    };

    createOrder(orderInput, {
      onSuccess: () => {
        toast.success(
          "¡Pedido realizado con éxito! Pronto nos pondremos en contacto.",
          {
            position: "bottom-right",
            duration: 4000,
          },
        );
        cleanCart();
      },
      onError: () => {
        toast.error(
          "Error al procesar el pedido. Revisa los datos e intenta de nuevo.",
          {
            position: "bottom-right",
            duration: 4000,
          },
        );
      },
    });
  });

  if (isPending || loadingDelivery) {
    return (
      <div className="flex flex-col gap-3 w-full min-h-[50vh] items-center justify-center">
        <Loader size={50} fullScreen={false} />
        <p className="text-sm text-choco/60 dark:text-cream/60">
          Procesando tu pedido...
        </p>
      </div>
    );
  }

  return (
    <div className="text-choco dark:text-cream">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-choco/60 dark:text-cream/60 hover:text-choco dark:hover:text-cream transition-colors mb-6 group"
      >
        <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-1" />
        Volver
      </button>

      <form className="flex flex-col gap-6" onSubmit={onSubmit}>
        <ShippingSection
          register={register}
          errors={errors}
          deliveryOptions={deliveryOptions}
        />

        <div className="border border-cocoa/30 dark:border-cream/20 p-5 rounded-xl space-y-3 bg-cream/50 dark:bg-cream/5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-choco dark:text-cocoa" />
            <h4 className="font-semibold">Datos para Depósito Bancario</h4>
          </div>
          <ul className="text-sm space-y-1 text-choco/80 dark:text-cream/80">
            <li>
              <strong>Razón Social:</strong> Bocaditos Yomi's
            </li>
            <li>
              <strong>Banco:</strong> Venezuela
            </li>
            <li>
              <strong>RIF:</strong> 123456789000
            </li>
            <li>
              <strong>Cuenta:</strong> 1234567890
            </li>
          </ul>
        </div>

        {/* Resumen solo en móvil */}
        <div className="lg:hidden flex flex-col gap-3">
          <h3 className="font-semibold text-lg">Resumen del pedido</h3>
          <Separator />
          <ItemsCheckout />
        </div>

        <button
          type="submit"
          disabled={isPending || !deliveryOptions?.length}
          className="w-full py-3.5 px-6 rounded-xl font-bold tracking-wide text-sm bg-choco text-cream hover:bg-cocoa dark:bg-cream dark:text-oscuro dark:hover:bg-butter transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
          Confirmar Pedido
        </button>
      </form>
    </div>
  );
};
