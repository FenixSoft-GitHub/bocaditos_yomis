import { Loader } from "@/components/shared/Loader";
import DOMPurify from "dompurify";
import {
  useCategories,
  useCreateProduct,
  useUpdateProduct,
  usePromo,
} from "@/hooks";
import { ProductFormValues, productSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import {
  X,
  Save,
  Tag,
  Package,
  DollarSign,
  BarChart2,
  Image,
  AlignLeft,
  ChevronLeft,
  Percent,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { InputForm } from "./InputForm";
import { UploaderImages } from "./UploaderImages";
import { useEffect, useState } from "react";
import { generateSlug } from "@/helpers";
import toast from "react-hot-toast";
import {
  useCreateDiscount,
  useUpdateDiscount,
  useDeleteDiscount,
} from "@/hooks";

interface Props {
  title: string;
  initialData?: ProductFormValues | null;
}

const sectionClass =
  "bg-cream dark:bg-oscuro border border-cocoa/20 dark:border-cream/10 rounded-xl p-5 flex flex-col gap-4";
const labelClass =
  "block text-xs font-semibold uppercase tracking-wider text-choco/60 dark:text-cream/60 mb-1.5";
const inputClass = `w-full px-3 py-2.5 text-sm rounded-lg border transition-all duration-200
  bg-fondo dark:bg-fondo-dark text-choco dark:text-cream
  placeholder:text-choco/40 dark:placeholder:text-cream/40
  border-cocoa/30 dark:border-cream/20
  focus:outline-none focus:ring-2 focus:ring-choco/20 dark:focus:ring-cream/20
  disabled:opacity-50 disabled:cursor-not-allowed`;

const SectionTitle = ({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) => (
  <div className="flex items-center gap-2 pb-1 border-b border-cocoa/10 dark:border-cream/10">
    <Icon className="size-4 text-choco/50 dark:text-cream/50" />
    <span className="text-xs font-semibold uppercase tracking-wider text-choco/60 dark:text-cream/60">
      {label}
    </span>
  </div>
);

export const FormProduct = ({ title, initialData }: Props) => {
  const navigate = useNavigate();
  const isEditing = !!initialData;

  // Mode: "manual" = campos manuales, "promo" = elegir de promociones existentes
  const [discountMode, setDiscountMode] = useState<"manual" | "promo">(
    "manual",
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
    control,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      has_discount: initialData?.discount ? true : false,
      discount: initialData?.discount
        ? {
            id: initialData.discount.id,
            discount_type: initialData.discount.discount_type || "percentage",
            value: initialData.discount.value || 0,
            starts_at: initialData.discount.starts_at
              ? new Date(initialData.discount.starts_at)
              : undefined,
            ends_at: initialData.discount.ends_at
              ? new Date(initialData.discount.ends_at)
              : undefined,
          }
        : undefined,
      name: initialData?.name || "",
      price: initialData?.price || 0,
      stock: initialData?.stock || 0,
      category_id: initialData?.category_id || "",
      description: initialData?.description || "",
      image_url: initialData?.image_url || [],
      slug: initialData?.slug || "",
    },
  });

  const {
    categories,
    isLoading: isLoadingCat,
    isError: isErrorCat,
  } = useCategories();
  const { promotions, isLoading: isLoadingPromo } = usePromo();

  const { mutateAsync: createProduct, isPending: isCreating } =
    useCreateProduct();
  const { mutateAsync: updateProduct, isPending: isUpdating } =
    useUpdateProduct();
  const { mutateAsync: createDiscount, isPending: isCreatingD } =
    useCreateDiscount();
  const { mutateAsync: updateDiscount, isPending: isUpdatingD } =
    useUpdateDiscount();
  const { mutateAsync: deleteDiscount, isPending: isDeletingD } =
    useDeleteDiscount();

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        has_discount: initialData.discount ? true : false,
        discount: initialData.discount
          ? {
              id: initialData.discount.id,
              discount_type: initialData.discount.discount_type || "percentage",
              value: initialData.discount.value || 0,
              starts_at: initialData.discount.starts_at
                ? new Date(initialData.discount.starts_at)
                : undefined,
              ends_at: initialData.discount.ends_at
                ? new Date(initialData.discount.ends_at)
                : undefined,
            }
          : undefined,
      });
    }
  }, [initialData, reset]);

  const hasDiscount = watch("has_discount");
  const watchName = watch("name");

  useEffect(() => {
    if (!watchName) {
      setValue("slug", "", { shouldValidate: true });
      return;
    }
    setValue("slug", generateSlug(watchName), { shouldValidate: true });
  }, [watchName, setValue]);

  // Cuando el usuario elige una promo existente, rellena los campos del descuento
  const handlePromoSelect = (promoId: string) => {
    const promo = promotions?.find((p) => p.id === promoId);
    if (!promo) return;
    setValue("discount.discount_type", "percentage");
    setValue("discount.value", promo.discount_percent ?? 0);
    setValue(
      "discount.starts_at",
      promo.valid_from ? new Date(promo.valid_from) : undefined,
    );
    setValue(
      "discount.ends_at",
      promo.valid_until ? new Date(promo.valid_until) : undefined,
    );
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const sanitizedDescription = DOMPurify.sanitize(data.description, {
        ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br", "ul", "ol", "li"],
        ALLOWED_ATTR: [],
      });
      data.description = sanitizedDescription;
      const currentProductId = initialData?.id ?? "";
      const { has_discount, discount, ...productData } = data;

      if (isEditing) {
        await updateProduct({ id: currentProductId, data: productData });
        if (has_discount && discount) {
          const payload = {
            discount_type: discount.discount_type,
            value: discount.value,
            starts_at: discount.starts_at,
            ends_at: discount.ends_at,
          };
          if (initialData?.discount?.id) {
            await updateDiscount({
              id: initialData.discount.id,
              data: { ...payload, product_id: currentProductId },
            });
          } else {
            await createDiscount({ ...payload, product_id: currentProductId });
          }
        } else if (!has_discount && initialData?.discount?.id) {
          await deleteDiscount(initialData.discount.id);
        }
      } else {
        const created = await createProduct({
          name: productData.name,
          price: productData.price,
          stock: productData.stock as number,
          category_id: productData.category_id,
          description: productData.description,
          images: productData.image_url,
          slug: productData.slug,
        });
        if (has_discount && discount && created?.id) {
          await createDiscount({
            discount_type: discount.discount_type,
            value: discount.value,
            starts_at: discount.starts_at,
            ends_at: discount.ends_at,
            product_id: created.id,
          });
        }
        reset();
      }
      toast.success(isEditing ? "¡Producto actualizado!" : "¡Producto creado!");
      navigate("/dashboard/products");
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al guardar el producto.");
    }
  });

  const isBusy =
    isCreating ||
    isUpdating ||
    isCreatingD ||
    isUpdatingD ||
    isDeletingD ||
    isLoadingCat;

  if (isBusy && !isSubmitting) return <Loader size={60} />;
  if (isErrorCat)
    return <div className="text-red-500 p-4">Error al cargar categorías</div>;
  if (!categories?.length)
    return (
      <div className="p-4 text-choco dark:text-cream">
        No hay categorías. Crea una primero.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 text-choco dark:text-cream">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard/products")}
            className="p-2 rounded-lg bg-cocoa/10 dark:bg-cream/10 hover:bg-cocoa/20 dark:hover:bg-cream/20 transition-colors"
          >
            <ChevronLeft className="size-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-xs text-choco/50 dark:text-cream/50 mt-0.5">
              {isEditing
                ? "Modifica los datos del producto"
                : "Completa los datos para crear un nuevo producto"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={isBusy}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-cocoa/30 dark:border-cream/20 text-sm font-medium text-choco/70 dark:text-cream/70 hover:bg-cocoa/10 dark:hover:bg-cream/10 transition-all disabled:opacity-50"
          >
            <X className="size-4" /> Cancelar
          </button>
          <button
            type="submit"
            form="product-form"
            disabled={isBusy}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-choco text-cream dark:bg-cream dark:text-oscuro hover:bg-cocoa dark:hover:bg-butter text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm disabled:opacity-50 disabled:scale-100"
          >
            <Save className="size-4" />
            {isSubmitting || isBusy ? "Guardando..." : "Guardar Producto"}
          </button>
        </div>
      </div>

      <form
        id="product-form"
        onSubmit={onSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-5"
      >
        {/* Columna principal */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Identificación */}
          <div className={sectionClass}>
            <SectionTitle icon={Package} label="Identificación del Producto" />
            <InputForm
              type="text"
              placeholder="Ej: Galletas de Mantequilla"
              label="Nombre del Producto"
              name="name"
              register={register}
              errors={errors}
              disabled={isBusy}
              required
              className="w-full"
            />
            <InputForm
              type="text"
              label="Slug"
              name="slug"
              placeholder="galletas-de-mantequilla"
              register={register}
              errors={errors}
              disabled={isBusy}
              className="w-full"
            />
          </div>

          {/* Imágenes */}
          <div className={sectionClass}>
            <SectionTitle icon={Image} label="Imágenes del Producto" />
            <UploaderImages
              errors={errors}
              setValue={setValue}
              watch={watch}
              disabled={isBusy}
            />
          </div>

          {/* Descripción */}
          <div className={sectionClass}>
            <SectionTitle icon={AlignLeft} label="Descripción" />
            <div>
              <label className={labelClass}>Descripción del producto</label>
              <textarea
                {...register("description")}
                rows={4}
                placeholder="Describe el producto: ingredientes, presentación, sabor..."
                disabled={isBusy}
                className={`${inputClass} resize-y`}
              />
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Columna lateral */}
        <div className="flex flex-col gap-5">
          {/* Detalles */}
          <div className={sectionClass}>
            <SectionTitle icon={BarChart2} label="Detalles" />

            <div>
              <label htmlFor="category_id" className={labelClass}>
                Categoría
              </label>
              <select
                id="category_id"
                {...register("category_id")}
                disabled={isBusy || isLoadingCat}
                className={inputClass}
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.category_id.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <InputForm
                  type="number"
                  label="Precio"
                  name="price"
                  placeholder="0.00"
                  step="0.01"
                  register={register}
                  errors={errors}
                  disabled={isBusy}
                  required
                  className="w-full"
                  icon={<DollarSign className="size-3 inline mr-1" />}
                />
              </div>
              <div>
                <InputForm
                  type="number"
                  label="Stock"
                  name="stock"
                  placeholder="0"
                  register={register}
                  errors={errors}
                  disabled={isBusy}
                  required
                  className="w-full"
                  icon={<Package className="size-3 inline mr-1" />}
                />
              </div>
            </div>
          </div>

          {/* Descuentos */}
          <div className={sectionClass}>
            <SectionTitle icon={Percent} label="Descuento" />

            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                className={`relative w-10 h-6 rounded-full transition-colors duration-200 ${hasDiscount ? "bg-choco dark:bg-cream" : "bg-cocoa/20 dark:bg-cream/20"}`}
              >
                <input
                  type="checkbox"
                  {...register("has_discount")}
                  disabled={isBusy}
                  className="sr-only"
                />
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-cream dark:bg-oscuro rounded-full shadow transition-transform duration-200 ${hasDiscount ? "translate-x-4" : ""}`}
                />
              </div>
              <span className="text-sm font-medium">Activar descuento</span>
            </label>

            {hasDiscount && (
              <div className="flex flex-col gap-3 pt-2 border-t border-cocoa/10 dark:border-cream/10">
                {/* Selector de modo */}
                <div className="flex rounded-lg bg-cocoa/10 dark:bg-cream/10 p-1 gap-1">
                  <button
                    type="button"
                    onClick={() => setDiscountMode("manual")}
                    className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      discountMode === "manual"
                        ? "bg-choco text-cream dark:bg-cream dark:text-oscuro shadow-sm"
                        : "text-choco/60 dark:text-cream/60 hover:text-choco dark:hover:text-cream"
                    }`}
                  >
                    Manual
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiscountMode("promo")}
                    className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      discountMode === "promo"
                        ? "bg-choco text-cream dark:bg-cream dark:text-oscuro shadow-sm"
                        : "text-choco/60 dark:text-cream/60 hover:text-choco dark:hover:text-cream"
                    }`}
                  >
                    Desde Promoción
                  </button>
                </div>

                {/* Modo: elegir de promociones */}
                {discountMode === "promo" && (
                  <div>
                    <label className={labelClass}>
                      <Tag className="size-3 inline mr-1" />
                      Elegir Promoción
                    </label>
                    <select
                      onChange={(e) => handlePromoSelect(e.target.value)}
                      disabled={isLoadingPromo || isBusy}
                      className={inputClass}
                      defaultValue=""
                    >
                      <option value="">Selecciona una promoción...</option>
                      {promotions
                        ?.filter((p) => p.is_active)
                        .map((promo) => (
                          <option key={promo.id} value={promo.id}>
                            {promo.code} — {promo.discount_percent}% OFF
                          </option>
                        ))}
                    </select>
                    <p className="text-[11px] text-choco/40 dark:text-cream/40 mt-1">
                      Solo se muestran las promociones activas. Los valores se
                      cargarán automáticamente.
                    </p>
                  </div>
                )}

                {/* Campos del descuento (tanto manual como desde promo) */}
                <div>
                  <label className={labelClass}>Tipo de Descuento</label>
                  <select
                    {...register("discount.discount_type")}
                    disabled={isBusy}
                    className={inputClass}
                  >
                    <option value="">Selecciona un tipo</option>
                    <option value="percentage">Porcentaje (%)</option>
                    <option value="fixed">Monto fijo ($)</option>
                  </select>
                  {errors.discount?.discount_type && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.discount.discount_type.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Valor del Descuento</label>
                  <Controller
                    control={control}
                    name="discount.value"
                    render={({ field }) => (
                      <input
                        type="number"
                        step="0.01"
                        disabled={isBusy}
                        placeholder={
                          watch("discount.discount_type") === "percentage"
                            ? "Ej: 10 (para 10%)"
                            : "Ej: 5.00 (para $5)"
                        }
                        className={inputClass}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : parseFloat(e.target.value),
                          )
                        }
                        onBlur={field.onBlur}
                        ref={field.ref}
                      />
                    )}
                  />
                  {errors.discount?.value && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.discount.value.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className={labelClass}>Inicia el</label>
                    <Controller
                      control={control}
                      name="discount.starts_at"
                      render={({ field }) => (
                        <input
                          type="datetime-local"
                          disabled={isBusy}
                          className={inputClass}
                          value={
                            field.value instanceof Date &&
                            !isNaN(field.value.getTime())
                              ? field.value.toISOString().slice(0, 16)
                              : ""
                          }
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? new Date(e.target.value)
                                : undefined,
                            )
                          }
                          onBlur={field.onBlur}
                          ref={field.ref}
                        />
                      )}
                    />
                    {errors.discount?.starts_at && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.discount.starts_at.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>Termina el</label>
                    <Controller
                      control={control}
                      name="discount.ends_at"
                      render={({ field }) => (
                        <input
                          type="datetime-local"
                          disabled={isBusy}
                          className={inputClass}
                          value={
                            field.value instanceof Date &&
                            !isNaN(field.value.getTime())
                              ? field.value.toISOString().slice(0, 16)
                              : ""
                          }
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? new Date(e.target.value)
                                : undefined,
                            )
                          }
                          onBlur={field.onBlur}
                          ref={field.ref}
                        />
                      )}
                    />
                    {errors.discount?.ends_at && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.discount.ends_at.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};