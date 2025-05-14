import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun } from "lucide-react";

export const ToggleDarkMode = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="w-10 h-10 flex justify-center items-center rounded-md bg-transparent hover:bg-cream/20 transition-all duration-400 cursor-pointer">
      <button
        onClick={toggleTheme}
        className="p-2 rounded-md transition"
        aria-label="Cambiar tema"
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>
  );
};
