// src/components/blog/RelatedPosts.tsx
import React from "react";
import { Link } from "react-router-dom";
import { BlogPost } from "@/interfaces";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface RelatedPostsProps {
  posts: BlogPost[];
}

export const RelatedPosts: React.FC<RelatedPostsProps> = ({ posts }) => {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-cocoa/10 dark:border-cream/10">
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-8 text-center sm:text-left">
        Te podría interesar también
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {posts.slice(0, 3).map((post) => {
          const date = post.published_at
            ? format(new Date(post.published_at), "dd MMM, yyyy", {
                locale: es,
              })
            : "";

          return (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group flex flex-col gap-3 p-3 rounded-2xl border border-transparent hover:border-cocoa/10 dark:hover:border-cream/10 hover:bg-cocoa/5 dark:hover:bg-cream/5 active:scale-[0.99] transition-all duration-200"
            >
              {/* Imagen miniatura */}
              {post.image_url && (
                <div className="w-full aspect-[16/10] rounded-xl overflow-hidden bg-cocoa/10 dark:bg-cream/5 border border-cocoa/5">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Info corta */}
              <div className="flex flex-col gap-1.5 flex-1 px-1">
                <span className="text-[11px] font-medium uppercase tracking-wider text-cocoa/60 dark:text-butter/60">
                  {date}
                </span>
                <h3 className="font-bold text-base leading-snug text-choco/90 dark:text-cream/95 group-hover:text-dorado dark:group-hover:text-butter transition-colors line-clamp-2">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-xs text-choco/60 dark:text-cream/60 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};