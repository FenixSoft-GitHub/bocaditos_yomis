import { extractFilePath } from "@/helpers";
import { ProductFormValues } from "@/lib/validators";
import { supabase } from "@/supabase/client";
import { ProductInput } from "@/interfaces/product.interface";
import slugify from "slugify";

// Obtener todos los productos
export const getProducts = async () => {
  try {
    const { data: products, error } = await supabase
      .from("products")
      .select("*, categories(*)")
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
      .select("*, categories(*)", { count: "exact" })
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
export const getRecentProducts = async () => {
  try {
    const { data: products, error } = await supabase
      .from("products")
      .select("*, categories(*)")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.log(error.message);
      throw new Error(error.message);
    }

    return products;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// Obtener productos populares
export const getRandomProducts = async () => {
  try {
    const { data: products, error } = await supabase
      .from("products")
      .select("*, categories(*)")
      .order("created_at", { ascending: false })
      .limit(24); // obtén más para tener margen

    if (error) throw new Error(error.message);

    if (!products) return [];

    // Filtrar productos válidos
    const filtered = products.filter(
      (p) => p?.image_url?.length > 0 && p?.name
    );

    // Mezclar aleatoriamente en el cliente
    const randomProducts = filtered
      .sort(() => 0.5 - Math.random())
      .slice(0, 12); // devolver 12 aleatorios

    return randomProducts;
  } catch (error) {
    console.error("Error fetching random products:", error);
    return [];
  }
};

export const getProductsByCategory = async ({
  page = 1,
  category = "",
}: {
  page: number;
  category: string;
}) => {
  try {
    page = Number(page) || 1;
    const itemsPerPage = 8;
    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    const baseQuery = supabase
      .from("products")
      .select("*, categories!inner(name)", { count: "exact" })
      .range(from, to)
      .order("name", { ascending: true });

    const query = category
      ? baseQuery.eq("categories.name", category)
      : baseQuery;

    const { data: products, error, count } = await query;

    if (error) {
      console.error("Error fetching filtered products:", error.message);
      throw new Error(`Error fetching products: ${error.message}`);
    }

    return {
      products,
      count: count ?? 0,
    };
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    throw error;
  }
};

export const getProductBySlug = async (slug: string) => {
  if (!slug) throw new Error("Slug is required");
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(*)")
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

export const searchProducts = async (searchTerm: string) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(*)")
      .ilike("name", `%${searchTerm}%`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error searching products:", error.message);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

export const getByIdProduct = async (id: string) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
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