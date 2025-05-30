import { Loader } from "@/components/shared/Loader";
import { useCategories, useCreateProduct, useUpdateProduct } from "@/hooks";
import { ProductFormValues, productSchema } from "@/lib/validators"; 
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form"; 
import { MdOutlineCancel, MdOutlineSaveAlt } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { SectionFormProduct } from "./SectionFormProduct";
import { InputForm } from "./InputForm";
import { UploaderImages } from "./UploaderImages";
import { useEffect } from "react";
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

export const FormProduct = ({ title, initialData }: Props) => {
  const navigate = useNavigate();
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
    control, // Asegúrate de que 'control' esté destructurado aquí
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
              : undefined, // Pasa Date object, no string formateada
            ends_at: initialData.discount.ends_at
              ? new Date(initialData.discount.ends_at)
              : undefined, // Pasa Date object, no string formateada
          }
        : undefined, // Si no hay descuento inicial, el campo 'discount' es undefined
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
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useCategories();

  const { mutateAsync: createProduct, isPending: isCreatingProduct } =
    useCreateProduct();
  const { mutateAsync: updateProduct, isPending: isUpdatingProduct } =
    useUpdateProduct();

  const { mutateAsync: createDiscount, isPending: isCreatingDiscount } =
    useCreateDiscount();
  const { mutateAsync: updateDiscount, isPending: isUpdatingDiscount } =
    useUpdateDiscount();
  const { mutateAsync: deleteDiscount, isPending: isDeletingDiscount } =
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

  const onSubmit = handleSubmit(async (data) => {
    try {
      const currentProductId = initialData?.id ?? "";

      const { has_discount, discount, ...productData } = data;

      if (isEditing) {
        await updateProduct({ id: currentProductId, data: productData });

        if (has_discount && discount) {
          // En este punto, discount.starts_at y discount.ends_at ya son objetos Date
          // gracias a z.coerce.date() en tu esquema.
          const discountPayload = {
            discount_type: discount.discount_type,
            value: discount.value,
            starts_at: discount.starts_at, // Pasa el objeto Date directamente
            ends_at: discount.ends_at, // Pasa el objeto Date directamente
          };

          if (initialData?.discount?.id) {
            await updateDiscount({
              id: initialData.discount.id,
              data: { ...discountPayload, product_id: currentProductId },
            });
          } else {
            await createDiscount({
              ...discountPayload,
              product_id: currentProductId,
            });
          }
        } else if (!has_discount && initialData?.discount?.id) {
          await deleteDiscount(initialData.discount.id);
        }
      } else {
        const createdProductResponse = await createProduct({
          name: productData.name,
          price: productData.price,
          stock: productData.stock as number,
          category_id: productData.category_id,
          description: productData.description,
          images: productData.image_url,
          slug: productData.slug,
        });

        if (has_discount && discount && createdProductResponse?.id) {
          const discountPayload = {
            discount_type: discount.discount_type,
            value: discount.value,
            starts_at: discount.starts_at, // Pasa el objeto Date directamente
            ends_at: discount.ends_at, // Pasa el objeto Date directamente
          };
          await createDiscount({
            ...discountPayload,
            product_id: createdProductResponse.id,
          });
        }
        reset();
      }
      // toast.success(
      //   isEditing
      //     ? "Producto y descuentos actualizados!"
      //     : "Producto y descuentos creados!"
      // );
      navigate("/dashboard/products");
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error en el envío del formulario");
    }
  });

  const watchName = watch("name");

  useEffect(() => {
    if (!watchName) {
      setValue("slug", "", { shouldValidate: true });
      return;
    }

    const generatedSlug = generateSlug(watchName);
    setValue("slug", generatedSlug, { shouldValidate: true });
  }, [watchName, setValue]);

  const isLoading =
    isLoadingCategories ||
    isCreatingProduct ||
    isUpdatingProduct ||
    isCreatingDiscount ||
    isUpdatingDiscount ||
    isDeletingDiscount;

  if (isLoading) return <Loader size={60} />;
  if (isErrorCategories) return <div>Error al cargar categorías</div>;
  if (!categories || categories.length === 0)
    return <div>No se encontraron categorías. Por favor, crea una.</div>;

  return (
    <section className="flex flex-col gap-6 relative bg-fondo text-choco dark:bg-fondo-dark dark:text-cream px-4 rounded-lg shadow-md">
      <header className="flex justify-between items-center flex-col gap-2.5 md:flex-row md:gap-5">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-bold text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)] tracking-tight capitalize">
            {title}
          </h2>
        </div>
        <div className="flex flex-col gap-2.5 md:flex-row md:gap-5 top-0 right-0">
          <button
            className="inline-flex items-center gap-2 px-4 py-2 bg-cocoa hover:bg-cocoa/90 text-white text-sm font-medium rounded-md transition"
            type="button"
            onClick={() => navigate(-1)}
            disabled={isLoading}
          >
            <MdOutlineCancel size={19} />
            Cancelar
          </button>
          <button
            type="submit"
            form="your-form-id"
            className="inline-flex items-center gap-2 px-4 py-2 bg-cocoa hover:bg-cocoa/90 text-white text-sm font-medium rounded-md transition"
            disabled={isLoading}
          >
            <MdOutlineSaveAlt size={19} />
            {isSubmitting || isLoading ? "Guardando..." : "Guardar Producto"}
          </button>
        </div>
      </header>

      <form
        onSubmit={onSubmit}
        id="your-form-id"
        className="grid grid-cols-1 lg:grid-cols-6 gap-5 auto-rows-max flex-1 items-stretch"
      >
        <SectionFormProduct
          titleSection="Identificación del Producto"
          className="h-full flex flex-col justify-between lg:col-span-3"
        >
          <InputForm
            type="text"
            placeholder="Ejemplo: Chocolate Nestlet"
            label="nombre"
            name="name"
            register={register}
            errors={errors}
            className="w-full"
            required
            disabled={isLoading}
          />

          <div className="h-full"></div>

          <InputForm
            type="text"
            label="Slug"
            name="slug"
            placeholder="galleta-tipo-new-york"
            register={register}
            errors={errors}
            className="w-full"
            disabled={isLoading}
          />
          <div className="h-full"></div>
        </SectionFormProduct>

        <SectionFormProduct
          titleSection="Detalles del Producto"
          className="h-full flex flex-col justify-between lg:col-span-3"
        >
          <div className="w-full">
            <label
              htmlFor="category_id"
              className="text-xs font-bold tracking-tight capitalize"
            >
              Categoría:
            </label>
            <select
              id="category_id"
              {...register("category_id")}
              className="w-full rounded-md border border-cocoa/30 dark:border-cream/30 bg-transparent mt-1 px-2 py-2 font-medium text-sm focus:ring-2 focus:ring-cocoa/50 dark:focus:ring-cream/70 placeholder:text-choco/60 dark:placeholder:text-cream/60 dark:focus:border-cream/50 focus:border-cocoa/90"
              disabled={isLoading || isLoadingCategories}
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="text-red-500 text-sm">
                {errors.category_id.message}
              </p>
            )}
          </div>

          <InputForm
            type="number"
            label="Precio"
            name="price"
            placeholder="0,00"
            step="0.01"
            register={register}
            errors={errors}
            required
            className="w-full"
            disabled={isLoading}
          />

          <InputForm
            type="number"
            label="Stock"
            name="stock"
            placeholder="0"
            register={register}
            errors={errors}
            required
            className="w-full"
            disabled={isLoading}
          />
        </SectionFormProduct>

        <SectionFormProduct
          titleSection="Descuentos del Producto"
          className="h-full flex flex-col justify-start lg:col-span-3"
        >
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id="has_discount"
              {...register("has_discount")}
              className="h-4 w-4 text-cocoa focus:ring-cocoa border-gray-300 rounded"
              disabled={isLoading}
            />
            <label
              htmlFor="has_discount"
              className="text-sm font-medium text-choco dark:text-cream"
            >
              Activar Descuento
            </label>
          </div>

          {hasDiscount && (
            <>
              <div className="w-full">
                <label
                  htmlFor="discount.discount_type"
                  className="text-xs font-bold tracking-tight capitalize"
                >
                  Tipo de Descuento:
                </label>
                <select
                  id="discount.discount_type"
                  {...register("discount.discount_type")}
                  className="w-full rounded-md border border-cocoa/30 dark:border-cream/30 bg-transparent mt-1 px-2 py-2 font-medium text-sm focus:ring-2 focus:ring-cocoa/50 dark:focus:ring-cream/70 placeholder:text-choco/60 dark:placeholder:text-cream/60 dark:focus:border-cream/50 focus:border-cocoa/90"
                  disabled={isLoading}
                >
                  <option value="">Selecciona un tipo</option>
                  <option value="percentage">Porcentaje</option>
                  <option value="fixed">Fijo</option>
                </select>
                {errors.discount?.discount_type && (
                  <p className="text-red-500 text-sm">
                    {errors.discount.discount_type.message}
                  </p>
                )}
              </div>

              {/* Uso de Controller para discount.value con input HTML estándar */}
              <div className="w-full">
                <label
                  htmlFor="discount.value"
                  className="text-xs font-bold tracking-tight capitalize"
                >
                  Valor del Descuento:
                </label>
                <Controller
                  control={control}
                  name="discount.value"
                  render={({ field }) => (
                    <input
                      id="discount.value"
                      type="number"
                      step="0.01"
                      placeholder={
                        watch("discount.discount_type") === "percentage"
                          ? "Ej: 10 (para 10%)"
                          : "Ej: 5.00 (para $5.00)"
                      }
                      className={`w-full rounded-md border bg-transparent mt-1 px-2 py-2 font-medium text-sm focus:ring-2 placeholder:text-choco/60 dark:placeholder:text-cream/60 outline-none transition-all duration-300 ease-in-out ${
                        errors.discount?.value
                          ? "border-red-500 focus:ring-red-500"
                          : "border-cocoa/70 dark:border-cream/30 focus:ring-cocoa/50 dark:focus:ring-cream/70 focus:border-cocoa/90 dark:focus:border-cream/50"
                      }`}
                      disabled={isLoading}
                      value={field.value ?? ""} // Usar ?? "" para manejar null/undefined en inputs numéricos
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? undefined : parseFloat(value));
                      }}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  )}
                />
                {errors.discount?.value && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.discount.value.message}
                  </p>
                )}
              </div>

              {/* Uso de Controller para starts_at con input HTML estándar */}
              <div className="w-full">
                <label
                  htmlFor="discount.starts_at"
                  className="text-xs font-bold tracking-tight capitalize"
                >
                  Inicia en:
                </label>
                <Controller
                  control={control}
                  name="discount.starts_at"
                  render={({ field }) => (
                    <input
                      id="discount.starts_at"
                      type="datetime-local"
                      className={`w-full rounded-md border bg-transparent mt-1 px-2 py-2 font-medium text-sm focus:ring-2 placeholder:text-choco/60 dark:placeholder:text-cream/60 outline-none transition-all duration-300 ease-in-out ${
                        errors.discount?.starts_at
                          ? "border-red-500 focus:ring-red-500"
                          : "border-cocoa/70 dark:border-cream/30 focus:ring-cocoa/50 dark:focus:ring-cream/70 focus:border-cocoa/90 dark:focus:border-cream/50"
                      }`}
                      disabled={isLoading}
                      value={
                        field.value instanceof Date &&
                        !isNaN(field.value.getTime())
                          ? field.value.toISOString().slice(0, 16)
                          : ""
                      }
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        field.onChange(
                          e.target.value ? new Date(e.target.value) : undefined
                        )
                      }
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  )}
                />
                {errors.discount?.starts_at && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.discount.starts_at.message}
                  </p>
                )}
              </div>

              {/* Uso de Controller para ends_at con input HTML estándar */}
              <div className="w-full">
                <label
                  htmlFor="discount.ends_at"
                  className="text-xs font-bold tracking-tight capitalize"
                >
                  Termina en:
                </label>
                <Controller
                  control={control}
                  name="discount.ends_at"
                  render={({ field }) => (
                    <input
                      id="discount.ends_at"
                      type="datetime-local"
                      className={`w-full rounded-md border bg-transparent mt-1 px-2 py-2 font-medium text-sm focus:ring-2 placeholder:text-choco/60 dark:placeholder:text-cream/60 outline-none transition-all duration-300 ease-in-out ${
                        errors.discount?.ends_at
                          ? "border-red-500 focus:ring-red-500"
                          : "border-cocoa/70 dark:border-cream/30 focus:ring-cocoa/50 dark:focus:ring-cream/70 focus:border-cocoa/90 dark:focus:border-cream/50"
                      }`}
                      disabled={isLoading}
                      value={
                        field.value instanceof Date &&
                        !isNaN(field.value.getTime())
                          ? field.value.toISOString().slice(0, 16)
                          : ""
                      }
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        field.onChange(
                          e.target.value ? new Date(e.target.value) : undefined
                        )
                      }
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  )}
                />
                {errors.discount?.ends_at && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.discount.ends_at.message}
                  </p>
                )}
              </div>
            </>
          )}
        </SectionFormProduct>

        <SectionFormProduct
          titleSection="Imágenes del producto"
          className="h-full flex flex-col gap-5 lg:col-span-3 "
        >
          <UploaderImages
            errors={errors}
            setValue={setValue}
            watch={watch}
            disabled={isLoading}
          />
        </SectionFormProduct>


        <SectionFormProduct
          titleSection="Descripción del producto"
          className="h-full flex flex-col justify-between lg:col-span-6"
        >
          <div>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Descripción del producto"
              className={`w-full px-4 border text-sm border-choco/50 dark:border-cream/10 rounded-md placeholder:font-normal focus:outline-none text-choco bg-cream dark:bg-fondo-dark dark:text-cream dark:focus:border-cream/50 focus:border-cocoa/90 focus:border-2 outline-none transition-all duration-300 ease-in-out${
                errors.description
                  ? "border-red-500"
                  : "border-cocoa/70 dark:border-cream/30 "
              }`}
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
        </SectionFormProduct>
      </form>
    </section>
  );
};

