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
    return <p>Error al cargar el contenido.</p>;
  }

  return (
    <div className="container mx-auto p-2 prose lg:prose-xl dark:prose-invert text-choco dark:text-cream">
      <div className="flex items-center gap-2 pt-24 w-full h-screen">
        <img
          className="rounded-xl w-full h-3/4 object-cover"
          src={imageSrc}
          alt={imageAlt}
        />
      </div>

      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>

      <div className="flex items-center gap-2 group justify-end">
        <BackButton />
      </div>
    </div>
  );
};

export default MarkdownPage;