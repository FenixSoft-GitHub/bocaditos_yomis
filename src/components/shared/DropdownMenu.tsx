import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, ExternalLink, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DropdownMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const DropdownMenu = ({ onEdit, onDelete }: DropdownMenuProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-lg text-choco/60 dark:text-cream/60 hover:text-choco dark:hover:text-cream hover:bg-cocoa/10 dark:hover:bg-cream/10 transition-colors"
        aria-label="Opciones"
      >
        <MoreHorizontal className="size-4" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-36 bg-fondo dark:bg-oscuro border border-cocoa/20 dark:border-cream/20 rounded-xl shadow-lg z-20 overflow-hidden"
          >
            <button
              onClick={() => {
                onEdit();
                setOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-choco dark:text-cream hover:bg-cocoa/10 dark:hover:bg-cream/10 transition-colors"
            >
              <ExternalLink className="size-3.5" /> Editar
            </button>
            <button
              onClick={() => {
                onDelete();
                setOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 className="size-3.5" /> Eliminar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
