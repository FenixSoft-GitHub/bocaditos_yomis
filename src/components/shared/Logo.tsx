import { Link } from "react-router-dom";

interface Props {
  className?: string;
}

export const Logo = ({ className }: Props) => {
  return (
    <Link
      to="/"
      className="flex items-center transition-all duration-300 hover:scale-105 group"
      aria-label="Bocaditos Yomi's — Inicio"
    >
      <img
        src="/LogoBocaditosYomis.avif"
        alt="Logo Bocaditos Yomi's"
        width={72}
        height={72}
        className={`w-14 h-14 md:w-22 md:h-22 object-contain drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] ${className ?? ""}`}
      />
    </Link>
  );
};
