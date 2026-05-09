type TagType = "nuevo" | "agotado" | "descuento" | string;

interface Props {
  contentTag: TagType;
}

const getTagStyle = (content: TagType): string => {
  const lower = content.toLowerCase();
  if (lower === "nuevo") return "bg-cyan-400/90 text-black";
  if (lower === "agotado") return "bg-red-500/80 text-cream";
  if (lower === "descuento" || lower.includes("off") || lower.includes("%"))
    return "bg-dorado text-oscuro";
  return "bg-cocoa/80 text-cream";
};

const Tag = ({ contentTag }: Props) => (
  <span
    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide shadow-sm ${getTagStyle(contentTag)}`}
  >
    {contentTag}
  </span>
);

export default Tag;
