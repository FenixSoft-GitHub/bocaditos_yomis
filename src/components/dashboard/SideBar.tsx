import { NavLink } from "react-router-dom";
import { DashboardLinks } from "@/constants/DashboardLinks";
import { Logo } from "@/components/shared/Logo";
import { IoLogOutOutline } from "react-icons/io5";
import { signOut } from "@/actions";

export const SideBar = () => {
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="w-[120px] h-screen fixed bg-fondo-dark text-cream flex flex-col gap-4 items-center p-3 lg:w-[250px] border-r border-cream/30">
      <Logo />

      <nav className="w-full space-y-4 flex-1">
        {DashboardLinks.map((link) => (
          <NavLink
            key={link.id}
            to={link.href}
            className={({ isActive }) =>
              `flex items-center justify-center gap-4 pl-0 py-2 transition-all duration-300 rounded-md ${
                isActive
                  ? "text-cream bg-amber-600"
                  : "hover:text-cream hover:bg-amber-700/90 bg-cream/10 border border-cocoa/30 hover:border-transparent"
              } lg:pl-5 lg:justify-start`
            }
          >
            {link.icon}
            <p className="font-medium hidden lg:block">{link.title}</p>
          </NavLink>
        ))}
      </nav>

      <button
        className="bg-cream/10 border border-cocoa/30 hover:border-transparent hover:bg-red-500 w-full py-[10px] rounded-md flex items-center justify-center gap-2 font-semibold text-sm hover:underline transition-all duration-500"
        onClick={handleLogout}
      >
        <span className="hidden lg:block">Cerrar sesión</span>
        <IoLogOutOutline size={20} className="inline-block" />
      </button>
    </div>
  );
};
