import { useState } from "react";
import { HiOutlineChevronDown } from "react-icons/hi2";
import { AnimatePresence, motion } from "framer-motion";
import { faqs } from "@/constants/faqsData";

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-10 text-choco dark:text-cream">
      <h2 className="text-3xl font-bold text-center mb-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]">
        Preguntas Frecuentes
      </h2>
      <div className="space-y-4">
        {faqs.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="bg-cream dark:bg-oscuro border border-cocoa/50 dark:border-cream/20 rounded-2xl shadow-sm transition-all"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-4 text-left font-medium text-choco dark:bg-fondo-dark dark:text-cream hover:bg-butter dark:hover:bg-cream/10 focus:outline-none focus:ring-2 focus:ring-cocoa/80 rounded-2xl transition"
                aria-expanded={isOpen}
                aria-controls={`faq-${index}`}
              >
                {item.question}
                <HiOutlineChevronDown
                  className={`w-5 h-5 transform transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden px-4 pb-4 text-choco dark:text-cream"
                  >
                    <p className="pt-2">{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};