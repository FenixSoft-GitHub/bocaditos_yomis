import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalStore } from "@/store/global.store";
import { Cart } from "@/components/shared/Cart";
import { Search } from "@/components/shared/Search";

export const Sheet = () => {
  const sheetContent = useGlobalStore((state) => state.sheetContent);
  const closeSheet = useGlobalStore((state) => state.closeSheet);
  const sheetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        sheetRef.current &&
        !sheetRef.current.contains(event.target as Node)
      ) {
        closeSheet();
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSheet();
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [closeSheet]);

  const renderContent = () => {
    switch (sheetContent) {
      case "cart":
        return <Cart />;
      case "search":
        return <Search />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 bg-oscuro/70 z-50 flex justify-end backdrop-blur-sm"
      >
        <motion.div
          key="panel"
          ref={sheetRef}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          className="bg-cream dark:bg-fondo-dark text-choco dark:text-cream h-screen w-full max-w-[420px] shadow-2xl overflow-hidden"
        >
          {renderContent()}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
