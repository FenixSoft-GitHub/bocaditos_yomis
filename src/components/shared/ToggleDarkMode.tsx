import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun } from "lucide-react";

export const ToggleDarkMode = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-cream/10 transition-colors duration-200"
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={isDark ? "Modo claro" : "Modo oscuro"}
    >
      {isDark ? (
        <Sun className="size-5 text-cream" />
      ) : (
        <Moon className="size-5 text-cream" />
      )}
    </button>
  );
};
