import { extractFilePath } from "@/helpers";
import { ProductFormValues } from "@/lib/validators";
import { supabase } from "@/supabase/client";
import { ProductInput } from "@/interfaces/product.interface";

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
    const payload = {
      name: values.name,
      price: values.price,
      stock: values.stock,
      category_id: values.category_id,
      description: values.description ?? "",
      image_url: [],
      slug: values.slug ?? values.name.toLowerCase().replace(/\s+/g, "-"),
    };

    const { data: product, error: productError } = await supabase
      .from("products")
      .insert(payload)
      .select()
      .single();

    if (productError)
      throw new Error(`Error al cargar el producto ${productError.message}`);

    // Validamos antes del map
    if (!values.images || !Array.isArray(values.images)) {
      throw new Error("Las imágenes del producto no son válidas");
    }

    const folderName = product.id;

    const uploadedImages = await Promise.all(
      values.images.map(async (image) => {
        const { data, error } = await supabase.storage
          .from("product-image")
          .upload(`${folderName}/${image.name}`, image);

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

    // Actualizar el producto con las imágenes
    const { error: updatedError } = await supabase
      .from("products")
      .update({
        image_url: uploadedImages,
      })
      .eq("id", product.id);

    if (updatedError)
      throw new Error(`Error al actualizar imagenes ${updatedError.message}`);

    return product;
  } catch (error) {
    console.error("Error al crear el producto:", error);
    throw error;
  }
};

export const deleteProduct = async (productId: string) => {
  // 2. Obtener las imágenes del producto antes de eliminarlo
  const { data: productImages, error: productImagesError } = await supabase
    .from("products")
    .select("image_url")
    .eq("id", productId)
    .single();

  if (productImagesError) throw new Error(productImagesError.message);

  // 3. Eliminar el producto
  const { error: productDeleteError } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (productDeleteError) throw new Error(productDeleteError.message);

  // 4. Eliminar las imágenes del bucket
  if (productImages.image_url.length > 0) {
    const folderName = productId;

    const paths = productImages.image_url.map((image) => {
      const fileName = image.split("/").pop();
      return `${folderName}/${fileName}`;
    });

    const { error: storageError } = await supabase.storage
      .from("product-image")
      .remove(paths);

    if (storageError) throw new Error(storageError.message);
  }

  return true;
};

//Aca la nueva función la anterior comentada al final
export const updateProduct = async (
  productId: string,
  productInput: ProductFormValues
) => {
  const { data: currentProduct, error: currentProductError } = await supabase
    .from("products")
    .select("image_url")
    .eq("id", productId)
    .single();

  if (currentProductError) throw new Error(currentProductError.message);

  const existingImages = currentProduct.image_url || [];

  const validImages = productInput.image_url.filter(Boolean) as (string | File)[];
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
        const { data, error } = await supabase.storage
          .from("product-image")
          .upload(`${productId}/${Date.now()}-${image.name}`, image);
        if (error) throw new Error(error.message);
        return supabase.storage
          .from("product-image")
          .getPublicUrl(data.path).data.publicUrl;
      } else {
        return image;
      }
    })
  );

  const { data: updatedProduct, error: updateError } = await supabase
    .from("products")
    .update({
      name: productInput.name,
      stock: productInput.stock,
      slug: productInput.slug,
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

// export const updateProduct = async (
//   productId: string,
//   productInput: ProductFormValues
// ) => {
//   // 1. Obtener las imágenes actuales del producto
//   const { data: currentProduct, error: currentProductError } = await supabase
//     .from("products")
//     .select("image_url")
//     .eq("id", productId)
//     .single();

//   if (currentProductError) throw new Error(currentProductError.message);

//   const existingImages = currentProduct.image_url || [];

//   // 2. Actualizar la información individual del producto
//   const { data: updatedProduct, error: productError } = await supabase
//     .from("products")
//     .update({
//       name: productInput.name,
//       stock: productInput.stock,
//       slug: productInput.slug,
//       price: productInput.price,
//       description: productInput.description,
//       category_id: productInput.category_id,
//     })
//     .eq("id", productId)
//     .select()
//     .single();

//   if (productError) throw new Error(productError.message);

//   // 3. Manejo de imágenes (SUBIR NUEVAS y ELIMINAR ANTIGUAS SI ES NECESARIO)
//   const folderName = productId;

//   const validImages = productInput.image_url.filter((image) => image) as [
//     File | string
//   ];

//   // 3.1 Identificar las imágenes que han sido eliminadas
//   const imagesToDelete = existingImages.filter(
//     (image) => !validImages.includes(image)
//   );

//   // 3.2 Obtener los paths de los archivos a eliminar
//   const filesToDelete = imagesToDelete.map(extractFilePath);

//   // 3.3 Eliminar las imágenes del bucket
//   if (filesToDelete.length > 0) {
//     const { error: deleteImagesError } = await supabase.storage
//       .from("product-image")
//       .remove(filesToDelete);

//     if (deleteImagesError) {
//       console.log(deleteImagesError);
//       throw new Error(deleteImagesError.message);
//     } else {
//       console.log(`Imagenes eliminadas: ${filesToDelete.join(", ")}`);
//     }
//   }

//   // 3.4 Subir las nuevas imágenes y construir el array de imágenes actualizado
//   const uploadedImages = await Promise.all(
//     validImages.map(async (image) => {
//       if (image instanceof File) {
//         // Si la imagen no es una URL (es un archivo), entonces subela al bucket
//         const { data, error } = await supabase.storage
//           .from("product-image")
//           .upload(`${folderName}/${productId}-${image.name}`, image);

//         if (error) throw new Error(error.message);

//         const imageUrl = supabase.storage
//           .from("product-image")
//           .getPublicUrl(data.path).data.publicUrl;

//         return imageUrl;
//       } else if (typeof image === "string") {
//         return image;
//       } else {
//         throw new Error("Tipo de imagen no soportado");
//       }
//     })
//   );

//   // 4. Actualizar el productos con las imagenes actualizadas
//   const { error: updateImagesError } = await supabase
//     .from("products")
//     .update({ image_url: uploadedImages })
//     .eq("id", productId);

//   if (updateImagesError) throw new Error(updateImagesError.message);

//   return updatedProduct;
// };
