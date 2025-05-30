import { Link, useNavigate, useParams } from "react-router-dom";
import { useOrder, useUser } from "@/hooks";
import { Loader } from "@/components/shared/Loader";
import { formatPrice, formatToTwoDecimals } from "@/helpers";
import { supabase } from "@/supabase/client";
import { useEffect } from "react";
import { RiSecurePaymentLine } from "react-icons/ri";

const ThankyouPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useOrder(String(id));
  const { isLoading: isLoadingSession } = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        navigate("/login");
      }
    });
  }, [navigate]);

  if (isError) return <div>Error al cargar la orden</div>;

  if (isLoading || !data || isLoadingSession) return <Loader size={60} />;

  return (
    <main className="flex flex-col mx-auto px-4 py-6 pt-10 bg-fondo text-choco dark:bg-fondo-dark dark:text-cream">
      <div className="container flex-1 flex flex-col items-center gap-10">
        <div className="flex gap-3 items-center">
          <img
            className="w-10 h-10"
            src="/img/misc/checked.avif"
            alt="Imagen de Check"
          />
          <p className="text-4xl">¡Gracias, {data.user.full_name}!</p>
        </div>

        <div className="border border-cocoa/50 dark:border-cream/30 w-full md:w-[600px] p-5 rounded-md space-y-3">
          <h3 className="font-medium text-center dark:bg-cream/20 bg-cocoa/20 p-2 rounded-md shadow-md">
            Tu pedido está confirmado
          </h3>

          <p className="text-sm">
            Gracias por realizar tu compra en{" "}
            <strong>
              <span className="font-body4 text-xl">Bocaditos Yomi's</span>
            </strong>
            . Para realizar la transferencia te compartimos los siguientes datos
          </p>

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

          <p className="text-sm">
            Una vez realizada la transferencia, comparte tu comprobante a
            ventas@bocaditosyomis.com para procesarla y hacerte la entrega de tu
            producto a domicilio.
          </p>
        </div>

        <div className="border border-cocoa/50 dark:border-cream/30 w-full md:w-[600px] p-5 rounded-md space-y-3">
          <h3 className="font-medium text-center dark:bg-cream/20 bg-cocoa/20 p-2 rounded-md shadow-md">
            Detalles del pedido
          </h3>

          <div className="flex flex-col gap-5">
            <ul className="space-y-5">
              {data.orderItems.map((item, index) => (
                <li
                  key={index}
                  className="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto_auto_auto] items-center gap-1 sm:gap-3 p-2 border rounded-lg"
                >
                  <div className="flex items-center gap-1 sm:gap-3">
                    {/* Imagen del producto */}
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded-md justify-self-start"
                    />

                    {/* Nombre del producto */}
                    <p className="font-semibold text-sm text-left">
                      {item.productName}
                    </p>
                  </div>

                  {/* Precio unitario */}
                  <p className="text-xs font-medium text-right sm:justify-self-end">
                    {formatPrice(item.unit_price)}
                  </p>

                  {/* Precio unitario */}
                  <p className="text-xs font-medium text-right sm:justify-self-end">
                    {formatToTwoDecimals(item.quantity)}
                  </p>

                  {/* Subtotal */}
                  <p className="text-xs font-medium text-right sm:justify-self-end">
                    {formatPrice(item.subtotal)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="flex justify-between">
              <span className="font-semibold">Total:</span>
              <span className="font-semibold">
                {formatPrice(data.totalAmount)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col text-sm">
              <p className="font-semibold">Información de contacto:</p>
              <p>{data.user.email}</p>
            </div>

            <div className="flex flex-col text-sm">
              <p className="font-semibold">Métodos de pago:</p>
              <p>Deposito bancario - {formatPrice(data.totalAmount)}</p>
            </div>

            <div className="flex flex-col text-sm">
              <p className="font-semibold">Dirección de envío</p>
              <p>{data.address.address_1}</p>
              <p>{data.address.address_2 && data.address.address_2}</p>
              <p>{data.address.city}</p>
              <p>{data.address.state}</p>
              <p>{data.address.postalCode}</p>
              <p>{data.address.country}</p>
            </div>

            <div className="flex flex-col text-sm">
              <p className="font-semibold">Método de envío</p>
              <p>{data.deliveryOption}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between items-center w-full mb-5 gap-3 sm:flex-row md:w-[600px] md:gap-0">
          <Link
            to="/contact-us"
            className="text-sm underline dark:text-sky-300 text-sky-700"
          >
            ¿Necesitas ayuda? Ponte en <strong>contacto</strong> con nosotros
          </Link>

          <Link
            to="/products"
            className="bg-amber-600 text-white dark:bg-amber-500 dark:text-black hover:bg-amber-700 dark:hover:bg-amber-600 px-6 rounded-xl border border-transparent hover:shadow-md cursor-pointer py-2 font-bold tracking-wide mt-2 shadow-lg transition-all duration-300 ease-in-out hover:scale-105 outline-2 outline-offset-2 outline-amber-600 dark:outline-amber-500"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ThankyouPage;
