import { supabase } from "@/supabase/client";
import { CreateBlogPost, UpdateBlogPost, BlogPost } from "@/interfaces";

// Obtener todas las publicaciones del blog
export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const { data: blogPosts, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching blog posts:", error);
      throw new Error(error.message);
    }

    return blogPosts as BlogPost[];
  } catch (error) {
    // Aquí el tipo es 'unknown'
    console.error("Error fetching blog posts:", error);
    // Hacemos una aserción de tipo para acceder a .message
    throw new Error(
      (error as Error).message || "Error al obtener las publicaciones del blog."
    );
  }
};

// Obtener una publicación por ID
export const fetchBlogPostById = async (id: string): Promise<BlogPost> => {
  try {
    const { data: blogPost, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching blog post with ID ${id}:`, error);
      throw new Error(error.message);
    }

    return blogPost as BlogPost;
  } catch (error) {
    console.error(`Error fetching blog post with ID ${id}:`, error);
    throw new Error(
      (error as Error).message ||
        `Error al obtener la publicación con ID: ${id}`
    );
  }
};

// Obtener una publicación por ID
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost> => {
  try {
    const { data: blogPost, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error(`Error fetching blog post with slug ${slug}:`, error);
      throw new Error(error.message);
    }

    return blogPost as BlogPost;
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    throw new Error(
      (error as Error).message ||
        `Error al obtener la publicación con slug: ${slug}`
    );
  }
};

// Crear una nueva publicación
export const createBlogPost = async (post: CreateBlogPost): Promise<BlogPost> => {
  try {
    if (!post.image_file) {
      throw new Error("La imagen del post es requerida.");
    }

    const folderName = crypto.randomUUID();
    const fileName = `${folderName}/${post.image_file.name}`;

    const { data: dataImage, error: errorImage } = await supabase.storage
      .from("blog")
      .upload(fileName, post.image_file, {
        upsert: true,
      });

    if (errorImage) {
      console.error("Error al subir imagen:", errorImage);
      throw new Error(`Error al subir imagen: ${errorImage.message}`);
    }
    if (!dataImage?.path) {
      throw new Error("No se encontró el path del archivo subido");
    }

    const { data: urlData } = supabase.storage
      .from("blog")
      .getPublicUrl(dataImage.path);

    if (!urlData?.publicUrl) {
      throw new Error("No se pudo obtener la URL pública de la imagen");
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .insert([
        {
          title: post.title,
          slug: post.slug,
          content_markdown: post.content_markdown,
          author_id: post.author_id,
          image_url: urlData.publicUrl,
          status: post.status,
          published_at: post.published_at,
          display_author_name: post.display_author_name,
          excerpt: post.excerpt, // Asegúrate de incluir excerpt aquí
          created_at: new Date().toISOString(),
        },
      ])
      .select("*")
      .single();

    if (error) {
      console.error("Error creating blog post:", error);
      throw new Error(error.message);
    }

    return data as BlogPost;
  } catch (error) {
    console.error("Error creating blog post:", error);
    throw new Error((error as Error).message || "Error al crear la publicación.");
  }
};

// Actualizar una publicación existente
export const updateBlogPost = async (
  id: string,
  postData: UpdateBlogPost // Ahora postData puede tener image_file
): Promise<BlogPost> => {
  try {
    let imageUrlToUpdate: string | null | undefined;

    // Si se proporciona un nuevo archivo de imagen, subirlo primero
    if (postData.image_file) {
      const folderName = crypto.randomUUID();
      const fileName = `${folderName}/${postData.image_file.name}`;

      const { data: dataImage, error: errorImage } = await supabase.storage
        .from("blog")
        .upload(fileName, postData.image_file, {
          upsert: true,
        });

      if (errorImage) {
        console.error("Error al subir nueva imagen para actualizar:", errorImage);
        throw new Error(`Error al subir nueva imagen: ${errorImage.message}`);
      }
      if (!dataImage?.path) {
        throw new Error("No se encontró el path de la nueva imagen subida para actualizar");
      }

      const { data: urlData } = supabase.storage
        .from("blog")
        .getPublicUrl(dataImage.path);

      if (!urlData?.publicUrl) {
        throw new Error("No se pudo obtener la URL pública de la nueva imagen para actualizar");
      }
      imageUrlToUpdate = urlData.publicUrl;
    } else {
      // Si no se proporciona un nuevo archivo de imagen, usar la URL existente (o null si se desea borrar)
      imageUrlToUpdate = postData.image_url;
    }

    // Preparar los datos a actualizar en la DB, excluyendo image_file
    const { image_file, ...dataToUpdate } = postData; // Separar image_file
    // const { ...dataToUpdate } = postData; // Separar image_file

    if(!image_file) {
      // Si no hay image_file, aseguramos que image_url sea null o una cadena vacía
      console.warn("No se proporcionó un nuevo archivo de imagen, usando la URL existente o null.");
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .update({
        ...dataToUpdate, // Contiene title, slug, content_markdown, status, etc.
        image_url: imageUrlToUpdate, // Aquí asignamos la URL final
        updated_at: new Date().toISOString(), // Añadir un campo de fecha de actualización
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Error updating blog post:", error);
      throw new Error(error.message);
    }

    return data as BlogPost;
  } catch (error) {
    console.error("Error updating blog post:", error);
    throw new Error((error as Error).message || "Error al actualizar la publicación.");
  }
};

// export const createBlogPost = async (
//   post: CreateBlogPost
// ): Promise<BlogPost> => {
//   try {
//     // Validar imágenes
//     if (!post.image_file) {
//       throw new Error("Las imágenes del post no es válida");
//     }

//     const folderName = crypto.randomUUID();
//     const fileName = `${folderName}/${post.image_file.name}`;

//     const { data: dataImage, error: errorImage } = await supabase.storage
//       .from("blog")
//       .upload(fileName, post.image_file, {
//         upsert: true,
//       });

//       if (errorImage) {
//         console.error("Error al subir imagen:", errorImage);
//         throw new Error(`Error al subir imagen: ${errorImage.message}`);
//       }
//       if (!dataImage?.path) {
//         throw new Error("No se encontró el path del archivo subido");
//       }

//     const { data: urlData } = supabase.storage
//       .from("blog")
//       .getPublicUrl(dataImage.path);

//     if (!urlData?.publicUrl) {
//       throw new Error("No se pudo obtener la URL pública de la imagen");
//     }

//     // return urlData.publicUrl;

//     const { data, error } = await supabase
//       .from("blog_posts")
//       .insert([
//         {
//           title: post.title,
//           slug: post.slug,
//           content_markdown: post.content_markdown,
//           author_id: post.author_id, // Aquí TypeScript esperará un string
//           image_url: urlData.publicUrl,
//           status: post.status,
//           published_at: post.published_at,
//           display_author_name: post.display_author_name,
//           created_at: new Date().toISOString(),
//           excerpt: post.excerpt, 
//         },
//       ])
//       .select("*")
//       .single();

//     if (error) {
//       console.error("Error creating blog post:", error);
//       throw new Error(error.message);
//     }

//     return data as BlogPost;
//   } catch (error) {
//     console.error("Error creating blog post:", error);
//     throw new Error(
//       (error as Error).message || "Error al crear la publicación."
//     );
//   }
// };

// export const createBlogPost = async (post: CreateBlogPost): Promise<BlogPost> => {
//   try {
    
//     // Validar imágenes
//     if (!post.image_url) {
//       throw new Error("Las imágenes del post no es válida");
//     }

//     const folderName = crypto.randomUUID();

//     const { data: dataImage, error: errorImage } = await supabase.storage
//       .from("blog")
//       .upload(`${folderName}/${post.image_url}`, post.image_url, {
//         upsert: true,
//       });

//     if (errorImage) throw new Error(`Error al subir imagen: ${errorImage.message}`);
//     if (!dataImage?.path)
//       throw new Error("No se encontró el path del archivo subido");

//     const { data: urlData } = supabase.storage
//       .from("blog")
//       .getPublicUrl(dataImage.path);

//     if (!urlData?.publicUrl) {
//       throw new Error("No se pudo obtener la URL pública de la imagen");
//     }

//     // return urlData.publicUrl;

//     const { data, error } = await supabase
//       .from("blog_posts")
//       .insert([
//         {
//           title: post.title,
//           slug: post.slug,
//           content_markdown: post.content_markdown,
//           author_id: post.author_id, // Aquí TypeScript esperará un string
//           image_url: urlData.publicUrl,
//           status: post.status,
//           published_at: post.published_at,
//           display_author_name: post.display_author_name, 
//           created_at: new Date().toISOString(),
//         },
//       ])
//       .select("*")
//       .single();

//     if (error) {
//       console.error("Error creating blog post:", error);
//       throw new Error(error.message);
//     }

//     return data as BlogPost;
//   } catch (error) {
//     console.error("Error creating blog post:", error);
//     throw new Error((error as Error).message || "Error al crear la publicación.");
//   }
// };

// Actualizar una publicación
// export const updateBlogPost = async (
//   id: string,
//   values: UpdateBlogPost
// ): Promise<BlogPost> => {
//   try {
//     const { data, error } = await supabase
//       .from("blog_posts")
//       .update({
//         title: values.title,
//         slug: values.slug,
//         content_markdown: values.content_markdown,
//         image_url: values.image_url,
//         status: values.status,
//         published_at: values.published_at,
//         display_author: values.display_author_name,
//       })
//       .eq("id", id)
//       .select("*, author:auth_users(full_name, email)")
//       .single();

//     if (error) {
//       console.error(`Error updating blog post with ID ${id}:`, error);
//       throw new Error(error.message);
//     }

//     return data as BlogPost;
//   } catch (error) {
//     console.error(`Error updating blog post with ID ${id}:`, error);
//     throw new Error(
//       (error as Error).message ||
//         `Error al actualizar la publicación con ID: ${id}`
//     );
//   }
// };

// Eliminar una publicación
export const deleteBlogPost = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (error) {
      console.error(`Error deleting blog post with ID ${id}:`, error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error(`Error deleting blog post with ID ${id}:`, error);
    throw new Error(
      (error as Error).message ||
        `Error al eliminar la publicación con ID: ${id}`
    );
  }
};
