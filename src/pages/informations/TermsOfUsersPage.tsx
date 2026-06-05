import markdownContent from "@/constants/markdown/TermsOfUsers.md?raw";
import MarkdownPage from "@/components/shared/MarkdownPage";

const TermsOfUsers = () => (
  <MarkdownPage
    markdown={markdownContent}
    imageSrc="/img/blog/TermsOfUsers.avif"
    imageAlt="Términos de uso"
  />
);

export default TermsOfUsers;