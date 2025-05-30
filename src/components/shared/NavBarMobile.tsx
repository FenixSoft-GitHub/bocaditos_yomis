import { IoMdClose } from "react-icons/io";
import { useGlobalStore } from "@/store/global.store";
import { Link, NavLink } from "react-router-dom";
import { NavbarLinks } from "@/constants/NavBarLinks";
import { Logo } from "./Logo";

export const NavbarMobile = () => {
  const setActiveNavMobile = useGlobalStore(
    (state) => state.setActiveNavMobile
  );

  return (
    <div className="bg-cream/80 backdrop-blur-md text-choco dark:text-cream dark:bg-fondo-dark/80 h-screen w-full shadow-lg animate-slide-in-left fixed z-50 flex justify-center py-24 px-6">
      <button
        className="absolute top-5 right-5 bg-amber-600 text-cream dark:bg-amber-500 dark:text-oscuro hover:bg-amber-700 dark:hover:bg-amber-600 rounded-full shadow-md transition-all duration-200"
        onClick={() => setActiveNavMobile(false)}
        aria-label="Cerrar menú"
      >
        <IoMdClose size={28} className="p-1" />
      </button>

      <div className="flex flex-col gap-12 items-center w-full max-w-xs">
        <Link
          to="/"
          onClick={() => setActiveNavMobile(false)}
          className="scale-[1.5] transition-transform duration-300"
        >
          <Logo />
        </Link>

        <nav className="flex flex-col w-full gap-4">
          {NavbarLinks.map((item) => (
            <NavLink
              key={item.id}
              to={item.href}
              onClick={() => setActiveNavMobile(false)}
              className={({ isActive }) =>
                `flex items-center justify-start gap-3 w-full px-4 py-3 rounded-lg font-medium tracking-wide transition-all duration-200
                ${
                  isActive
                    ? "bg-amber-100 text-choco dark:bg-cream/10"
                    : "hover:bg-amber-50 dark:hover:bg-white/10 text-choco/80 dark:text-cream/80"
                }`
              }
            >
              {item.icon}
              <span className="text-base">{item.title}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};