// import { Loader } from "@/components/shared/Loader";
// import { useCategories, useCreateProduct, useUpdateProduct } from "@/hooks";
// import { ProductFormValues, productSchema } from "@/lib/validators"; // productSchema ya debería incluir los campos de descuento
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { MdOutlineCancel, MdOutlineSaveAlt } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import { SectionFormProduct } from "./SectionFormProduct";
// import { InputForm } from "./InputForm";
// import { UploaderImages } from "./UploaderImages";
// import { useEffect } from "react";
// import { generateSlug } from "@/helpers";
// import toast from "react-hot-toast";
// import {
//   useCreateDiscount,
//   useUpdateDiscount,
//   useDeleteDiscount,
// } from "@/hooks";

// interface Props {
//   title: string;
//   initialData?: ProductFormValues | null;
// }

// export const FormProduct = ({ title, initialData }: Props) => {
//   const navigate = useNavigate();
//   const isEditing = !!initialData;

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     setValue,
//     watch,
//     reset,
//   } = useForm<ProductFormValues>({
//     resolver: zodResolver(productSchema),
//     defaultValues: {
//       has_discount: initialData?.discount ? true : false,
//       discount: initialData?.discount
//         ? {
//             id: initialData.discount.id,
//             discount_type: initialData.discount.discount_type || "percentage",
//             value: initialData.discount.value || 0,
//             // CORRECCIÓN AQUÍ: Formatear a string YYYY-MM-DDTHH:mm para el input datetime-local
//             starts_at: initialData.discount.starts_at
//               ? new Date(initialData.discount.starts_at)
//                   .toISOString()
//                   .slice(0, 16)
//               : "", // Si no hay fecha, cadena vacía
//             ends_at: initialData.discount.ends_at
//               ? new Date(initialData.discount.ends_at)
//                   .toISOString()
//                   .slice(0, 16)
//               : "", // Si no hay fecha, cadena vacía
//           }
//         : undefined, // Si no hay descuento inicial, el campo 'discount' es undefined
//       name: initialData?.name || "",
//       price: initialData?.price || 0,
//       stock: initialData?.stock || 0,
//       category_id: initialData?.category_id || "",
//       description: initialData?.description || "",
//       image_url: initialData?.image_url || [],
//       slug: initialData?.slug || "",
//     },
//   });

//   const {
//     categories,
//     isLoading: isLoadingCategories,
//     isError: isErrorCategories,
//   } = useCategories();

//   const { mutateAsync: createProduct, isPending: isCreatingProduct } =
//     useCreateProduct();
//   const { mutateAsync: updateProduct, isPending: isUpdatingProduct } =
//     useUpdateProduct();

//   const { mutateAsync: createDiscount, isPending: isCreatingDiscount } =
//     useCreateDiscount();
//   const { mutateAsync: updateDiscount, isPending: isUpdatingDiscount } =
//     useUpdateDiscount();
//   const { mutateAsync: deleteDiscount, isPending: isDeletingDiscount } =
//     useDeleteDiscount();

//   useEffect(() => {
//     if (initialData) {
//       reset({
//         ...initialData,
//         has_discount: initialData.discount ? true : false,
//         discount: initialData.discount
//           ? {
//               id: initialData.discount.id,
//               discount_type: initialData.discount.discount_type || "percentage",
//               value: initialData.discount.value || 0,
//               // CORRECCIÓN AQUÍ: Formatear a string YYYY-MM-DDTHH:mm para el input datetime-local
//               starts_at: initialData.discount.starts_at
//                 ? new Date(initialData.discount.starts_at)
//                     .toISOString()
//                     .slice(0, 16)
//                 : "",
//               ends_at: initialData.discount.ends_at
//                 ? new Date(initialData.discount.ends_at)
//                     .toISOString()
//                     .slice(0, 16)
//                 : "",
//             }
//           : undefined, // Si no hay descuento inicial, el campo 'discount' es undefined
//       });
//     }
//   }, [initialData, reset]);

//   const hasDiscount = watch("has_discount");

//   const onSubmit = handleSubmit(async (data) => {
//     try {
//       const currentProductId = initialData?.id ?? "";

//       const { has_discount, discount, ...productData } = data;

//       if (isEditing) {
//         await updateProduct({ id: currentProductId, data: productData });

//         if (has_discount && discount) {
//           // En este punto, discount.starts_at y discount.ends_at ya son objetos Date
//           // gracias a z.coerce.date() en tu esquema.
//           const discountPayload = {
//             discount_type: discount.discount_type,
//             value: discount.value,
//             starts_at: discount.starts_at, // Pasa el objeto Date directamente
//             ends_at: discount.ends_at, // Pasa el objeto Date directamente
//           };

//           if (initialData?.discount?.id) {
//             await updateDiscount({
//               id: initialData.discount.id,
//               data: { ...discountPayload, product_id: currentProductId },
//             });
//           } else {
//             await createDiscount({
//               ...discountPayload,
//               product_id: currentProductId,
//             });
//           }
//         } else if (!has_discount && initialData?.discount?.id) {
//           await deleteDiscount(initialData.discount.id);
//         }
//       } else {
//         const createdProductResponse = await createProduct({
//           name: productData.name,
//           price: productData.price,
//           stock: productData.stock as number,
//           category_id: productData.category_id,
//           description: productData.description,
//           images: productData.image_url,
//           slug: productData.slug,
//         });

