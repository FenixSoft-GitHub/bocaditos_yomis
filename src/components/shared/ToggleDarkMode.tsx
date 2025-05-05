import { useEffect, useState } from "react";
import { Expand } from "@theme-toggles/react";

export const ToggleDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button className="w-10 h-10 flex justify-center items-center rounded-md bg-transparent hover:bg-cream/20 transition-all duration-400 cursor-pointer">
      <Expand
        duration={450}
        toggled={isDark}
        toggle={setIsDark}
        aria-label="Cambiar tema"
        title="Alternar tema"
        placeholder=""
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
        className="text-xl"
      />
    </button>
  );
};
