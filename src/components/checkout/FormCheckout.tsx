import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, type CheckoutFormValues } from "@/lib/validators";
import { ItemsCheckout } from "./ItemsCheckout";
import { useDeliverys } from "@/hooks";
import { useCartStore } from "@/store/cart.store";
import { Separator } from "@/components/shared/Separator";
import { Loader } from "@/components/shared/Loader";
import { ChevronLeft, MapPin, Truck, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabase/client";
import type { CreateOrderPayload } from "@/interfaces/checkout.interface";

interface Props {
  onOrderCreated: (payload: CreateOrderPayload) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const FormCheckout = ({ onOrderCreated, loading, error }: Props) => {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);
  const { deliverys: deliveryOptions, isLoading: loadingDelivery } =
    useDeliverys();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { country: "Venezuela" },
  });

  const onSubmit = handleSubmit(async (data) => {
    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;
    if (!user) return;

    // Guardar dirección en Supabase
    const { data: address, error: addressError } = await supabase
      .from("addresses")
      .insert({
        user_id: user.id,
        address_1: data.address_1,
        address_2: data.address_2 ?? null,
        city: data.city,
        state: data.state,
        country: data.country,
        postal_code: data.postal_code ?? null,
        full_name: data.full_name,
        phone: data.phone,
      })
      .select("id")
      .single();

    if (addressError || !address) {
      console.error("[FormCheckout] Error al guardar dirección:", addressError);
      return;
    }

    await onOrderCreated({
      items: cartItems.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
      })),
      address_id: address.id,
      delivery_option_id: data.delivery_option_id,
      payment_type: data.payment_type,
      promo_code: data.promo_code,
      notes: data.notes,
    });
  });

  if (loadingDelivery) {
    return (
      <div className="flex flex-col gap-3 w-full min-h-[50vh] items-center justify-center">
        <Loader size={50} fullScreen={false} />
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

      <form className="flex flex-col gap-8" onSubmit={onSubmit} noValidate>
        {/* ── Dirección ─────────────────────────────────────────── */}
        <section className="space-y-4">
          <h3 className="font-semibold text-base flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cocoa" />
            Dirección de entrega
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Nombre del destinatario *"
              colSpan={2}
              error={errors.full_name?.message}
            >
              <input
                {...register("full_name")}
                autoComplete="name"
                placeholder="Ej: María González"
                className={input(!!errors.full_name)}
              />
            </Field>

            <Field
              label="Dirección *"
              colSpan={2}
              error={errors.address_1?.message}
            >
              <input
                {...register("address_1")}
                autoComplete="address-line1"
                placeholder="Urb. Las Cayenas, Bloque C, Casa 129"
                className={input(!!errors.address_1)}
              />
            </Field>

            <Field
              label="Apartamento, referencia (opcional)"
              colSpan={2}
              error={errors.address_2?.message}
            >
              <input
                {...register("address_2")}
                autoComplete="address-line2"
                placeholder="Apto 4B, cerca del parque"
                className={input(false)}
              />
            </Field>

            <Field label="Estado *" error={errors.state?.message}>
              <input
                {...register("state")}
                autoComplete="address-level1"
                placeholder="Monagas"
                className={input(!!errors.state)}
              />
            </Field>

            <Field label="Ciudad *" error={errors.city?.message}>
              <input
                {...register("city")}
                autoComplete="address-level2"
                placeholder="Maturín"
                className={input(!!errors.city)}
              />
            </Field>

            <Field label="Código postal" error={undefined}>
              <input
                {...register("postal_code")}
                autoComplete="postal-code"
                placeholder="6201"
                className={input(false)}
              />
            </Field>

            <Field label="País *" error={errors.country?.message}>
              <input
                {...register("country")}
                autoComplete="country-name"
                placeholder="Venezuela"
                className={input(!!errors.country)}
              />
            </Field>

            <Field
              label="Teléfono de contacto *"
              colSpan={2}
              error={errors.phone?.message}
            >
              <input
                {...register("phone")}
                type="tel"
                autoComplete="tel"
                placeholder="0414-1234567"
                className={input(!!errors.phone)}
              />
            </Field>
          </div>
        </section>

        {/* ── Método de envío ────────────────────────────────────── */}
        <section className="space-y-3">
          <h3 className="font-semibold text-base flex items-center gap-2">
            <Truck className="w-4 h-4 text-cocoa" />
            Método de envío
          </h3>
          <div className="space-y-2">
            {deliveryOptions?.map((option) => (
              <label
                key={option.id}
                className="flex items-center gap-3 p-4 rounded-xl border border-cocoa/20 dark:border-cream/10 cursor-pointer hover:border-cocoa/50 transition-colors has-[:checked]:border-cocoa has-[:checked]:bg-cocoa/5"
              >
                <input
                  type="radio"
                  value={option.id}
                  {...register("delivery_option_id")}
                  className="accent-cocoa"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{option.name}</p>
                  {option.estimated_time && (
                    <p className="text-xs text-choco/50 dark:text-cream/50">
                      {option.estimated_time}
                    </p>
                  )}
                </div>
                <span className="text-sm font-semibold">
                  {Number(option.price) === 0
                    ? "Gratis"
                    : `Bs. ${Number(option.price).toFixed(2)}`}
                </span>
              </label>
            ))}
          </div>
          {errors.delivery_option_id && (
            <p className="text-red-400 text-xs">
              {errors.delivery_option_id.message}
            </p>
          )}
        </section>

        {/* ── Método de pago ─────────────────────────────────────── */}
        <section className="space-y-3">
          <h3 className="font-semibold text-base flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-cocoa" />
            Método de pago
          </h3>
          <div className="space-y-2">
            {(["pago_movil", "transferencia"] as const).map((type) => (
              <label
                key={type}
                className="flex items-center gap-3 p-4 rounded-xl border border-cocoa/20 dark:border-cream/10 cursor-pointer hover:border-cocoa/50 transition-colors has-[:checked]:border-cocoa has-[:checked]:bg-cocoa/5"
              >
                <input
                  type="radio"
                  value={type}
                  {...register("payment_type")}
                  className="accent-cocoa"
                />
                <div>
                  <p className="text-sm font-medium">
                    {type === "pago_movil"
                      ? "Pago móvil"
                      : "Transferencia bancaria"}
                  </p>
                  <p className="text-xs text-choco/50 dark:text-cream/50">
                    {type === "pago_movil"
                      ? "Transferencia desde tu app bancaria"
                      : "Depósito directo a cuenta bancaria"}
                  </p>
                </div>
              </label>
            ))}
          </div>
          {errors.payment_type && (
            <p className="text-red-400 text-xs">
              {errors.payment_type.message}
            </p>
          )}
        </section>

        {/* ── Código promocional ─────────────────────────────────── */}
        <Field label="Código promocional (opcional)" error={undefined}>
          <input
            {...register("promo_code")}
            placeholder="Ej: VERANO10"
            className={input(false)}
          />
        </Field>

        {/* ── Notas ──────────────────────────────────────────────── */}
        <Field label="Notas del pedido (opcional)" error={undefined}>
          <textarea
            {...register("notes")}
            rows={2}
            placeholder="Instrucciones especiales para la entrega..."
            className={`${input(false)} resize-none`}
          />
        </Field>

        {/* Resumen móvil */}
        <div className="lg:hidden flex flex-col gap-3">
          <h3 className="font-semibold text-lg">Resumen del pedido</h3>
          <Separator />
          <ItemsCheckout />
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-400/10 px-4 py-3 rounded-xl">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !deliveryOptions?.length}
          className="w-full py-3.5 px-6 rounded-xl font-bold tracking-wide text-sm bg-choco text-cream hover:bg-cocoa dark:bg-cream dark:text-oscuro dark:hover:bg-butter transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
          ) : (
            "Confirmar Pedido"
          )}
        </button>
      </form>
    </div>
  );
};

// ─── Helpers UI ───────────────────────────────────────────────────────────────

const input = (hasError: boolean) =>
  `w-full bg-cream/50 dark:bg-cream/5 border ${
    hasError
      ? "border-red-400 focus:border-red-400"
      : "border-cocoa/20 dark:border-cream/10 focus:border-cocoa"
  } rounded-xl px-4 py-3 text-choco dark:text-cream placeholder:text-choco/40 dark:placeholder:text-cream/30 focus:outline-none transition-colors text-sm`;

interface FieldProps {
  label: string;
  error: string | undefined;
  colSpan?: 1 | 2;
  children: React.ReactNode;
}

const Field = ({ label, error, colSpan = 1, children }: FieldProps) => (
  <div className={`space-y-1 ${colSpan === 2 ? "col-span-2" : ""}`}>
    <label className="text-sm text-choco/60 dark:text-cream/60">{label}</label>
    {children}
    {error && <p className="text-red-400 text-xs">{error}</p>}
  </div>
);