//         if (has_discount && discount && createdProductResponse?.id) {
//           // En este punto, discount.starts_at y discount.ends_at ya son objetos Date
//           const discountPayload = {
//             discount_type: discount.discount_type,
//             value: discount.value,
//             starts_at: discount.starts_at, // Pasa el objeto Date directamente
//             ends_at: discount.ends_at, // Pasa el objeto Date directamente
//           };
//           await createDiscount({
//             ...discountPayload,
//             product_id: createdProductResponse.id,
//           });
//         }
//         reset();
//       }
//       toast.success(
//         isEditing
//           ? "Producto y descuentos actualizados!"
//           : "Producto y descuentos creados!"
//       );
//       navigate("/dashboard/products");
//     } catch (error) {
//       console.error(error);
//       toast.error("Ocurrió un error en el envío del formulario");
//     }
//   });

//   const watchName = watch("name");

//   useEffect(() => {
//     if (!watchName) {
//       setValue("slug", "", { shouldValidate: true });
//       return;
//     }

//     const generatedSlug = generateSlug(watchName);
//     setValue("slug", generatedSlug, { shouldValidate: true });
//   }, [watchName, setValue]);

//   const isLoading =
//     isLoadingCategories ||
//     isCreatingProduct ||
//     isUpdatingProduct ||
//     isCreatingDiscount ||
//     isUpdatingDiscount ||
//     isDeletingDiscount;

//   if (isLoading) return <Loader size={60} />;
//   if (isErrorCategories) return <div>Error al cargar categorías</div>;
//   if (!categories || categories.length === 0)
//     return <div>No se encontraron categorías. Por favor, crea una.</div>;

//   return (
//     <section className="flex flex-col gap-6 relative bg-fondo text-choco dark:bg-fondo-dark dark:text-cream mt-6 p-4 rounded-lg shadow-md">
//       <header className="flex justify-between items-center flex-col gap-2.5 md:flex-row md:gap-5">
//         <div className="flex items-center gap-3 mb-4">
//           <h2 className="text-2xl font-bold text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)] tracking-tight capitalize">
//             {title}
//           </h2>
//         </div>
//         <div className="flex flex-col gap-2.5 md:flex-row md:gap-5 top-0 right-0">
//           <button
//             className="inline-flex items-center gap-2 px-4 py-2 bg-cocoa hover:bg-cocoa/90 text-white text-sm font-medium rounded-md transition"
//             type="button"
//             onClick={() => navigate(-1)}
//             disabled={isLoading}
//           >
//             <MdOutlineCancel size={19} />
//             Cancelar
//           </button>
//           <button
//             type="submit"
//             form="your-form-id"
//             className="inline-flex items-center gap-2 px-4 py-2 bg-cocoa hover:bg-cocoa/90 text-white text-sm font-medium rounded-md transition"
//             disabled={isLoading}
//           >
//             <MdOutlineSaveAlt size={19} />
//             {isSubmitting || isLoading ? "Guardando..." : "Guardar Producto"}
//           </button>
//         </div>
//       </header>

//       <form
//         onSubmit={onSubmit}
//         id="your-form-id"
//         className="grid grid-cols-1 lg:grid-cols-5 gap-6 auto-rows-max flex-1 items-stretch"
//       >
//         <SectionFormProduct
//           titleSection="Identificación del Producto"
//           className="h-full flex flex-col justify-between lg:col-span-3 "
//         >
//           <InputForm
//             type="text"
//             placeholder="Ejemplo: Chocolate Nestlet"
//             label="nombre"
//             name="name"
//             register={register}
//             errors={errors}
//             className="w-full"
//             required
//             disabled={isLoading}
//           />

//           <div className="h-full"></div>

//           <InputForm
//             type="text"
//             label="Slug"
//             name="slug"
//             placeholder="galleta-tipo-new-york"
//             register={register}
//             errors={errors}
//             className="w-full"
//             disabled={isLoading}
//           />
//           <div className="h-full"></div>
//         </SectionFormProduct>

//         <SectionFormProduct
//           titleSection="Detalles del Producto"
//           className="h-full flex flex-col justify-between lg:col-span-2"
//         >
//           <div className="w-full mt-1">
//             <label
//               htmlFor="category_id"
//               className="text-xs font-bold tracking-tight capitalize"
//             >
//               Categoría:
//             </label>
//             <select
//               id="category_id"
//               {...register("category_id")}
//               className="w-full rounded-md border border-cocoa/30 dark:border-cream/30 bg-transparent mt-1 px-2 py-2 font-medium text-sm focus:ring-2 focus:ring-cocoa/50 dark:focus:ring-cream/70 placeholder:text-choco/60 dark:placeholder:text-cream/60 dark:focus:border-cream/50 focus:border-cocoa/90"
//               disabled={isLoading || isLoadingCategories}
//             >
//               <option value="">Selecciona una categoría</option>
//               {categories.map((cat) => (
//                 <option key={cat.id} value={cat.id}>
//                   {cat.name}
//                 </option>
//               ))}
//             </select>
//             {errors.category_id && (
//               <p className="text-red-500 text-sm">
//                 {errors.category_id.message}
//               </p>
//             )}
//           </div>

//           <InputForm
//             type="number"
//             label="Precio"
//             name="price"
//             placeholder="0,00"
//             step="0.01"
//             register={register}
//             errors={errors}
//             required
//             className="w-full"
//             disabled={isLoading}
//           />

//           <InputForm
//             type="number"
//             label="Stock"
//             name="stock"
//             placeholder="0"
//             register={register}
//             errors={errors}
//             required
//             className="w-full"
//             disabled={isLoading}
//           />
//         </SectionFormProduct>

//         <SectionFormProduct
//           titleSection="Descuentos del Producto"
//           className="h-full flex flex-col justify-start lg:col-span-2"
//         >
//           <div className="flex items-center gap-2 mb-4">
//             <input
//               type="checkbox"
//               id="has_discount"
//               {...register("has_discount")}
//               className="h-4 w-4 text-cocoa focus:ring-cocoa border-gray-300 rounded"
//               disabled={isLoading}
//             />
//             <label
//               htmlFor="has_discount"
//               className="text-sm font-medium text-choco dark:text-cream"
//             >
//               Activar Descuento
//             </label>
//           </div>

//           {hasDiscount && (
//             <>
//               <div className="w-full mt-1">
//                 <label
//                   htmlFor="discount.discount_type"
//                   className="text-xs font-bold tracking-tight capitalize"
//                 >
//                   Tipo de Descuento:
//                 </label>
//                 <select
//                   id="discount.discount_type"
//                   {...register("discount.discount_type")}
//                   className="w-full rounded-md border border-cocoa/30 dark:border-cream/30 bg-transparent mt-1 px-2 py-2 font-medium text-sm focus:ring-2 focus:ring-cocoa/50 dark:focus:ring-cream/70 placeholder:text-choco/60 dark:placeholder:text-cream/60 dark:focus:border-cream/50 focus:border-cocoa/90"
//                   disabled={isLoading}
//                 >
//                   <option value="">Selecciona un tipo</option>
//                   <option value="percentage">Porcentaje</option>
//                   <option value="fixed">Fijo</option>
//                 </select>
//                 {errors.discount?.discount_type && (
//                   <p className="text-red-500 text-sm">
//                     {errors.discount.discount_type.message}
//                   </p>
//                 )}
//               </div>

//               <InputForm
//                 type="number"
//                 label="Valor del Descuento"
//                 name="discount.value"
//                 placeholder={
//                   watch("discount.discount_type") === "percentage"
//                     ? "Ej: 10 (para 10%)"
//                     : "Ej: 5.00 (para $5.00)"
//                 }
//                 step="0.01"
//                 register={register}
//                 errors={errors}
//                 className="w-full"
//                 disabled={isLoading}
//               />

//               <InputForm
//                 type="datetime-local"
//                 label="Inicia en"
//                 name="discount.starts_at"
//                 register={register}
//                 errors={errors}
//                 className="w-full"
//                 disabled={isLoading}
//               />

//               <InputForm
//                 type="datetime-local"
//                 label="Termina en"
//                 name="discount.ends_at"
//                 register={register}
//                 errors={errors}
//                 className="w-full"
//                 disabled={isLoading}
//               />
//             </>
//           )}
//         </SectionFormProduct>

//         <SectionFormProduct
//           titleSection="Descripción del producto"
//           className="h-full flex flex-col justify-between lg:col-span-3 "
//         >
//           <div>
//             <textarea
//               {...register("description")}
//               rows={3}
//               placeholder="Descripción del producto"
//               className={`w-full px-4 py-2 border text-sm border-choco/50 dark:border-cream/10 rounded-md placeholder:font-normal focus:outline-none text-choco bg-cream dark:bg-fondo-dark dark:text-cream dark:focus:border-cream/50 focus:border-cocoa/90 focus:border-2 outline-none transition-all duration-300 ease-in-out${
//                 errors.description
//                   ? "border-red-500"
//                   : "border-cocoa/70 dark:border-cream/30 "
//               }`}
//               disabled={isLoading}
//             />
//             {errors.description && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.description.message}
//               </p>
//             )}
//           </div>
//         </SectionFormProduct>

//         <SectionFormProduct
//           titleSection="Imágenes del producto"
//           className="h-full flex flex-col justify-between lg:col-span-2 "
//         >
//           <UploaderImages
//             errors={errors}
//             setValue={setValue}
//             watch={watch}
//             disabled={isLoading}
//           />
//         </SectionFormProduct>
//       </form>
//     </section>
//   );
// };
//******************************************************************** */
// import { Loader } from "@/components/shared/Loader";
// import { useCategories, useCreateProduct, useUpdateProduct } from "@/hooks";
// import { ProductFormValues, productSchema } from "@/lib/validators"; // productSchema ya debería incluir los campos de descuento
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { MdOutlineCancel, MdOutlineSaveAlt } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import { SectionFormProduct } from "./SectionFormProduct";
// import { InputForm } from "./InputForm";
// import { UploaderImages } from "./UploaderImages";
// import { useEffect } from "react";
// import { generateSlug } from "@/helpers";
// import toast from "react-hot-toast";
// import {
//   useCreateDiscount,
//   useUpdateDiscount,
//   useDeleteDiscount,
// } from "@/hooks";

