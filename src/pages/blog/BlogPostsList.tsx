import React, { useState, useMemo } from "react";
// import { Link } from "react-router-dom";
import { blogPosts, availableTags } from "@/utils/getPosts";
import BlogPostCard from "@/components/blog/BlogPostCard";

const BlogListPage = () => {
  const [selectedTag, setSelectedTag] = useState<string>("all");

  const handleTagChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTag(event.target.value);
  };

  // Usamos useMemo para filtrar los posts solo cuando selectedTag o blogPosts cambian
  const filteredPosts = useMemo(() => {
    if (selectedTag === "all") {
      return blogPosts; // Si es 'all', retornamos todos los posts
    } else {
      // Filtramos los posts que tienen la etiqueta seleccionada
      return blogPosts.filter((post) =>
        post.frontmatter.tags
          ?.map((tag) => tag.toLowerCase())
          .includes(selectedTag.toLowerCase())
      );
    }
  }, [selectedTag]); // Dependencias: recalcular cuando cambia la etiqueta o la lista de posts

  return (
    <div className="w-full h-full">
      {/* Hero Section */}
      <div className="relative w-full h-screen flex justify-end items-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat h-full bg-[url('/img/blog/blog.avif')]"
          style={{ maskImage: "linear-gradient(black 50%, transparent)" }}
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

      <section className="max-w-[1400px] w-full mx-auto gap-4 lg:gap-10 text-pretty p-6 text-left text-xl sm:px-20 flex flex-col items-center justify-between md:px-12 lg:py-6">
        <div className="flex w-full items-center justify-between mb-2 flex-col md:flex-row gap-4 text-choco dark:text-cream">
          <h1 className="text-2xl md:text-4xl font-bold text-center">
            Blog de la Pastelería
          </h1>

          {/* Controles de filtro */}
          <div className="flex justify-center md:justify-end">
            <label
              htmlFor="tag-filter"
              className="block text-choco dark:text-cream text-sm md:text-base mr-2 self-center"
            >
              Filtrar por etiqueta:
            </label>
            <div className="relative">
              <select
                id="tag-filter"
                value={selectedTag}
                onChange={handleTagChange}
                className="block text-sm w-full bg-cream border border-gray-300 text-oscuro py-2 px-4 rounded leading-tight focus:outline-none focus:border-oscuro"
              >
                <option value="all">Todas las etiquetas</option>
                {/* Mapeamos sobre las etiquetas disponibles para crear las opciones */}
                {availableTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}{" "}
                    {/* Capitalizar la primera letra para mostrar */}
                  </option>
                ))}
              </select>
              {/* Icono de flecha para el select (opcional, ayuda en algunos dise\u00F1os) */}
              {/* <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l-.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Mapeamos sobre los posts FILTRADOS */}
      {/* <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"> */}
      <div className="w-full max-w-[1400px] grid lg:grid-cols-10 auto-rows-[32rem] gap-7 mx-auto md:p-12 my-1">
        {filteredPosts.map((post) => (
          //   <div
          //     key={post.slug}
          //     className="bg-white rounded-lg shadow-md overflow-hidden"
          //   >
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
          //   </div>
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

// // src/pages/BlogListPage.tsx
// import React, { useMemo, useState } from "react";
// import { Link } from "react-router-dom";
// import { blogPosts, availableTags } from "@/utils/getPosts"; // Importamos los posts procesados

// const BlogListPage: React.FC = () => {
//   // Estado para la etiqueta seleccionada. Inicialmente 'all' para mostrar todos.
//   const [selectedTag, setSelectedTag] = useState<string>("all"); // Funci\u00F3n para manejar el cambio en el select

//   const handleTagChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedTag(event.target.value);
//   }; // Usamos useMemo para filtrar los posts solo cuando selectedTag o blogPosts cambian

//   const filteredPosts = useMemo(() => {
//     if (selectedTag === "all") {
//       return blogPosts; // Si es 'all', retornamos todos los posts
//     } else {
//       // Filtramos los posts que tienen la etiqueta seleccionada (insensible a may\u00FAs\u00ACculas/min\u00FAs\u00ACculas)
//       return blogPosts.filter((post) =>
//         post.frontmatter.tags
//           ?.map((tag) => tag.toLowerCase())
//           .includes(selectedTag.toLowerCase())
//       );
//     }
//   }, [selectedTag, blogPosts]); // Dependencias: recalcular cuando cambia la etiqueta o la lista de posts

//   return (
//     <div className="container mx-auto  px-4 py-8">
//       <h1 className="text-4xl font-bold pt-24 mb-8 text-center">
//         Blog de la Pastelería
//       </h1>

//       <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
//         {blogPosts.map((post) => (
//           <div
//             key={post.slug}
//             className="bg-white rounded-lg shadow-md overflow-hidden"
//           >
//             <div className="p-6">
//               <h2 className="text-2xl font-semibold mb-2">
//                 <Link to={`/blog/${post.slug}`} className="hover:text-blue-600">
//                   {post.frontmatter.title}
//                 </Link>
//               </h2>
//               <p className="text-gray-600 text-sm mb-4">
//                 Fecha: {new Date(post.frontmatter.date).toLocaleDateString()}
//               </p>
//               {post.frontmatter.excerpt && (
//                 <p className="text-gray-700 mb-4">{post.frontmatter.excerpt}</p>
//               )}
//               <Link
//                 to={`/blog/${post.slug}`}
//                 className="text-blue-600 hover:underline"
//               >
//                 Leer más
//               </Link>
//             </div>
//           </div>
//         ))}
//       </div>

//       {blogPosts.length === 0 && (
//         <p className="text-center text-gray-500">
//           No hay artículos en el blog aún.
//         </p>
//       )}
//     </div>
//   );
// };

// export default BlogListPage;
