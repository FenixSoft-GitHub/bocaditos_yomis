import { Link } from "react-router-dom";

interface Props {
  className?: string;
};


export const Logo = ({ className }: Props) => {
  return (
    <Link
      to="/"
      className="flex gap-1 items-center transition-all duration-300 hover:scale-105 group"
    >
      <img
        src="/LogoBocaditosYomis.avif"
        alt="Logo Bocaditos Yomi's"
        className={`size-25 lg:size-38 object-contain drop-shadow-[0_2px_2px_rgba(0,0,0,1)] ${
          className ?? ""
        }`}
      />
    </Link>
  );
};