// interface Props {
//   title: string;
//   initialData?: ProductFormValues | null;
// }

// export const FormProduct = ({ title, initialData }: Props) => {
//   const navigate = useNavigate();
//   const isEditing = !!initialData;

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     setValue,
//     watch,
//     reset,
//   } = useForm<ProductFormValues>({
//     resolver: zodResolver(productSchema),
//     defaultValues: {
//       // Inicializa has_discount basado en si initialData tiene un descuento
//       has_discount: initialData?.discount ? true : false,
//       // Si hay un descuento inicial, lo mapeamos. De lo contrario, 'discount' es undefined.
//       // Esto es CRUCIAL para que Zod.optional() funcione correctamente.
//       discount: initialData?.discount
//         ? {
//             id: initialData.discount.id,
//             discount_type: initialData.discount.discount_type || "percentage", // Asegura un valor por defecto
//             value: initialData.discount.value || 0,
//             // Las fechas se pasan como objetos Date para react-hook-form
//             starts_at: initialData.discount.starts_at
//               ? new Date(initialData.discount.starts_at)
//               : undefined,
//             ends_at: initialData.discount.ends_at
//               ? new Date(initialData.discount.ends_at)
//               : undefined,
//           }
//         : undefined, // Si no hay descuento inicial, el campo 'discount' es undefined
//       // Asegúrate de que los demás campos del producto también tengan valores por defecto
//       name: initialData?.name || "",
//       price: initialData?.price || 0,
//       stock: initialData?.stock || 0,
//       category_id: initialData?.category_id || "",
//       description: initialData?.description || "",
//       image_url: initialData?.image_url || [],
//       slug: initialData?.slug || "",
//     },
//   });

//   const {
//     categories,
//     isLoading: isLoadingCategories,
//     isError: isErrorCategories,
//   } = useCategories();

//   const { mutateAsync: createProduct, isPending: isCreatingProduct } =
//     useCreateProduct();
//   const { mutateAsync: updateProduct, isPending: isUpdatingProduct } =
//     useUpdateProduct();

//   const { mutateAsync: createDiscount, isPending: isCreatingDiscount } =
//     useCreateDiscount();
//   const { mutateAsync: updateDiscount, isPending: isUpdatingDiscount } =
//     useUpdateDiscount();
//   const { mutateAsync: deleteDiscount, isPending: isDeletingDiscount } =
//     useDeleteDiscount();

//   // Ajusta el reset para que también inicialice los campos de descuento si initialData cambia
//   useEffect(() => {
//     if (initialData) {
//       reset({
//         ...initialData,
//         has_discount: initialData.discount ? true : false,
//         discount: initialData.discount
//           ? {
//               id: initialData.discount.id,
//               discount_type: initialData.discount.discount_type || "percentage",
//               value: initialData.discount.value || 0,
//               starts_at: initialData.discount.starts_at
//                 ? new Date(initialData.discount.starts_at)
//                 : undefined,
//               ends_at: initialData.discount.ends_at
//                 ? new Date(initialData.discount.ends_at)
//                 : undefined,
//             }
//           : undefined, // Si no hay descuento inicial, el campo 'discount' es undefined
//       });
//     }
//   }, [initialData, reset]);

//   // Observa el valor del checkbox 'has_discount' para renderizado condicional
//   const hasDiscount = watch("has_discount");

//   const onSubmit = handleSubmit(async (data) => {
//     try {
//       const currentProductId = initialData?.id ?? "";

//       // Separa los datos del producto de los datos del descuento y la bandera de UI
//       const { has_discount, discount, ...productData } = data;

//       if (isEditing) {
//         // --- Lógica de Actualización ---
//         await updateProduct({ id: currentProductId, data: productData });

//         if (has_discount && discount) {
//           // Si el descuento está activo y los datos son válidos (Zod ya validó)
//           // Se pasan los objetos Date directamente a los hooks de descuento.
//           // La conversión a ISO string para la DB ocurre DENTRO de las funciones de acción.
//           const discountPayload = {
//             discount_type: discount.discount_type,
//             value: discount.value,
//             starts_at: discount.starts_at, // Pasa el objeto Date
//             ends_at: discount.ends_at, // Pasa el objeto Date
//           };

//           if (initialData?.discount?.id) {
//             // Si ya existía un descuento (tiene ID), lo ACTUALIZAMOS
//             await updateDiscount({
//               id: initialData.discount.id, // Usamos el ID del descuento existente
//               data: { ...discountPayload, product_id: currentProductId },
//             });
//           } else {
//             // Si no existía un descuento (no tiene ID), lo CREAMOS
//             await createDiscount({
//               ...discountPayload,
//               product_id: currentProductId,
//             });
//           }
//         } else if (!has_discount && initialData?.discount?.id) {
//           // Si el descuento fue desactivado y existía previamente, lo ELIMINAMOS
//           await deleteDiscount(initialData.discount.id);
//         }
//       } else {
//         // --- Lógica de Creación ---
//         // Primero crea el producto para obtener su ID
//         const createdProductResponse = await createProduct({
//           name: productData.name,
//           price: productData.price,
//           stock: productData.stock as number,
//           category_id: productData.category_id,
//           description: productData.description,
//           images: productData.image_url,
//           slug: productData.slug,
//         });

//         if (has_discount && discount && createdProductResponse?.id) {
//           // Si hay descuento y está activo, crea el descuento con el product_id del nuevo producto
//           const discountPayload = {
//             discount_type: discount.discount_type,
//             value: discount.value,
//             starts_at: discount.starts_at, // Pasa el objeto Date
//             ends_at: discount.ends_at, // Pasa el objeto Date
//           };
//           await createDiscount({
//             ...discountPayload,
//             product_id: createdProductResponse.id,
//           });
//         }
//         reset(); // Restablece el formulario después de crear un nuevo producto
//       }
//       toast.success(
//         isEditing
//           ? "Producto y descuentos actualizados!"
//           : "Producto y descuentos creados!"
//       );
//       navigate("/dashboard/products"); // Redirige a la lista de productos
//     } catch (error) {
//       console.error(error);
//       toast.error("Ocurrió un error en el envío del formulario");
//     }
//   });

//   // Generar el Slug
//   const watchName = watch("name");

//   useEffect(() => {
//     if (!watchName) {
//       setValue("slug", "", { shouldValidate: true });
//       return;
//     }

//     const generatedSlug = generateSlug(watchName);
//     setValue("slug", generatedSlug, { shouldValidate: true });
//   }, [watchName, setValue]);

//   // Estado de carga combinado
//   const isLoading =
//     isLoadingCategories ||
//     isCreatingProduct ||
//     isUpdatingProduct ||
//     isCreatingDiscount ||
//     isUpdatingDiscount ||
//     isDeletingDiscount;

//   if (isLoading) return <Loader size={60} />;
//   if (isErrorCategories) return <div>Error al cargar categorías</div>;
//   if (!categories || categories.length === 0)
//     return <div>No se encontraron categorías. Por favor, crea una.</div>;

//   return (
//     <section className="flex flex-col gap-6 relative bg-fondo text-choco dark:bg-fondo-dark dark:text-cream mt-6 p-4 rounded-lg shadow-md">
//       <header className="flex justify-between items-center flex-col gap-2.5 md:flex-row md:gap-5">
//         <div className="flex items-center gap-3 mb-4">
//           <h2 className="text-2xl font-bold text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)] tracking-tight capitalize">
//             {title}
//           </h2>
//         </div>
//         <div className="flex flex-col gap-2.5 md:flex-row md:gap-5 top-0 right-0">
//           <button
//             className="inline-flex items-center gap-2 px-4 py-2 bg-cocoa hover:bg-cocoa/90 text-white text-sm font-medium rounded-md transition"
//             type="button"
//             onClick={() => navigate(-1)}
//             disabled={isLoading}
//           >
//             <MdOutlineCancel size={19} />
//             Cancelar
//           </button>
//           <button
//             type="submit"
//             form="your-form-id"
//             className="inline-flex items-center gap-2 px-4 py-2 bg-cocoa hover:bg-cocoa/90 text-white text-sm font-medium rounded-md transition"
//             disabled={isLoading}
//           >
//             <MdOutlineSaveAlt size={19} />
//             {isSubmitting || isLoading ? "Guardando..." : "Guardar Producto"}
//           </button>
//         </div>
//       </header>

//       <form
//         onSubmit={onSubmit}
//         id="your-form-id"
//         className="grid grid-cols-1 lg:grid-cols-5 gap-6 auto-rows-max flex-1 items-stretch"
//       >
//         <SectionFormProduct
//           titleSection="Identificación del Producto"
//           className="h-full flex flex-col justify-between lg:col-span-3 "
//         >
//           <InputForm
//             type="text"
//             placeholder="Ejemplo: Chocolate Nestlet"
//             label="nombre"
//             name="name"
//             register={register}
//             errors={errors}
//             className="w-full"
//             required
//             disabled={isLoading}
//           />

//           <div className="h-full"></div>

//           <InputForm
//             type="text"
//             label="Slug"
//             name="slug"
//             placeholder="galleta-tipo-new-york"
//             register={register}
//             errors={errors}
//             className="w-full"
//             disabled={isLoading}
//           />
//           <div className="h-full"></div>
//         </SectionFormProduct>

