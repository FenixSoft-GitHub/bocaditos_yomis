type TagType = "nuevo" | "agotado" | "descuento" | string;

interface Props {
  contentTag: TagType;
}

const getTagColor = (content: TagType) => {
  const lowerContent = content.toLowerCase();
  if (lowerContent === "nuevo")
    return "bg-cyan-300 text-black outline-cyan-300";
  if (lowerContent === "agotado")
    return "bg-red-500/70 text-white outline-red-500/70";
  if (
    lowerContent === "descuento" ||
    lowerContent.includes("off") ||
    lowerContent.includes("%")
  )
    return "bg-amber-600 text-white outline-amber-600";

    return "bg-gray-500 text-white outline-gray-500";
};

const Tag = ({ contentTag }: Props) => {
  return (
    <div
      className={`w-fit rounded-full shadow-lg outline-1 outline-offset-1 ${getTagColor(
        contentTag
      )}`}
    >
      <p className="uppercase text-xs font-semibold px-3.5 py-1.5">{contentTag}</p>
    </div>
  );
};

export default Tag;
