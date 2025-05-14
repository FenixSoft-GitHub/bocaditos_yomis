import { useState, useMemo, useEffect } from "react";
import { blogPosts, availableTags } from "@/utils/getPosts";
import BlogPostCard from "@/components/blog/BlogPostCard";
import { SelectFilter } from "@/components/shared/SelectFilter";

const BlogListPage = () => {
  const [selectedTag, setSelectedTag] = useState<string | null>("Todas");

  const handleTagChange = (value: string | null) => {
    setSelectedTag(value === "Todas" ? null : value);
  };

  const handleResetTag = () => {
    setSelectedTag(null);
  };

  const filteredPosts = useMemo(() => {
    if (!selectedTag) return blogPosts;
    return blogPosts.filter((post) =>
      post.frontmatter.tags?.map((t) => t.toLowerCase()).includes(selectedTag.toLowerCase())
    );
  }, [selectedTag]);

  useEffect(() => {
    // Reiniciar el filtro si por alguna razón quedó un valor que no filtra nada
    if (
      selectedTag &&
      !availableTags.some(
        (tag) => tag.toLowerCase() === selectedTag.toLowerCase()
      )
    ) {
      setSelectedTag(null); // restablece al estado original
    }
  }, []);
  
  return (
    <div className="w-full h-full">
      {/* Hero Section */}
      <div className="relative w-full h-screen flex justify-end items-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat h-full bg-[url('/img/blog/blog.avif')] dark:mask-image-[linear-gradient(to_bottom,_black_80%,_transparent)] light:mask-image-[linear-gradient(to_bottom,_white_80%,_transparent)]"
          style={{
            maskImage: "linear-gradient(to bottom, black 80%, transparent)",
          }}
        />
        <div className="absolute inset-0 bg-black opacity-20" />

        <div className="relative max-w-[800px] flex flex-col text-end px-4 lg:px-12 gap-3.5 text-cream">
          <h2 className="text-4xl font-bold mb-3 drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">
            Bienvenido a nuestro Blog de Repostería, Pastelería y Panadería
          </h2>

          <div className="text-balance text-end text-sm tracking-wide md:text-xl ">
            <p>
              En este espacio encontrarás inspiración, secretos de cocina,
              recetas irresistibles y tips profesionales para que lleves tu
              pasión por lo dulce al siguiente nivel.
            </p>
            <p>
              Compartimos contigo nuestro amor por los sabores auténticos, las
              texturas perfectas y la creatividad en cada detalle.
            </p>
            <p>
              Ya seas un aficionado que da sus primeros pasos o un experto en
              busca de nuevas ideas, aquí descubrirás todo lo que necesitas para
              crear momentos inolvidables.
            </p>
            <p>
              ¡Prepárate para endulzar tu vida con{" "}
              <strong>Bocaditos Yomi's</strong>!
            </p>
          </div>
        </div>
      </div>

      <section className="max-w-[1400px] w-full mx-auto gap-4 lg:gap-10 text-pretty p-6 text-left sm:px-20 flex flex-col items-center justify-between md:px-12 lg:py-6">
        <div className="flex w-full items-center justify-between mb-2 flex-col md:flex-row gap-4 text-choco dark:text-cream">
          <h1 className="text-2xl md:text-4xl font-bold text-center">
            Blog de la Pastelería
          </h1>

          {/* Controles de filtro */}
          <SelectFilter
            label="Filtrar por etiqueta:"
            options={[...availableTags]}
            selectedValue={selectedTag || ""}
            onChange={handleTagChange}
            onReset={handleResetTag}
            placeholder="Todas las etiquetas"
          />

        </div>
      </section>

      {/* Mapeamos sobre los posts FILTRADOS */}
      <div className="w-full max-w-[1400px] grid lg:grid-cols-10 auto-rows-[32rem] gap-7 mx-auto md:p-12 my-1">
        {filteredPosts.map((post) => (
          <BlogPostCard
            key={post.slug}
            post={{
              title: post.frontmatter.title,
              date: post.frontmatter.date,
              author: post.frontmatter.author || "Autor desconocido",
              slug: post.frontmatter.slug,
              tags: post.frontmatter.tags,
              excerpt: post.frontmatter.excerpt,
              imageUrl: post.frontmatter.imageUrl as string | undefined,
              classCol: post.frontmatter.classCol as string,
              classMax: post.frontmatter.classMax as string,
            }}
          />
        ))}
      </div>

      {/* Mensaje si no hay posts (filtrados o en total) */}
      {filteredPosts.length === 0 && blogPosts.length > 0 && (
        <p className="text-center text-gray-500 mt-8">
          No se encontraron artículos con la etiqueta seleccionada.
        </p>
      )}
      {blogPosts.length === 0 && ( // Este es el caso si no hay posts en total
        <p className="text-center text-gray-500 mt-8">
          No hay artículos en el blog aún.
        </p>
      )}
    </div>
  );
};

export default BlogListPage;