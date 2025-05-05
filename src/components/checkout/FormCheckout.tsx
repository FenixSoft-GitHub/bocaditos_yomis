import { useForm } from "react-hook-form";
import { AddressFormValues, addressSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { ItemsCheckout } from "./ItemsCheckout";
import { useCreateOrder, useDelivery } from "@/hooks";
import { useCartStore } from "@/store/cart.store";
import { Separator } from "@/components/shared/Separator";
import { Loader } from "@/components/shared/Loader";
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { ShippingSection } from "./ShippingSection";
import { RiSecurePaymentLine } from "react-icons/ri";
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

  const { data: deliveryOptions, isLoading: loadingDelivery } = useDelivery();
  // const { data: promoCodes, isLoading: loadingPromo } = usePromoCode();

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
      // promo_code_id: data.promo_code_id,
    };

    createOrder(orderInput, {
      onSuccess: () => {
        // ✅ Mostrar mensaje
        toast.success(
          <div>
            <p className="font-bold">¡Pedido realizado con éxito!</p>
            <p className="text-sm text-gray-600">
              En breve nos pondremos en contacto contigo.
            </p>
          </div>,
          {
            position: "bottom-right",
            duration: 3000,
          }
        );
        cleanCart();
      },
      onError: () => {
        toast.error(
          <div>
            <p className="font-bold">Error al procesar el pedido</p>
            <p className="text-sm text-gray-600">
              Intenta nuevamente o revisa los datos ingresados.
            </p>
          </div>,
          {
            position: "bottom-right",
            duration: 3000,
          }
        );
      },
    });
  });

  if (isPending || loadingDelivery) {
    return (
      <div className="flex flex-col gap-3 w-full min-h-[50vh] items-center justify-center">
        <Loader size={60} />
        <p className="text-sm font-medium">Procesando información...</p>
      </div>
    );
  }

  return (
    <div className="dark:bg-fondo-dark dark:text-cream bg-fondo text-choco">
      {/* Botón Volver */}
      <button
        className="flex items-center gap-2 text-sm border border-cocoa dark:border-cream/70 rounded-md bg-cream dark:bg-cream/30 shadow-gray-400 shadow-md hover:bg-cocoa/20 hover:font-semibold dark:hover:bg-cocoa/20 px-6 py-1.5 mb-4"
        onClick={() => navigate(-1)}
      >
        <IoChevronBack size={16} />
        Volver
      </button>
      <form className="flex flex-col gap-6" onSubmit={onSubmit}>
        {/* Dirección */}
        <ShippingSection
          register={register}
          errors={errors}
          deliveryOptions={deliveryOptions}
        />

        {/* Información de pago */}
        <div className="border border-cocoa/50 p-4 rounded-lg shadow-sm dark:border-cream/30 space-y-2">
          <div className="flex gap-3">
            <RiSecurePaymentLine size={24} />
            <h4 className="font-semibold text-base">Depósito Bancario</h4>
          </div>
          <ul className="text-sm space-y-0.5">
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

        {/* Resumen */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-2xl">Resumen del pedido</h3>
          <Separator />
          <ItemsCheckout />
        </div>

        {/* Botón submit */}
        <button
          type="submit"
          disabled={isPending || !deliveryOptions?.length}
          className="bg-amber-600 text-white dark:bg-amber-500 dark:text-black hover:bg-amber-700 dark:hover:bg-amber-600 px-6 rounded-md border border-transparent hover:shadow-md cursor-pointer py-2.5 font-bold tracking-wide mt-2 shadow-lg transition-all duration-300 ease-in-out hover:scale-105 outline-2 outline-offset-2 outline-amber-600 dark:outline-amber-500"
        >
          Finalizar Pedido
        </button>
      </form>
    </div>
  );
};
