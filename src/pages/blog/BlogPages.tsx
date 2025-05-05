// src/pages/BlogPostPage.tsx
import React from "react";
import { useParams } from "react-router-dom";
import { getPostBySlug } from "@/utils/getPosts"; // Importamos la función para obtener un post
import { IoReturnUpBack } from "react-icons/io5";
import { Link } from "react-router-dom";

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>(); // Obtiene el slug de la URL
  console.log("Slug:", slug); // Verifica el slug en la consola
  
  // Busca el post usando el slug
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-red-600">Post no encontrado</h1>
        <p className="text-gray-700 dark:text-cream mt-4">El artículo que buscas no existe.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto text-choco dark:text-cream bg-fondo dark:bg-fondo-dark">
      <div className="flex items-center justify-center gap-2 pt-32">
        {typeof post.frontmatter.imageUrl === "string" && (
          <div className="relative h-[480px] w-3/4 mb-8">
            <img
              src={post.frontmatter.imageUrl}
              alt={post.frontmatter.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <div className="px-24">
        <h1 className="text-4xl font-bold mb-4 text-center">
          {post.frontmatter.title}
        </h1>
        <p className="text-center mb-8">
          Fecha: {new Date(post.frontmatter.date).toLocaleDateString()}{" "}
          {post.frontmatter.author && `| Por: ${post.frontmatter.author}`}
        </p>

        <div className="prose prose-lg max-w-none mb-8 dark:prose-invert">
          <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        </div>
        <div className="flex items-center gap-2 group justify-end">
          <Link
            to={"/blog"}
            className="inline-flex items-center gap-2 text-oscuro dark:text-mint dark:hover:text-dorado hover:underline font-medium mb-6"
          >
            Regresar
            <IoReturnUpBack className="w-6 h-6 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
