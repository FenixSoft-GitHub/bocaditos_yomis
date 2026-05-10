import { Link, useParams } from "react-router-dom";
import { useOrder } from "@/hooks";
import { Loader } from "@/components/shared/Loader";
import { formatPrice, formatToTwoDecimals } from "@/helpers";
import { ShieldCheck, PackageCheck, ArrowRight } from "lucide-react";

const ThankyouPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useOrder(String(id));

  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center text-choco dark:text-cream">
        <p>
          Error al cargar la orden.{" "}
          <Link to="/products" className="underline">
            Volver a productos
          </Link>
        </p>
      </div>
    );

  if (isLoading || !data) return <Loader size={50} />;

  return (
    <main className="min-h-screen bg-fondo dark:bg-fondo-dark text-choco dark:text-cream px-4 py-10">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        <div className="text-center flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <PackageCheck className="size-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold">
            ¡Gracias, {data.user.full_name}!
          </h1>
          <p className="text-sm text-choco/60 dark:text-cream/60">
            Tu pedido fue confirmado. Pronto nos pondremos en contacto contigo.
          </p>
        </div>

        <div className="border border-cocoa/30 dark:border-cream/20 rounded-xl p-5 space-y-3 bg-cream/50 dark:bg-cream/5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-choco dark:text-cocoa" />
            <h2 className="font-semibold">Datos para tu transferencia</h2>
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
          <p className="text-xs text-choco/60 dark:text-cream/50 pt-1">
            Envía tu comprobante a <strong>ventas@bocaditosyomis.com</strong>{" "}
            para procesar tu entrega.
          </p>
        </div>

        <div className="border border-cocoa/30 dark:border-cream/20 rounded-xl overflow-hidden">
          <div className="bg-cocoa/10 dark:bg-cream/10 px-5 py-3">
            <h2 className="font-semibold">Detalles del pedido</h2>
          </div>
          <div className="p-5 space-y-5">
            <ul className="space-y-4">
              {data.orderItems.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-4 py-2 border-b border-cocoa/10 dark:border-cream/10 last:border-0"
                >
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-14 h-14 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">
                      {item.productName}
                    </p>
                    <p className="text-xs text-choco/50 dark:text-cream/50">
                      {formatPrice(item.unit_price)} ×{" "}
                      {formatToTwoDecimals(item.quantity)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold shrink-0">
                    {formatPrice(item.subtotal)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="flex justify-between font-bold text-base pt-2">
              <span>Total</span>
              <span>{formatPrice(data.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="font-semibold text-xs uppercase tracking-wider text-choco/50 dark:text-cream/50">
              Contacto
            </p>
            <p>{data.user.email}</p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-xs uppercase tracking-wider text-choco/50 dark:text-cream/50">
              Método de pago
            </p>
            <p>Depósito bancario</p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-xs uppercase tracking-wider text-choco/50 dark:text-cream/50">
              Dirección
            </p>
            <p>{data.address.address_1}</p>
            {data.address.address_2 && <p>{data.address.address_2}</p>}
            <p>
              {data.address.city}, {data.address.state}
            </p>
            <p>{data.address.country}</p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-xs uppercase tracking-wider text-choco/50 dark:text-cream/50">
              Envío
            </p>
            <p>{data.deliveryOption}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
          <Link
            to="/contact-us"
            className="text-sm text-choco/60 dark:text-cream/60 hover:text-choco dark:hover:text-cream underline underline-offset-4 transition-colors"
          >
            ¿Necesitas ayuda? Contáctanos
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 btn-primary px-6 py-3 rounded-full text-sm"
          >
            Seguir comprando
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ThankyouPage;
