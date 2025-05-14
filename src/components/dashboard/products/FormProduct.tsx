import { Loader } from "@/components/shared/Loader";
import {
  useCategories,
  useCreateProduct,
  useUpdateProduct,
} from "@/hooks";
import { ProductFormValues, productSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MdOutlineCancel, MdOutlineSaveAlt } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { SectionFormProduct } from "./SectionFormProduct";
import { InputForm } from "./InputForm";
import { UploaderImages } from "./UploaderImages";
import { useEffect } from "react";
import { generateSlug } from "@/helpers";

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
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  const {
    categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useCategories();

  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct(() => navigate("/dashboard/products"));

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);
  
  const onSubmit = handleSubmit((data) => {
    if (isEditing) {
      updateProduct({ id: initialData!.id as string, data });
    } else {
      createProduct(
        {
          name: data.name,
          price: data.price,
          stock: data.stock as number,
          category_id: data.category_id,
          description: data.description,
          images: data.image_url,
          slug: data.slug,
        },
        { onSuccess: () => reset() }
      );
    }
  });

  //Generar el Slug
  const watchName = watch("name");

  useEffect(() => {
    if (!watchName) return;

    const generatedSlug = generateSlug(watchName);
    setValue("slug", generatedSlug, { shouldValidate: true });
  }, [watchName, setValue]);

  if (isLoadingCategories || isCreating || isUpdating)
    return <Loader size={60} />;
  if (isErrorCategories) return <div>Error</div>;
  if (!categories || categories.length === 0)
    return <div>No categories found</div>;

  return (
    <section className="flex flex-col gap-6 relative bg-fondo text-choco dark:bg-fondo-dark dark:text-cream mt-6">
      <header className="flex justify-between items-center flex-col gap-2.5 md:flex-row md:gap-5">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-2xl font-bold text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)] tracking-tight capitalize">
            {title}
          </h2>
        </div>
        <div className="flex flex-col gap-2.5 md:flex-row md:gap-5 top-0 right-0">
          <button
            className="inline-flex items-center gap-2 px-4 py-2 bg-cocoa hover:bg-cocoa/90 text-white text-sm font-medium rounded-md transition"
            type="button"
            onClick={() => navigate(-1)}
          >
            <MdOutlineCancel size={19} />
            Cancelar
          </button>
          <button
            type="submit"
            form="your-form-id"
            className="inline-flex items-center gap-2 px-4 py-2 bg-cocoa hover:bg-cocoa/90 text-white text-sm font-medium rounded-md transition"
          >
            <MdOutlineSaveAlt size={19} />
            Guardar Producto
          </button>
        </div>
      </header>

      <form
        onSubmit={onSubmit}
        id="your-form-id"
        className="grid grid-cols-1 lg:grid-cols-5 gap-6 auto-rows-max flex-1 items-stretch"
      >
        {/* Secciones aquí */}
        <SectionFormProduct
          titleSection="Identificación del Producto"
          className="h-full flex flex-col justify-between lg:col-span-3 "
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
          />
          <div className="h-full"></div>
        </SectionFormProduct>

        <SectionFormProduct
          titleSection="Detalles del Producto"
          className="h-full flex flex-col justify-between lg:col-span-2"
        >
          <div className="w-full mt-1">
            <label className="text-xs font-bold tracking-tight capitalize">
              Categoría:
            </label>
            <select
              {...register("category_id")}
              className="w-full rounded-md border border-cocoa/30 dark:border-cream/30 bg-transparent mt-1 px-2 py-2 font-medium text-sm focus:ring-2 focus:ring-cocoa/50 dark:focus:ring-cream/70 placeholder:text-choco/60 dark:placeholder:text-cream/60 dark:focus:border-cream/50 focus:border-cocoa/90"
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
          />
        </SectionFormProduct>

        <SectionFormProduct
          titleSection="Descripción del producto"
          className="h-full flex flex-col justify-between lg:col-span-3 "
        >
          <div>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Descripción del producto"
              className={`w-full px-4 py-2 border text-sm border-choco/50 dark:border-cream/10 rounded-md placeholder:font-normal focus:outline-none text-choco bg-cream dark:bg-fondo-dark dark:text-cream dark:focus:border-cream/50 focus:border-cocoa/90 focus:border-2 outline-none transition-all duration-300 ease-in-out${errors.description
                  ? "border-red-500"
                  : "border-cocoa/70 dark:border-cream/30 "
                }`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
        </SectionFormProduct>

        <SectionFormProduct
          titleSection="Imágenes del producto"
          className="h-full flex flex-col justify-between lg:col-span-2 "
        >
          <UploaderImages errors={errors} setValue={setValue} watch={watch} />
        </SectionFormProduct>
      </form>
    </section>
  );
};
