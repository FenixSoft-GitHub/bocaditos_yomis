import { extractFilePath } from "@/helpers";
import { ProductFormValues } from "@/lib/validators";
import { supabase } from "@/supabase/client";
import { Product, ProductInput, SupabaseRawProductWithRelations } from "@/interfaces/product.interface";
import slugify from "slugify";
import { isDiscountActive } from "@/lib/discount";

export const getProducts = async () => {
  try {
    const { data: products, error } = await supabase
      .from("products")
      .select("*, categories(*), discounts(*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      throw new Error(error.message);
    }

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }
};

// Obtener todos los productos paginados
export const getProductsPages = async (page: number) => {
  const itemsPerPage = 8;
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  try {
    const {
      data: products,
      error,
      count,
    } = await supabase
      .from("products")
      .select("*, categories(*), discounts(*)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Error fetching products:", error);
      throw new Error(error.message);
    }

    return { products, count };
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }
};

// Obtener productos recientes
// Helper para transformar la respuesta cruda de Supabase a la interfaz Product deseada
const transformProductData = (rawProduct: SupabaseRawProductWithRelations): Product => {
  const transformedCategories = rawProduct.categories || null; 

  // Encuentra el descuento activo (si hay varios, toma el primero activo)
  const activeDiscount = rawProduct.discounts
    ? rawProduct.discounts.find(isDiscountActive) || null
    : null;

  return {
    id: rawProduct.id,
    name: rawProduct.name,
    description: rawProduct.description,
    price: rawProduct.price,
    image_url: rawProduct.image_url,
    stock: rawProduct.stock,
    slug: rawProduct.slug,
    category_id: rawProduct.category_id,
    created_at: rawProduct.created_at,
    updated_at: rawProduct.updated_at,
    categories: transformedCategories, // Ahora es singular o null
    discount: activeDiscount,         // Ahora es singular activo o null
  };
};

// Obtener productos recientes
export const getRecentProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(*), discounts(*)")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error al obtener productos recientes:", error.message);
      throw new Error(error.message);
    }

    if (!data) return [];

    return (data as SupabaseRawProductWithRelations[]).map(transformProductData);
  } catch (error) {
    console.error("Error fetching recent products:", error);
    throw error;
  }
};

// Obtener productos populares (aleatorios)
export const getRandomProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(*), discounts(*)")
      .order("created_at", { ascending: false })
      .limit(24);

    if (error) {
      console.error("Error al obtener productos aleatorios:", error.message);
      throw new Error(error.message);
    }

    if (!data) return [];

    const transformedProducts = (data as SupabaseRawProductWithRelations[]).map(transformProductData);

    const filtered = transformedProducts.filter(
      (p) => p?.image_url?.length > 0 && p?.name
    );

    const randomProducts = filtered
      .sort(() => 0.5 - Math.random())
      .slice(0, 12);

    return randomProducts;
  } catch (error) {
    console.error("Error fetching random products:", error);
    return [];
  }
};

// Obtener productos con descuentos activos
export const getDiscountedProducts = async (): Promise<Product[]> => {
  try {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("products")
      .select("*, categories(*), discounts(*)")
      .not("discounts", "is", null)
      .lte("discounts.starts_at", now)
      .gte("discounts.ends_at", now)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error al obtener productos con descuento:", error.message);
      throw new Error(error.message);
    }

    if (!data) return [];

    const transformedProducts = (data as SupabaseRawProductWithRelations[]).map(transformProductData);

    // Filtra para asegurar que solo se devuelvan productos con un descuento activo válido
    return transformedProducts.filter(p => p.discount !== null);
  } catch (error) {
    console.error("Error fetching discounted products:", error);
    return [];
  }
};

// Función para obtener un producto por ID, incluyendo sus relaciones.
// Retorna un objeto Product (la interfaz unificada) o null.
export const getByIdProduct = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*), discounts(*)") // Asegúrate de seleccionar categories y discounts
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") { // "No rows found"
      return null;
    }
    console.error("Error al obtener producto con descuento:", error);
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  // Realizamos el casting a la interfaz cruda que Supabase devuelve
  const rawProductData = data as SupabaseRawProductWithRelations;

  // Luego transformamos esa data cruda a nuestra interfaz 'Product' unificada
  // para que el frontend siempre trabaje con un tipo consistente.
  return transformProductData(rawProductData);
};

//Función para obtener productos por categoría (o todos si no se especifica categoría)
export const getProductsByCategory = async ({
  page = 1,
  category = "",
  search = "",
}: {
  page: number;
  category: string;
  search: string;
}): Promise<{ products: Product[]; count: number }> => {
  page = Number(page) || 1;
  const itemsPerPage = 8;
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  let query = supabase
    .from("products")
    .select("*, categories!inner(id, name), discounts(*)", { count: "exact" })
    .range(from, to)
    .order("name", { ascending: true });

  if (category) {
    query = query.eq("categories.name", category);
  }

  if (search && search.trim().length >= 2) {
    query = query.ilike("name", `%${search}%`);
  }
  

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching filtered products:", error.message);
    throw new Error(`Error fetching products: ${error.message}`);
  }

  const transformedProducts: Product[] = (
    data as SupabaseRawProductWithRelations[]
  ).map(transformProductData);

  return { products: transformedProducts, count: count ?? 0 };
};

export const getProductBySlug = async (slug: string) => {
  if (!slug) throw new Error("Slug is required");
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(*), discounts(*)")
      .eq("slug", slug)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.log(error.message);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Error fetching random product:", error);
    throw error;
  }
};