//         <SectionFormProduct
//           titleSection="Detalles del Producto"
//           className="h-full flex flex-col justify-between lg:col-span-2"
//         >
//           <div className="w-full mt-1">
//             <label
//               htmlFor="category_id"
//               className="text-xs font-bold tracking-tight capitalize"
//             >
//               Categoría:
//             </label>
//             <select
//               id="category_id"
//               {...register("category_id")}
//               className="w-full rounded-md border border-cocoa/30 dark:border-cream/30 bg-transparent mt-1 px-2 py-2 font-medium text-sm focus:ring-2 focus:ring-cocoa/50 dark:focus:ring-cream/70 placeholder:text-choco/60 dark:placeholder:text-cream/60 dark:focus:border-cream/50 focus:border-cocoa/90"
//               disabled={isLoading || isLoadingCategories}
//             >
//               <option value="">Selecciona una categoría</option>
//               {categories.map((cat) => (
//                 <option key={cat.id} value={cat.id}>
//                   {cat.name}
//                 </option>
//               ))}
//             </select>
//             {errors.category_id && (
//               <p className="text-red-500 text-sm">
//                 {errors.category_id.message}
//               </p>
//             )}
//           </div>

//           <InputForm
//             type="number"
//             label="Precio"
//             name="price"
//             placeholder="0,00"
//             step="0.01"
//             register={register}
//             errors={errors}
//             required
//             className="w-full"
//             disabled={isLoading}
//           />

//           <InputForm
//             type="number"
//             label="Stock"
//             name="stock"
//             placeholder="0"
//             register={register}
//             errors={errors}
//             required
//             className="w-full"
//             disabled={isLoading}
//           />
//         </SectionFormProduct>

//         <SectionFormProduct
//           titleSection="Descuentos del Producto"
//           className="h-full flex flex-col justify-start lg:col-span-2"
//         >
//           <div className="flex items-center gap-2 mb-4">
//             <input
//               type="checkbox"
//               id="has_discount"
//               {...register("has_discount")}
//               className="h-4 w-4 text-cocoa focus:ring-cocoa border-gray-300 rounded"
//               disabled={isLoading}
//             />
//             <label
//               htmlFor="has_discount"
//               className="text-sm font-medium text-choco dark:text-cream"
//             >
//               Activar Descuento
//             </label>
//           </div>

//           {hasDiscount && (
//             <>
//               <div className="w-full mt-1">
//                 <label
//                   htmlFor="discount.discount_type"
//                   className="text-xs font-bold tracking-tight capitalize"
//                 >
//                   Tipo de Descuento:
//                 </label>
//                 <select
//                   id="discount.discount_type"
//                   {...register("discount.discount_type")}
//                   className="w-full rounded-md border border-cocoa/30 dark:border-cream/30 bg-transparent mt-1 px-2 py-2 font-medium text-sm focus:ring-2 focus:ring-cocoa/50 dark:focus:ring-cream/70 placeholder:text-choco/60 dark:placeholder:text-cream/60 dark:focus:border-cream/50 focus:border-cocoa/90"
//                   disabled={isLoading}
//                 >
//                   <option value="">Selecciona un tipo</option>
//                   <option value="percentage">Porcentaje</option>
//                   <option value="fixed">Fijo</option>
//                 </select>
//                 {errors.discount?.discount_type && (
//                   <p className="text-red-500 text-sm">
//                     {errors.discount.discount_type.message}
//                   </p>
//                 )}
//               </div>

//               <InputForm
//                 type="number"
//                 label="Valor del Descuento"
//                 name="discount.value"
//                 placeholder={
//                   watch("discount.discount_type") === "percentage"
//                     ? "Ej: 10 (para 10%)"
//                     : "Ej: 5.00 (para $5.00)"
//                 }
//                 step="0.01"
//                 register={register}
//                 errors={errors}
//                 className="w-full"
//                 disabled={isLoading}
//               />

//               <InputForm
//                 type="datetime-local"
//                 label="Inicia en"
//                 name="discount.starts_at"
//                 register={register}
//                 errors={errors}
//                 className="w-full"
//                 disabled={isLoading}
//               />

//               <InputForm
//                 type="datetime-local"
//                 label="Termina en"
//                 name="discount.ends_at"
//                 register={register}
//                 errors={errors}
//                 className="w-full"
//                 disabled={isLoading}
//               />
//             </>
//           )}
//         </SectionFormProduct>

//         <SectionFormProduct
//           titleSection="Descripción del producto"
//           className="h-full flex flex-col justify-between lg:col-span-3 "
//         >
//           <div>
//             <textarea
//               {...register("description")}
//               rows={3}
//               placeholder="Descripción del producto"
//               className={`w-full px-4 py-2 border text-sm border-choco/50 dark:border-cream/10 rounded-md placeholder:font-normal focus:outline-none text-choco bg-cream dark:bg-fondo-dark dark:text-cream dark:focus:border-cream/50 focus:border-cocoa/90 focus:border-2 outline-none transition-all duration-300 ease-in-out${
//                 errors.description
//                   ? "border-red-500"
//                   : "border-cocoa/70 dark:border-cream/30 "
//               }`}
//               disabled={isLoading}
//             />
//             {errors.description && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.description.message}
//               </p>
//             )}
//           </div>
//         </SectionFormProduct>

//         <SectionFormProduct
//           titleSection="Imágenes del producto"
//           className="h-full flex flex-col justify-between lg:col-span-2 "
//         >
//           <UploaderImages
//             errors={errors}
//             setValue={setValue}
//             watch={watch}
//             // disabled={isLoading}
//           />
//         </SectionFormProduct>
//       </form>
//     </section>
//   );
// };

// import { Loader } from "@/components/shared/Loader";
// import { useCategories, useCreateProduct, useUpdateProduct } from "@/hooks";
// import {
//   ProductFormValues,
//   productSchema,
//   discountSchema,
// } from "@/lib/validators"; // Importa discountSchema
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { MdOutlineCancel, MdOutlineSaveAlt } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import { SectionFormProduct } from "./SectionFormProduct";
// import { InputForm } from "./InputForm";
// import { UploaderImages } from "./UploaderImages";
// import { useEffect } from "react";
// import { generateSlug } from "@/helpers";
// import toast from "react-hot-toast";

// interface Props {
//   title: string;
//   initialData?: ProductFormValues | null;
// }

// export const FormProduct = ({ title, initialData }: Props) => {
//   const navigate = useNavigate();
//   const isEditing = !!initialData;

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     setValue,
//     watch,
//     reset,
//     control, // Necesitarás control para el Switch/Checkbox
//   } = useForm<ProductFormValues>({
//     resolver: zodResolver(productSchema),
//     defaultValues: {
//       has_discount: initialData?.discount ? true : false, // Establece el estado inicial del checkbox
//       // Asegúrate de que si hay un descuento, se inicialicen sus valores
//       discount: initialData?.discount || {},
//     },
//   });

//   const {
//     categories,
//     isLoading: isLoadingCategories,
//     isError: isErrorCategories,
//   } = useCategories();

//   const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
//   const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct(
//     () => navigate("/dashboard/products")
//   );

//   useEffect(() => {
//     if (initialData) {
//       reset({
//         ...initialData,
//         has_discount: initialData.discount ? true : false, // Asegura que el checkbox se marque si hay descuento
//       });
//     }
//   }, [initialData, reset]);

//   // Watch para el campo has_discount para mostrar/ocultar los campos de descuento
//   const hasDiscount = watch("has_discount");

//   const onSubmit = handleSubmit(async (data) => {
//     try {
//       const currentProductId = initialData?.id ?? "";

//       // Separa los datos del producto de los datos del descuento
//       const { discount, has_discount, ...productData } = data;

//       if (isEditing) {
//         updateProduct({ id: currentProductId, data: productData });

//         // Lógica para actualizar o eliminar el descuento
//         if (has_discount && discount) {
//           // Si hay descuento y está activo, actualiza o crea
//           // Aquí deberías llamar a tu API para actualizar/crear el descuento
//           // Necesitarás un hook o función para esto (ej: useUpdateDiscount, useCreateDiscount)
//           // Ejemplo: updateDiscount({ ...discount, product_id: currentProductId });
//           console.log("Actualizando/creando descuento:", {
//             ...discount,
//             product_id: currentProductId,
//           });
//         } else if (!has_discount && initialData?.discount?.id) {
//           // Si el descuento fue desactivado y existía previamente, elimínalo
//           // Aquí deberías llamar a tu API para eliminar el descuento
//           // Ejemplo: deleteDiscount(initialData.discount.id);
//           console.log("Eliminando descuento con ID:", initialData.discount.id);
//         }
//       } else {
//         // En la creación, primero creamos el producto para obtener su ID
//         // Luego, si hay descuento, lo asociamos
//         const createdProduct = await createProduct({
//           name: productData.name,
//           price: productData.price,
//           stock: productData.stock as number,
//           category_id: productData.category_id,
//           description: productData.description,
//           images: productData.image_url,
//           slug: productData.slug,
//         });

//         if (has_discount && discount && createdProduct?.id) {
//           // Si hay descuento y está activo, crea el descuento con el product_id del nuevo producto
//           // Aquí deberías llamar a tu API para crear el descuento
//           // Ejemplo: createDiscount({ ...discount, product_id: createdProduct.id });
//           console.log("Creando descuento para nuevo producto:", {
//             ...discount,
//             product_id: createdProduct.id,
//           });
//         }
//         reset();
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Ocurrió un error en el envío del formulario");
//     }
//   });

//   //Generar el Slug
//   const watchName = watch("name");

//   useEffect(() => {
//     if (!watchName) return;

//     const generatedSlug = generateSlug(watchName);
//     setValue("slug", generatedSlug, { shouldValidate: true });
//   }, [watchName, setValue]);

//   if (isLoadingCategories || isUpdating || isCreating)
//     return <Loader size={60} />;
//   if (isErrorCategories) return <div>Error</div>;
//   if (!categories || categories.length === 0)
//     return <div>No categories found</div>;

