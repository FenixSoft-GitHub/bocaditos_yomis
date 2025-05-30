import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchBlogPosts,
  fetchBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogPostBySlug,
} from "@/actions";
import { CreateBlogPost, UpdateBlogPost, BlogPost } from "@/interfaces";
import { toast } from "react-hot-toast"; // O la librería de notificaciones que uses

export const useBlogPosts = () => {
  const queryClient = useQueryClient();

  // Obtener todas las publicaciones del blog
  const {
    data: blogPosts,
    isLoading: isLoadingBlogPosts,
    error: blogPostsError,
  } = useQuery<BlogPost[]>({
    queryKey: ["blogPosts"],
    queryFn: fetchBlogPosts,
  });

  // Mutación para crear una nueva publicación
  const createPostMutation = useMutation<BlogPost, Error, CreateBlogPost>({
    mutationFn: createBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] }); // Invalida el caché para que se refetch la lista
      toast.success("Publicación creada exitosamente!");
    },
    onError: (error) => {
      toast.error(`Error al crear la publicación: ${error.message}`);
    },
  });

  // Mutación para actualizar una publicación
  const updatePostMutation = useMutation<
    BlogPost,
    Error,
    { id: string; data: UpdateBlogPost }
  >({
    mutationFn: ({ id, data }) => updateBlogPost(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
      queryClient.invalidateQueries({ queryKey: ["blogPost", variables.id] }); // También invalida el post individual
      toast.success("Publicación actualizada exitosamente!");
    },
    onError: (error) => {
      toast.error(`Error al actualizar la publicación: ${error.message}`);
    },
  });

  // Mutación para eliminar una publicación
  const deletePostMutation = useMutation<void, Error, string>({
    mutationFn: deleteBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
      toast.success("Publicación eliminada exitosamente!");
    },
    onError: (error) => {
      toast.error(`Error al eliminar la publicación: ${error.message}`);
    },
  });

  return {
    blogPosts,
    isLoadingBlogPosts,
    blogPostsError,
    createPost: createPostMutation.mutate,
    isCreatingPost: createPostMutation.isPending,
    updatePost: updatePostMutation.mutate,
    isUpdatingPost: updatePostMutation.isPending,
    deletePost: deletePostMutation.mutate,
    isDeletingPost: deletePostMutation.isPending,
  };
};

// Hook para obtener una sola publicación por ID
export const useBlogPost = (id: string) => {
  const {
    data: blogPost,
    isLoading,
    error,
  } = useQuery<BlogPost>({
    queryKey: ["blogPost", id],
    queryFn: () => fetchBlogPostById(id),
    enabled: !!id, // Solo ejecuta la query si el ID está presente
  });

  return {
    blogPost,
    isLoadingBlogPost: isLoading,
    blogPostError: error,
  };
};

/**
 * Hook para obtener un post específico por su slug.
 */
export const useBlogPostBySlug = (slug: string) => {
    return useQuery<BlogPost | null, Error>({
      queryKey: ['blogPost', slug],
      queryFn: () => getBlogPostBySlug(slug),
      enabled: !!slug, // Solo ejecuta la query si el slug existe
    });
  };
