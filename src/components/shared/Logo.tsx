import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link
      to="/"
      className="flex gap-1 items-center transition-all duration-300 hover:scale-105 group"
    >
      <img
        src="/LogoBocaditosYomis.avif"
        alt="Logo Bocaditos Yomi's"
        className="size-25 lg:size-38 object-contain drop-shadow-[0_2px_2px_rgba(0,0,0,1)]"
      />
      {/* <div className="hidden lg:block text-2xl tracking-widest text-dorado font-semibold font-body4 drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
        <p className="">Bocaditos</p>
        <p className="text-4xl">Yomi's</p>
      </div> */}
    </Link>
  );
};
