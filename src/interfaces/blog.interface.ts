export interface BlogPost {
  id: string;
  created_at: string;
  title: string;
  slug: string;
  content_markdown: string;
  author_id: string;
  image_url: string | null; // Esto es lo que viene de la DB
  status: "draft" | "published" | "archived";
  published_at: string | null;
  display_author_name: string;
  updated_at: string;
  excerpt: string | null;
}

// Lo que TU ACCIÓN espera para la creación
export interface CreateBlogPost {
  title: string;
  slug: string;
  content_markdown: string;
  author_id: string;
  image_file: File; // La acción espera un OBJETO File
  status: "draft" | "published" | "archived";
  published_at: string | null;
  display_author_name: string;
  excerpt: string | null;
}

// Lo que TU ACCIÓN espera para la actualización
export interface UpdateBlogPost {
  title?: string;
  slug?: string;
  content_markdown?: string;
  image_file?: File; // La acción espera un OBJETO File o null
  image_url?: string | null; // La acción espera una URL (string) o null para la imagen
  status?: "draft" | "published" | "archived";
  published_at?: string | null;
  display_author_name?: string;
  excerpt: string | null;
}

// --- ACTUALIZACIÓN CLAVE AQUÍ ---
// Estructura de datos para React Hook Form para creación
// ¡image_url ya NO está aquí! Se maneja fuera de RHF.
export interface FormDataCreate {
  title: string;
  slug: string;
  content_markdown: string;
  status: string | "draft" | "published" | "archived";
  published_at: string;
  display_author_name: string;
  excerpt: string | null;
}

// Estructura de datos para React Hook Form para actualización
// ¡image_url ya NO está aquí! Se maneja fuera de RHF.
export interface FormDataUpdate {
  title?: string;
  slug?: string;
  content_markdown?: string;
  status?: string | "draft" | "published" | "archived";
  published_at?: string;
  display_author_name?: string;
  excerpt?: string | null;
}

// --- OTROS TIPOS RELACIONADOS (se mantienen igual) ---
export interface User {
  id: string;
  full_name: string | null;
  email: string | null;
}

// --- NUEVO TIPO PARA LOS VALORES POR DEFECTO ---
// Este tipo nos permite inicializar `image_url` con `undefined` o `null`
// para el `defaultValues` del formulario, aunque luego el `register` lo mapee a FileList.
export type FormDefaultValues = Omit<FormDataCreate, "image_url"> & {
  image_url?: FileList | undefined | null; // Acepta FileList, undefined o null para el default
};

// O si es para la edición:
export type FormEditDefaultValues = Omit<FormDataUpdate, "image_url"> & {
  image_url?: string | undefined | null; // Cuando es edición, la URL puede ser string, o undefined/null para el input de archivo.
};

export type BlogPostWithAuthor = BlogPost & {
  author: Pick<User, "full_name" | "email"> | null;
};
