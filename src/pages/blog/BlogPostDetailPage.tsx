import React from "react";
import { useParams } from "react-router-dom";
import { useBlogPostBySlug } from "@/hooks";
import { Loader } from "@/components/shared/Loader";
import { BackButton } from "@/components/shared/BackButton";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // Añadido para mejor soporte de sintaxis MD
import { SEOHead } from "@/components/seo/SEOHead";
import { blogPostSchema, breadcrumbSchema } from "@/components/seo/schemas";

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
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader size={60} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-16">
        <p className="font-semibold text-lg">Error al cargar el artículo</p>
        <p className="text-sm opacity-80 mt-1">{error?.message}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-xl">
        <h1 className="text-3xl font-bold text-red-600">
          Artículo no encontrado
        </h1>
        <p className="text-choco/70 dark:text-cream/70 mt-4">
          El artículo que buscas no existe o no está publicado.
        </p>
        <div className="flex justify-center mt-8">
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
    <>
      <SEOHead
        title={post.title}
        description={post.excerpt || post.title}
        canonical={`/blog/${post.slug}`}
        ogType="article"
        ogImage={post.image_url || undefined}
        schema={[
          blogPostSchema({
            title: post.title,
            description: post.excerpt || post.title,
            image: post.image_url || undefined,
            slug: post.slug,
            publishedAt: post.published_at || new Date().toISOString(),
            updatedAt: post.updated_at || undefined,
            authorName: post.display_author_name || undefined,
          }),
          breadcrumbSchema([
            { name: "Inicio", url: "/" },
            { name: "Blog", url: "/blog" },
            { name: post.title, url: `/blog/${post.slug}` },
          ]),
        ]}
      />

      {/* Contenedor optimizado con un max-w ideal para lectura de artículos */}
      <article className="container mx-auto px-4 sm:px-6 py-8 max-w-3xl text-choco dark:text-cream bg-fondo dark:bg-fondo-dark">
        {/* Cabecera del Post */}
        <header className="my-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            {post.title}
          </h1>
          <div className="text-sm text-choco/60 dark:text-cream/60 flex flex-wrap items-center justify-center gap-2">
            <span>{formattedDate}</span>
            <span className="hidden sm:inline">·</span>
            <span className="font-medium text-cocoa dark:text-butter">
              Por: {authorNameToDisplay}
            </span>
          </div>
        </header>

        {/* Imagen Destacada con Aspect Ratio Fluido */}
        {post.image_url && (
          <div className="w-full aspect-[16/9] mb-10 rounded-2xl overflow-hidden shadow-md border border-cocoa/10 dark:border-cream/10">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Cuerpo del Artículo (Markdown) */}
        <div
          className="prose prose-choco dark:prose-invert max-w-none mb-12
          prose-headings:font-bold prose-headings:tracking-tight
          prose-p:leading-relaxed prose-p:text-base sm:prose-p:text-lg
          prose-a:text-dorado dark:prose-a:text-butter hover:prose-a:underline
          prose-img:rounded-xl prose-img:shadow-sm
          prose-blockquote:border-l-4 prose-blockquote:border-cocoa dark:prose-blockquote:border-butter prose-blockquote:italic"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content_markdown || ""}
          </ReactMarkdown>
        </div>

        {/* Footer del Post / Navegación */}
        <footer className="flex items-center justify-end py-4 border-t border-cocoa/10 dark:border-cream/10">
          <BackButton />
        </footer>
      </article>
    </>
  );
};

export default BlogPostDetailPage;