//   return (
//     <section className="flex flex-col gap-6 relative bg-fondo text-choco dark:bg-fondo-dark dark:text-cream mt-6">
//       <header className="flex justify-between items-center flex-col gap-2.5 md:flex-row md:gap-5">
//         <div className="flex items-center gap-3 mb-4">
//           <h2 className="text-2xl font-bold text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)] tracking-tight capitalize">
//             {title}
//           </h2>
//         </div>
//         <div className="flex flex-col gap-2.5 md:flex-row md:gap-5 top-0 right-0">
//           <button
//             className="inline-flex items-center gap-2 px-4 py-2 bg-cocoa hover:bg-cocoa/90 text-white text-sm font-medium rounded-md transition"
//             type="button"
//             onClick={() => navigate(-1)}
//           >
//             <MdOutlineCancel size={19} />
//             Cancelar
//           </button>
//           <button
//             type="submit"
//             form="your-form-id"
//             className="inline-flex items-center gap-2 px-4 py-2 bg-cocoa hover:bg-cocoa/90 text-white text-sm font-medium rounded-md transition"
//           >
//             <MdOutlineSaveAlt size={19} />
//             {isSubmitting ? "Guardando..." : "Guardar Producto"}
//           </button>
//         </div>
//       </header>

//       <form
//         onSubmit={onSubmit}
//         id="your-form-id"
//         className="grid grid-cols-1 lg:grid-cols-5 gap-6 auto-rows-max flex-1 items-stretch"
//       >
//         {/* Secciones aquí */}
//         <SectionFormProduct
//           titleSection="Identificación del Producto"
//           className="h-full flex flex-col justify-between lg:col-span-3 "
//         >
//           <InputForm
//             type="text"
//             placeholder="Ejemplo: Chocolate Nestlet"
//             label="nombre"
//             name="name"
//             register={register}
//             errors={errors}
//             className="w-full"
//             required
//           />

//           <div className="h-full"></div>

//           <InputForm
//             type="text"
//             label="Slug"
//             name="slug"
//             placeholder="galleta-tipo-new-york"
//             register={register}
//             errors={errors}
//             className="w-full"
//           />
//           <div className="h-full"></div>
//         </SectionFormProduct>

//         <SectionFormProduct
//           titleSection="Detalles del Producto"
//           className="h-full flex flex-col justify-between lg:col-span-2"
//         >
//           <div className="w-full mt-1">
//             <label
//               htmlFor="category_id"
//               className="text-xs font-bold tracking-tight capitalize"
//             >
//               Categoría:
//             </label>
//             <select
//               id="category_id"
//               {...register("category_id")}
//               className="w-full rounded-md border border-cocoa/30 dark:border-cream/30 bg-transparent mt-1 px-2 py-2 font-medium text-sm focus:ring-2 focus:ring-cocoa/50 dark:focus:ring-cream/70 placeholder:text-choco/60 dark:placeholder:text-cream/60 dark:focus:border-cream/50 focus:border-cocoa/90"
//             >
//               <option value="">Selecciona una categoría</option>
//               {categories.map((cat) => (
//                 <option key={cat.id} value={cat.id}>
//                   {cat.name}
//                 </option>
//               ))}
//             </select>
//             {errors.category_id && (
//               <p className="text-red-500 text-sm">
//                 {errors.category_id.message}
//               </p>
//             )}
//           </div>

//           <InputForm
//             type="number"
//             label="Precio"
//             name="price"
//             placeholder="0,00"
//             step="0.01"
//             register={register}
//             errors={errors}
//             required
//             className="w-full"
//           />

//           <InputForm
//             type="number"
//             label="Stock"
//             name="stock"
//             placeholder="0"
//             register={register}
//             errors={errors}
//             required
//             className="w-full"
//           />
//         </SectionFormProduct>

//         {/* Sección para los descuentos */}
//         <SectionFormProduct
//           titleSection="Descuentos del Producto"
//           className="h-full flex flex-col justify-start lg:col-span-2" // Ajusta el colspan según tu diseño
//         >
//           <div className="flex items-center gap-2 mb-4">
//             <input
//               type="checkbox"
//               id="has_discount"
//               {...register("has_discount")}
//               className="h-4 w-4 text-cocoa focus:ring-cocoa border-gray-300 rounded"
//             />
//             <label
//               htmlFor="has_discount"
//               className="text-sm font-medium text-choco dark:text-cream"
//             >
//               Activar Descuento
//             </label>
//           </div>

//           {hasDiscount && ( // Muestra los campos de descuento solo si hasDiscount es true
//             <>
//               <div className="w-full mt-1">
//                 <label
//                   htmlFor="discount.discount_type"
//                   className="text-xs font-bold tracking-tight capitalize"
//                 >
//                   Tipo de Descuento:
//                 </label>
//                 <select
//                   id="discount.discount_type"
//                   {...register("discount.discount_type")}
//                   className="w-full rounded-md border border-cocoa/30 dark:border-cream/30 bg-transparent mt-1 px-2 py-2 font-medium text-sm focus:ring-2 focus:ring-cocoa/50 dark:focus:ring-cream/70 placeholder:text-choco/60 dark:placeholder:text-cream/60 dark:focus:border-cream/50 focus:border-cocoa/90"
//                 >
//                   <option value="">Selecciona un tipo</option>
//                   <option value="percentage">Porcentaje</option>
//                   <option value="fixed">Fijo</option>
//                 </select>
//                 {errors.discount?.discount_type && (
//                   <p className="text-red-500 text-sm">
//                     {errors.discount.discount_type.message}
//                   </p>
//                 )}
//               </div>

//               <InputForm
//                 type="number"
//                 label="Valor del Descuento"
//                 name="discount.value"
//                 placeholder={
//                   watch("discount.discount_type") === "percentage"
//                     ? "Ej: 10 (para 10%)"
//                     : "Ej: 5.00 (para $5.00)"
//                 }
//                 step="0.01"
//                 register={register}
//                 errors={errors}
//                 className="w-full"
//               />

//               <InputForm
//                 type="datetime-local" // O "date" si solo quieres la fecha
//                 label="Inicia en"
//                 name="discount.starts_at"
//                 register={register}
//                 errors={errors}
//                 className="w-full"
//               />

//               <InputForm
//                 type="datetime-local" // O "date" si solo quieres la fecha
//                 label="Termina en"
//                 name="discount.ends_at"
//                 register={register}
//                 errors={errors}
//                 className="w-full"
//               />
//             </>
//           )}
//         </SectionFormProduct>

//         <SectionFormProduct
//           titleSection="Descripción del producto"
//           className="h-full flex flex-col justify-between lg:col-span-3 " // Ajusta el colspan
//         >
//           <div>
//             <textarea
//               {...register("description")}
//               rows={3}
//               placeholder="Descripción del producto"
//               className={`w-full px-4 py-2 border text-sm border-choco/50 dark:border-cream/10 rounded-md placeholder:font-normal focus:outline-none text-choco bg-cream dark:bg-fondo-dark dark:text-cream dark:focus:border-cream/50 focus:border-cocoa/90 focus:border-2 outline-none transition-all duration-300 ease-in-out${
//                 errors.description
//                   ? "border-red-500"
//                   : "border-cocoa/70 dark:border-cream/30 "
//               }`}
//             />
//             {errors.description && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.description.message}
//               </p>
//             )}
//           </div>
//         </SectionFormProduct>

//         <SectionFormProduct
//           titleSection="Imágenes del producto"
//           className="h-full flex flex-col justify-between lg:col-span-2 "
//         >
//           <UploaderImages errors={errors} setValue={setValue} watch={watch} />
//         </SectionFormProduct>
//       </form>
//     </section>
//   );
// };

// import { Loader } from "@/components/shared/Loader";
// import { useCategories, useCreateProduct, useUpdateProduct } from "@/hooks";
// import { ProductFormValues, productSchema } from "@/lib/validators"; // productSchema ya debería incluir los campos de descuento
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { MdOutlineCancel, MdOutlineSaveAlt } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import { SectionFormProduct } from "./SectionFormProduct";
// import { InputForm } from "./InputForm";
// import { UploaderImages } from "./UploaderImages";
// import { useEffect } from "react";
// import { generateSlug } from "@/helpers";
// import toast from "react-hot-toast";
// import {
//   useCreateDiscount,
//   useUpdateDiscount,
//   useDeleteDiscount,
// } from "@/hooks";

// interface Props {
//   title: string;
//   initialData?: ProductFormValues | null;
// }

// export const FormProduct = ({ title, initialData }: Props) => {
//   const navigate = useNavigate();
//   const isEditing = !!initialData;

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     setValue,
//     watch,
//     reset,
//     control,
//   } = useForm<ProductFormValues>({
//     resolver: zodResolver(productSchema),
//     defaultValues: {
//       has_discount: initialData?.discount ? true : false,
//       discount: initialData?.discount
//         ? {
//             id: initialData.discount.id,
//             discount_type: initialData.discount.discount_type || "percentage",
//             value: initialData.discount.value || 0,
//             // CORRECCIÓN AQUÍ: Pasar directamente el objeto Date (o undefined si no existe)
//             starts_at: initialData.discount.starts_at
//               ? new Date(initialData.discount.starts_at)
//               : undefined,
//             ends_at: initialData.discount.ends_at
//               ? new Date(initialData.discount.ends_at)
//               : undefined,
//           }
//         : undefined, // Si no hay descuento inicial, el campo 'discount' es undefined
//       name: initialData?.name || "",
//       price: initialData?.price || 0,
//       stock: initialData?.stock || 0,
//       category_id: initialData?.category_id || "",
//       description: initialData?.description || "",
//       image_url: initialData?.image_url || [],
//       slug: initialData?.slug || "",
//     },
//   });

