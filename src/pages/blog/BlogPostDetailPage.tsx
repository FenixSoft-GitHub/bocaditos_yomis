import React from "react";
import { useParams } from "react-router-dom";
import { useBlogPostBySlug } from "@/hooks";
import { Loader } from "@/components/shared/Loader";
import { BackButton } from "@/components/shared/BackButton";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ReactMarkdown from "react-markdown";

const BlogPostDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: post,
    isLoading,
    isError,
    error,
  } = useBlogPostBySlug(slug || "");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen mt-20">
        <Loader size={60} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-10 mt-20">
        <p>Error al cargar el artículo: {error?.message}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 text-center mt-20">
        <h1 className="text-3xl font-bold text-red-600">
          Artículo no encontrado
        </h1>
        <p className="text-gray-700 dark:text-cream mt-4">
          El artículo que buscas no existe o no está publicado.
        </p>
        <div className="flex items-center gap-2 group justify-center mt-8">
          <BackButton />
        </div>
      </div> 
    );
  }

  const formattedDate = post.published_at
    ? format(new Date(post.published_at), "PPP", { locale: es })
    : "Fecha no disponible";

  const authorNameToDisplay = post.display_author_name || "Autor desconocido";

  return (
    <div className="container mx-auto text-choco dark:text-cream bg-fondo dark:bg-fondo-dark">
      <div className="flex items-center justify-center gap-2 pt-36">
        {post.image_url && (
          <div className="relative h-[480px] w-full sm:w-3/4 mb-8">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <div className="px-4 sm:px-24 py-10">
        <h1 className="text-4xl font-bold mb-4 text-center">{post.title}</h1>
        <p className="text-center mb-8">
          Fecha: {formattedDate} {`| Por: ${authorNameToDisplay}`}
        </p>

        <div className="prose prose-lg max-w-none mb-8 dark:prose-invert">
          <ReactMarkdown>{post.content_markdown || ""}</ReactMarkdown>
        </div>
        <div className="flex items-center gap-2 group justify-end">
          <BackButton />
        </div>
      </div>
    </div>
  );
};

export default BlogPostDetailPage;