export const searchProducts = async (searchTerm: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(*), discounts(*)")
      .ilike("name", `%${searchTerm}%`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error searching products:", error.message);
      throw new Error(error.message);
    }

    if (!data) {
      return []; // Si no hay datos, devuelve un array vacío
    }
    
    // Mapea la data cruda de Supabase a la interfaz Product unificada
    const transformedProducts: Product[] = (
      data as SupabaseRawProductWithRelations[]
    ).map(transformProductData);


    return transformedProducts;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

/* ********************************** */
/*            ADMINISTRADOR           */
/* ********************************** */

export const createProduct = async (values: ProductInput) => {
  try {
    // Validar imágenes
    if (!values.images || !Array.isArray(values.images)) {
      throw new Error("Las imágenes del producto no son válidas");
    }

    // Generar slug
    const slug =
      values.slug ?? slugify(values.name, { lower: true, strict: true });
   
    const folderName = crypto.randomUUID(); // Nombre único si aún no hay ID

    // Subir imágenes
    const uploadedImages = await Promise.all(
      values.images.map(async (image) => {
        const { data, error } = await supabase.storage
          .from("product-image")
          .upload(`${folderName}/${image.name}`, image, {
            upsert: true,
          });

        if (error) throw new Error(`Error al subir imagen: ${error.message}`);
        if (!data?.path)
          throw new Error("No se encontró el path del archivo subido");

        const { data: urlData } = supabase.storage
          .from("product-image")
          .getPublicUrl(data.path);

        if (!urlData?.publicUrl) {
          throw new Error("No se pudo obtener la URL pública de la imagen");
        }

        return urlData.publicUrl;
      })
    );

    // Crear el producto con las imágenes ya subidas
    const payload = {
      name: values.name,
      price: values.price,
      stock: values.stock,
      category_id: values.category_id,
      description: values.description ?? "",
      image_url: uploadedImages,
      slug,
    };

    const { data: product, error: productError } = await supabase
      .from("products")
      .insert(payload)
      .select()
      .single();

    if (productError)
      throw new Error(`Error al crear el producto: ${productError.message}`);

    return product;
  } catch (error) {
    console.error("Error al crear el producto:", error);
    throw error;
  }
};

// const extractFilePath = (url: string) => url.split("/").slice(-2).join("/");

export const deleteProduct = async (productId: string) => {
  if (!productId) throw new Error("ID de producto no válido");

  // 1. Obtener imágenes del producto
  const { data: productImages, error: productImagesError } = await supabase
    .from("products")
    .select("image_url")
    .eq("id", productId)
    .single();

  if (productImagesError) throw new Error(productImagesError.message);

  const imageUrls = productImages.image_url || [];

  // 2. Eliminar imágenes del bucket si existen
  if (imageUrls.length > 0) {
    const paths = imageUrls.map(extractFilePath);

    const { error: storageError } = await supabase.storage
      .from("product-image")
      .remove(paths);

    if (storageError)
      throw new Error("Error al eliminar imágenes: " + storageError.message);
  }

  // 3. Eliminar el producto
  const { error: productDeleteError } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (productDeleteError)
    throw new Error(
      "Error al eliminar producto: " + productDeleteError.message
    );

  return true;
};

//Aca la nueva función la anterior comentada al final
export const updateProduct = async (
  productId: string,
  productInput: ProductFormValues
) => {
  if (!productId) throw new Error("ID de producto no válido");
  if (!Array.isArray(productInput.image_url))
    throw new Error("Imágenes inválidas");

  const slug =
    productInput.slug ??
    slugify(productInput.name, { lower: true, strict: true });

  // Obtener imágenes actuales
  const { data: currentProduct, error: currentProductError } = await supabase
    .from("products")
    .select("image_url")
    .eq("id", productId)
    .single();

  if (currentProductError) throw new Error(currentProductError.message);

  const existingImages = currentProduct.image_url || [];

  const validImages = productInput.image_url.filter(Boolean) as (
    | string
    | File
  )[];
  const imagesToDelete = existingImages.filter(
    (image) => !validImages.includes(image)
  );

  const filesToDelete = imagesToDelete.map(extractFilePath);

  if (filesToDelete.length > 0) {
    const { error: deleteError } = await supabase.storage
      .from("product-image")
      .remove(filesToDelete);

    if (deleteError) throw new Error(deleteError.message);
  }

  const uploadedImages = await Promise.all(
    validImages.map(async (image) => {
      if (image instanceof File) {
        const filePath = `${productId}/${crypto.randomUUID()}-${image.name}`;
        const { data, error } = await supabase.storage
          .from("product-image")
          .upload(filePath, image, { upsert: true });

        if (error) throw new Error(error.message);

        const { data: publicUrlData } = supabase.storage
          .from("product-image")
          .getPublicUrl(data.path);

        if (!publicUrlData?.publicUrl) {
          throw new Error("No se pudo obtener la URL pública de la imagen");
        }

        return publicUrlData.publicUrl;
      } else {
        return image; // URL existente
      }
    })
  );

  const { data: updatedProduct, error: updateError } = await supabase
    .from("products")
    .update({
      name: productInput.name,
      stock: productInput.stock,
      slug,
      price: productInput.price,
      description: productInput.description,
      category_id: productInput.category_id,
      image_url: uploadedImages,
    })
    .eq("id", productId)
    .select()
    .single();

  if (updateError) throw new Error(updateError.message);

  return updatedProduct;
};