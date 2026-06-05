import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { faqs } from "@/constants/faqsData";

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-cocoa mb-1">
          FAQ
        </p>
        <h3 className="text-xl font-bold text-choco dark:text-cream">
          Preguntas Frecuentes
        </h3>
        <p className="text-sm text-choco/60 dark:text-cream/60 mt-1">
          Respuestas a las dudas más comunes de nuestros clientes.
        </p>
      </div>

      <div className="flex flex-col gap-2.5 mt-2">
        {faqs.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? "border-choco/30 dark:border-cream/30 bg-cocoa/5 dark:bg-cream/5"
                  : "border-cocoa/10 dark:border-cream/10 bg-cream dark:bg-oscuro hover:border-cocoa/20 dark:hover:border-cream/20"
              }`}
            >
              <button
                onClick={() =>
                  setOpenIndex((prev) => (prev === index ? null : index))
                }
                className="w-full flex items-center justify-between px-4 py-3.5 text-left text-sm font-semibold text-choco dark:text-cream focus:outline-none"
                aria-expanded={isOpen}
                aria-controls={`faq-${index}`}
              >
                <span className="pr-4">{item.question}</span>
                <ChevronDown
                  className={`size-4 shrink-0 transition-transform duration-300 text-choco/50 dark:text-cream/50 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-4 text-sm text-choco/70 dark:text-cream/70 leading-relaxed border-t border-cocoa/10 dark:border-cream/10 pt-3 mt-0">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};