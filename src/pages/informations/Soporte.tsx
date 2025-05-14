import markdownContent from "@/constants/Soporte.md?raw";
import MarkdownPage from "@/components/shared/MarkdownPage";

const Soporte = () => (
  <MarkdownPage
    markdown={markdownContent}
    imageSrc="/img/blog/Soporte.avif"
    imageAlt="Imagen de Soporte Técnico"
  />
);

export default Soporte;