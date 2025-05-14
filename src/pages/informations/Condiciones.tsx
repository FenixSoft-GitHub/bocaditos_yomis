import markdownContent from "@/constants/Condiciones.md?raw";
import MarkdownPage from "@/components/shared/MarkdownPage";

const Condiciones = () => (
  <MarkdownPage
    markdown={markdownContent}
    imageSrc="/img/blog/Conditions.avif"
    imageAlt="Condiciones del servicio"
  />
);

export default Condiciones;