//   const {
//     categories,
//     isLoading: isLoadingCategories,
//     isError: isErrorCategories,
//   } = useCategories();

//   const { mutateAsync: createProduct, isPending: isCreatingProduct } =
//     useCreateProduct();
//   const { mutateAsync: updateProduct, isPending: isUpdatingProduct } =
//     useUpdateProduct();

//   const { mutateAsync: createDiscount, isPending: isCreatingDiscount } =
//     useCreateDiscount();
//   const { mutateAsync: updateDiscount, isPending: isUpdatingDiscount } =
//     useUpdateDiscount();
//   const { mutateAsync: deleteDiscount, isPending: isDeletingDiscount } =
//     useDeleteDiscount();

//   useEffect(() => {
//     if (initialData) {
//       reset({
//         ...initialData,
//         has_discount: initialData.discount ? true : false,
//         discount: initialData.discount
//           ? {
//               id: initialData.discount.id,
//               discount_type: initialData.discount.discount_type || "percentage",
//               value: initialData.discount.value || 0,
//               // CORRECCIÓN AQUÍ: Pasar directamente el objeto Date (o undefined si no existe)
//               starts_at: initialData.discount.starts_at
//                 ? new Date(initialData.discount.starts_at)
//                 : undefined,
//               ends_at: initialData.discount.ends_at
//                 ? new Date(initialData.discount.ends_at)
//                 : undefined,
//             }
//           : undefined, // Si no hay descuento inicial, el campo 'discount' es undefined
//       });
//     }
//   }, [initialData, reset]);

//   const hasDiscount = watch("has_discount");

//   const onSubmit = handleSubmit(async (data) => {
//     try {
//       const currentProductId = initialData?.id ?? "";

//       const { has_discount, discount, ...productData } = data;

//       if (isEditing) {
//         await updateProduct({ id: currentProductId, data: productData });

//         if (has_discount && discount) {
//           // En este punto, discount.starts_at y discount.ends_at ya son objetos Date
//           // gracias a z.coerce.date() en tu esquema.
//           const discountPayload = {
//             discount_type: discount.discount_type,
//             value: discount.value,
//             starts_at: discount.starts_at, // Pasa el objeto Date directamente
//             ends_at: discount.ends_at, // Pasa el objeto Date directamente
//           };

//           if (initialData?.discount?.id) {
//             await updateDiscount({
//               id: initialData.discount.id,
//               data: { ...discountPayload, product_id: currentProductId },
//             });
//           } else {
//             await createDiscount({
//               ...discountPayload,
//               product_id: currentProductId,
//             });
//           }
//         } else if (!has_discount && initialData?.discount?.id) {
//           await deleteDiscount(initialData.discount.id);
//         }
//       } else {
//         const createdProductResponse = await createProduct({
//           name: productData.name,
//           price: productData.price,
//           stock: productData.stock as number,
//           category_id: productData.category_id,
//           description: productData.description,
//           images: productData.image_url,
//           slug: productData.slug,
//         });

//         if (has_discount && discount && createdProductResponse?.id) {
//           // En este punto, discount.starts_at y discount.ends_at ya son objetos Date
//           const discountPayload = {
//             discount_type: discount.discount_type,
//             value: discount.value,
//             starts_at: discount.starts_at, // Pasa el objeto Date directamente
//             ends_at: discount.ends_at, // Pasa el objeto Date directamente
//           };
//           await createDiscount({
//             ...discountPayload,
//             product_id: createdProductResponse.id,
//           });
//         }
//         reset();
//       }
//       toast.success(
//         isEditing
//           ? "Producto y descuentos actualizados!"
//           : "Producto y descuentos creados!"
//       );
//       navigate("/dashboard/products");
//     } catch (error) {
//       console.error(error);
//       toast.error("Ocurrió un error en el envío del formulario");
//     }
//   });

//   const watchName = watch("name");

//   useEffect(() => {
//     if (!watchName) {
//       setValue("slug", "", { shouldValidate: true });
//       return;
//     }

//     const generatedSlug = generateSlug(watchName);
//     setValue("slug", generatedSlug, { shouldValidate: true });
//   }, [watchName, setValue]);

//   const isLoading =
//     isLoadingCategories ||
//     isCreatingProduct ||
//     isUpdatingProduct ||
//     isCreatingDiscount ||
//     isUpdatingDiscount ||
//     isDeletingDiscount;

//   if (isLoading) return <Loader size={60} />;
//   if (isErrorCategories) return <div>Error al cargar categorías</div>;
//   if (!categories || categories.length === 0)
//     return <div>No se encontraron categorías. Por favor, crea una.</div>;

//   return (
//     <section className="flex flex-col gap-6 relative bg-fondo text-choco dark:bg-fondo-dark dark:text-cream mt-6 p-4 rounded-lg shadow-md">
//       <header className="flex justify-between items-center flex-col gap-2.5 md:flex-row md:gap-5">
//         <div className="flex items-center gap-3 mb-4">
//           <h2 className="text-2xl font-bold text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)] tracking-tight capitalize">
//             {title}
//           </h2>
//         </div>
//         <div className="flex flex-col gap-2.5 md:flex-row md:gap-5 top-0 right-0">
//           <button
//             className="inline-flex items-center gap-2 px-4 py-2 bg-cocoa hover:bg-cocoa/90 text-white text-sm font-medium rounded-md transition"
//             type="button"
//             onClick={() => navigate(-1)}
//             disabled={isLoading}
//           >
//             <MdOutlineCancel size={19} />
//             Cancelar
//           </button>
//           <button
//             type="submit"
//             form="your-form-id"
//             className="inline-flex items-center gap-2 px-4 py-2 bg-cocoa hover:bg-cocoa/90 text-white text-sm font-medium rounded-md transition"
//             disabled={isLoading}
//           >
//             <MdOutlineSaveAlt size={19} />
//             {isSubmitting || isLoading ? "Guardando..." : "Guardar Producto"}
//           </button>
//         </div>
//       </header>

//       <form
//         onSubmit={onSubmit}
//         id="your-form-id"
//         className="grid grid-cols-1 lg:grid-cols-5 gap-6 auto-rows-max flex-1 items-stretch"
//       >
//         <SectionFormProduct
//           titleSection="Identificación del Producto"
//           className="h-full flex flex-col justify-between lg:col-span-3 "
//         >
//           <InputForm
//             type="text"
//             placeholder="Ejemplo: Chocolate Nestlet"
//             label="nombre"
//             name="name"
//             register={register}
//             errors={errors}
//             className="w-full"
//             required
//             disabled={isLoading}
//           />

//           <div className="h-full"></div>

//           <InputForm
//             type="text"
//             label="Slug"
//             name="slug"
//             placeholder="galleta-tipo-new-york"
//             register={register}
//             errors={errors}
//             className="w-full"
//             disabled={isLoading}
//           />
//           <div className="h-full"></div>
//         </SectionFormProduct>

//         <SectionFormProduct
//           titleSection="Detalles del Producto"
//           className="h-full flex flex-col justify-between lg:col-span-2"
//         >
//           <div className="w-full mt-1">
//             <label
//               htmlFor="category_id"
//               className="text-xs font-bold tracking-tight capitalize"
//             >
//               Categoría:
//             </label>
//             <select
//               id="category_id"
//               {...register("category_id")}
//               className="w-full rounded-md border border-cocoa/30 dark:border-cream/30 bg-transparent mt-1 px-2 py-2 font-medium text-sm focus:ring-2 focus:ring-cocoa/50 dark:focus:ring-cream/70 placeholder:text-choco/60 dark:placeholder:text-cream/60 dark:focus:border-cream/50 focus:border-cocoa/90"
//               disabled={isLoading || isLoadingCategories}
//             >
//               <option value="">Selecciona una categoría</option>
//               {categories.map((cat) => (
//                 <option key={cat.id} value={cat.id}>
//                   {cat.name}
//                 </option>
//               ))}
//             </select>
//             {errors.category_id && (
//               <p className="text-red-500 text-sm">
//                 {errors.category_id.message}
//               </p>
//             )}
//           </div>

//           <InputForm
//             type="number"
//             label="Precio"
//             name="price"
//             placeholder="0,00"
//             step="0.01"
//             register={register}
//             errors={errors}
//             required
//             className="w-full"
//             disabled={isLoading}
//           />

//           <InputForm
//             type="number"
//             label="Stock"
//             name="stock"
//             placeholder="0"
//             register={register}
//             errors={errors}
//             required
//             className="w-full"
//             disabled={isLoading}
//           />
//         </SectionFormProduct>

//         <SectionFormProduct
//           titleSection="Descuentos del Producto"
//           className="h-full flex flex-col justify-start lg:col-span-2"
//         >
//           <div className="flex items-center gap-2 mb-4">
//             <input
//               type="checkbox"
//               id="has_discount"
//               {...register("has_discount")}
//               className="h-4 w-4 text-cocoa focus:ring-cocoa border-gray-300 rounded"
//               disabled={isLoading}
//             />
//             <label
//               htmlFor="has_discount"
//               className="text-sm font-medium text-choco dark:text-cream"
//             >
//               Activar Descuento
//             </label>
//           </div>

//           {hasDiscount && (
//             <>
//               <div className="w-full mt-1">
//                 <label
//                   htmlFor="discount.discount_type"
//                   className="text-xs font-bold tracking-tight capitalize"
//                 >
//                   Tipo de Descuento:
//                 </label>
//                 <select
//                   id="discount.discount_type"
//                   {...register("discount.discount_type")}
//                   className="w-full rounded-md border border-cocoa/30 dark:border-cream/30 bg-transparent mt-1 px-2 py-2 font-medium text-sm focus:ring-2 focus:ring-cocoa/50 dark:focus:ring-cream/70 placeholder:text-choco/60 dark:placeholder:text-cream/60 dark:focus:border-cream/50 focus:border-cocoa/90"
//                   disabled={isLoading}
//                 >
//                   <option value="">Selecciona un tipo</option>
//                   <option value="percentage">Porcentaje</option>
//                   <option value="fixed">Fijo</option>
//                 </select>
//                 {errors.discount?.discount_type && (
//                   <p className="text-red-500 text-sm">
//                     {errors.discount.discount_type.message}
//                   </p>
//                 )}
//               </div>

