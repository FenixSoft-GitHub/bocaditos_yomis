import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BackButton } from "./BackButton";

type MarkdownPageProps = {
  markdown: string;
  imageSrc: string;
  imageAlt: string;
};

const MarkdownPage = ({ markdown, imageSrc, imageAlt }: MarkdownPageProps) => {
  if (typeof markdown !== "string") {
    console.error("Error: No se pudo cargar el contenido Markdown.");
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-choco dark:text-cream">
        <p className="font-semibold text-lg">Error al cargar el contenido.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 text-choco dark:text-cream bg-fondo dark:bg-fondo-dark max-w-4xl">
      {/* Contenedor de Imagen de Cabecera Optimizado */}
      <div className="w-full my-8 rounded-2xl overflow-hidden shadow-md border border-cocoa/10 dark:border-cream/10">
        <img
          className="w-full h-48 sm:h-64 md:h-80 object-cover transform hover:scale-102 transition-transform duration-300"
          src={imageSrc}
          alt={imageAlt}
        />
      </div>

      {/* Contenedor del Markdown Limpio y Legible */}
      <div
        className="prose prose-choco dark:prose-invert prose-headings:font-bold prose-p:leading-relaxed max-w-none mb-10
        prose-img:rounded-xl prose-a:text-dorado dark:prose-a:text-butter hover:prose-a:underline"
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      </div>

      {/* Botón de regreso */}
      <div className="flex items-center justify-end py-6 border-t border-cocoa/10 dark:border-cream/10">
        <BackButton />
      </div>
    </div>
  );
};

export default MarkdownPage;

// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { BackButton } from "./BackButton";

// type MarkdownPageProps = {
//   markdown: string;
//   imageSrc: string;
//   imageAlt: string;
// };

// const MarkdownPage = ({ markdown, imageSrc, imageAlt }: MarkdownPageProps) => {
//   if (typeof markdown !== "string") {
//     console.error("Error: No se pudo cargar el contenido Markdown.");
//     return <p>Error al cargar el contenido.</p>;
//   }

//   return (
//     <div className="container mx-auto p-2 prose lg:prose-2xl dark:prose-invert text-choco dark:text-cream bg-fondo dark:bg-fondo-dark">
//       <div className="flex items-center gap-2 pt-4 w-full h-screen">
//         <img
//           className="rounded-xl w-full h-3/4 object-cover"
//           src={imageSrc}
//           alt={imageAlt}
//         />
//       </div>

//       <div className="prose prose-lg max-w-none mb-8 dark:prose-invert">
//         <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
//       </div>

//       <div className="flex items-center gap-2 group justify-end py-10">
//         <BackButton />
//       </div>
//     </div>
//   );
// };

// export default MarkdownPage;