//               <InputForm
//                 type="number"
//                 label="Valor del Descuento"
//                 name="discount.value"
//                 placeholder={
//                   watch("discount.discount_type") === "percentage"
//                     ? "Ej: 10 (para 10%)"
//                     : "Ej: 5.00 (para $5.00)"
//                 }
//                 step="0.01"
//                 register={register}
//                 errors={errors}
//                 className="w-full"
//                 disabled={isLoading}
//               />

//               <InputForm
//                 type="datetime-local"
//                 label="Inicia en"
//                 name="discount.starts_at"
//                 register={register}
//                 errors={errors}
//                 className="w-full"
//                 disabled={isLoading}
//               />

//               <InputForm
//                 type="datetime-local"
//                 label="Termina en"
//                 name="discount.ends_at"
//                 register={register}
//                 errors={errors}
//                 className="w-full"
//                 disabled={isLoading}
//               />
//             </>
//           )}
//         </SectionFormProduct>

//         <SectionFormProduct
//           titleSection="Descripción del producto"
//           className="h-full flex flex-col justify-between lg:col-span-3 "
//         >
//           <div>
//             <textarea
//               {...register("description")}
//               rows={3}
//               placeholder="Descripción del producto"
//               className={`w-full px-4 py-2 border text-sm border-choco/50 dark:border-cream/10 rounded-md placeholder:font-normal focus:outline-none text-choco bg-cream dark:bg-fondo-dark dark:text-cream dark:focus:border-cream/50 focus:border-cocoa/90 focus:border-2 outline-none transition-all duration-300 ease-in-out${
//                 errors.description
//                   ? "border-red-500"
//                   : "border-cocoa/70 dark:border-cream/30 "
//               }`}
//               disabled={isLoading}
//             />
//             {errors.description && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.description.message}
//               </p>
//             )}
//           </div>
//         </SectionFormProduct>

//         <SectionFormProduct
//           titleSection="Imágenes del producto"
//           className="h-full flex flex-col justify-between lg:col-span-2 "
//         >
//           <UploaderImages
//             errors={errors}
//             setValue={setValue}
//             watch={watch}
//             disabled={isLoading}
//           />
//         </SectionFormProduct>
//       </form>
//     </section>
//   );
// };

// import { Loader } from "@/components/shared/Loader";
// import { useCategories, useCreateProduct, useUpdateProduct } from "@/hooks";
// import { ProductFormValues, productSchema } from "@/lib/validators";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { MdOutlineCancel, MdOutlineSaveAlt } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import { SectionFormProduct } from "./SectionFormProduct";
// import { InputForm } from "./InputForm";
// import { UploaderImages } from "./UploaderImages";
// import { useEffect } from "react";
// import { generateSlug } from "@/helpers";
// import toast from "react-hot-toast";

// interface Props {
//   title: string;
//   initialData?: ProductFormValues | null;
// }

// export const FormProduct = ({ title, initialData }: Props) => {
//   const navigate = useNavigate();
//   const isEditing = !!initialData;

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     setValue,
//     watch,
//     reset,
//   } = useForm<ProductFormValues>({
//     resolver: zodResolver(productSchema),
//   });

//   const {
//     categories,
//     isLoading: isLoadingCategories,
//     isError: isErrorCategories,
//   } = useCategories();

//   const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
//   const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct(
//     () => navigate("/dashboard/products")
//   );

//   useEffect(() => {
//     if (initialData) {
//       reset(initialData);
//     }
//   }, [initialData, reset]);

//   const onSubmit = handleSubmit(async (data) => {
//     try {
//       const currentProductId = initialData?.id ?? "";

//       if (isEditing) {
//         updateProduct({ id: currentProductId, data });
//       } else {
//           createProduct({
//             name: data.name,
//             price: data.price,
//             stock: data.stock as number,
//             category_id: data.category_id,
//             description: data.description,
//             images: data.image_url,
//             slug: data.slug,
//         });
//         reset();
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Ocurrió un error en el envío del formulario");
//     }
//   });

//   //Generar el Slug
//   const watchName = watch("name");

//   useEffect(() => {
//     if (!watchName) return;

//     const generatedSlug = generateSlug(watchName);
//     setValue("slug", generatedSlug, { shouldValidate: true });
//   }, [watchName, setValue]);

//   if (isLoadingCategories || isUpdating || isCreating) return <Loader size={60} />;
//   if (isErrorCategories) return <div>Error</div>;
//   if (!categories || categories.length === 0)
//     return <div>No categories found</div>;

//   return (
//     <section className="flex flex-col gap-6 relative bg-fondo text-choco dark:bg-fondo-dark dark:text-cream mt-6">
//       <header className="flex justify-between items-center flex-col gap-2.5 md:flex-row md:gap-5">
//         <div className="flex items-center gap-3 mb-4">
//           <h2 className="text-2xl font-bold text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)] tracking-tight capitalize">
//             {title}
//           </h2>
//         </div>
//         <div className="flex flex-col gap-2.5 md:flex-row md:gap-5 top-0 right-0">
//           <button
//             className="inline-flex items-center gap-2 px-4 py-2 bg-cocoa hover:bg-cocoa/90 text-white text-sm font-medium rounded-md transition"
//             type="button"
//             onClick={() => navigate(-1)}
//           >
//             <MdOutlineCancel size={19} />
//             Cancelar
//           </button>
//           <button
//             type="submit"
//             form="your-form-id"
//             className="inline-flex items-center gap-2 px-4 py-2 bg-cocoa hover:bg-cocoa/90 text-white text-sm font-medium rounded-md transition"
//           >
//             <MdOutlineSaveAlt size={19} />
//             {isSubmitting ? "Guardando..." : "Guardar Producto"}
//           </button>
//         </div>
//       </header>

//       <form
//         onSubmit={onSubmit}
//         id="your-form-id"
//         className="grid grid-cols-1 lg:grid-cols-5 gap-6 auto-rows-max flex-1 items-stretch"
//       >
//         {/* Secciones aquí */}
//         <SectionFormProduct
//           titleSection="Identificación del Producto"
//           className="h-full flex flex-col justify-between lg:col-span-3 "
//         >
//           <InputForm
//             type="text"
//             placeholder="Ejemplo: Chocolate Nestlet"
//             label="nombre"
//             name="name"
//             register={register}
//             errors={errors}
//             className="w-full"
//             required
//           />

//           <div className="h-full"></div>

//           <InputForm
//             type="text"
//             label="Slug"
//             name="slug"
//             placeholder="galleta-tipo-new-york"
//             register={register}
//             errors={errors}
//             className="w-full"
//           />
//           <div className="h-full"></div>
//         </SectionFormProduct>

//         <SectionFormProduct
//           titleSection="Detalles del Producto"
//           className="h-full flex flex-col justify-between lg:col-span-2"
//         >
//           <div className="w-full mt-1">
//             <label
//               htmlFor="category_id"
//               className="text-xs font-bold tracking-tight capitalize"
//             >
//               Categoría:
//             </label>
//             <select
//               id="category_id"
//               {...register("category_id")}
//               className="w-full rounded-md border border-cocoa/30 dark:border-cream/30 bg-transparent mt-1 px-2 py-2 font-medium text-sm focus:ring-2 focus:ring-cocoa/50 dark:focus:ring-cream/70 placeholder:text-choco/60 dark:placeholder:text-cream/60 dark:focus:border-cream/50 focus:border-cocoa/90"
//             >
//               <option value="">Selecciona una categoría</option>
//               {categories.map((cat) => (
//                 <option key={cat.id} value={cat.id}>
//                   {cat.name}
//                 </option>
//               ))}
//             </select>
//             {errors.category_id && (
//               <p className="text-red-500 text-sm">
//                 {errors.category_id.message}
//               </p>
//             )}
//           </div>

//           <InputForm
//             type="number"
//             label="Precio"
//             name="price"
//             placeholder="0,00"
//             step="0.01"
//             register={register}
//             errors={errors}
//             required
//             className="w-full"
//           />

//           <InputForm
//             type="number"
//             label="Stock"
//             name="stock"
//             placeholder="0"
//             register={register}
//             errors={errors}
//             required
//             className="w-full"
//           />
//         </SectionFormProduct>

//         <SectionFormProduct
//           titleSection="Descripción del producto"
//           className="h-full flex flex-col justify-between lg:col-span-3 "
//         >
//           <div>
//             <textarea
//               {...register("description")}
//               rows={3}
//               placeholder="Descripción del producto"
//               className={`w-full px-4 py-2 border text-sm border-choco/50 dark:border-cream/10 rounded-md placeholder:font-normal focus:outline-none text-choco bg-cream dark:bg-fondo-dark dark:text-cream dark:focus:border-cream/50 focus:border-cocoa/90 focus:border-2 outline-none transition-all duration-300 ease-in-out${
//                 errors.description
//                   ? "border-red-500"
//                   : "border-cocoa/70 dark:border-cream/30 "
//               }`}
//             />
//             {errors.description && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.description.message}
//               </p>
//             )}
//           </div>
//         </SectionFormProduct>

//         <SectionFormProduct
//           titleSection="Imágenes del producto"
//           className="h-full flex flex-col justify-between lg:col-span-2 "
//         >
//           <UploaderImages errors={errors} setValue={setValue} watch={watch} />
//         </SectionFormProduct>
//       </form>
//     </section>
//   );
// };
