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

// import { useState } from "react";
// import { ChevronDown } from "lucide-react";
// import { AnimatePresence, motion } from "framer-motion";
// import { faqs } from "@/constants/faqsData";

// export const FAQSection = () => {
//   const [openIndex, setOpenIndex] = useState<number | null>(null);

//   const toggleFAQ = (index: number) => {
//     setOpenIndex(prev => (prev === index ? null : index));
//   };

//   return (
//     <section className="max-w-3xl mx-auto px-4 py-10 text-choco dark:text-cream">
//       <h2 className="text-3xl font-bold text-center mb-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]">
//         Preguntas Frecuentes
//       </h2>
//       <div className="space-y-4 text-sm">
//         {faqs.map((item, index) => {
//           const isOpen = openIndex === index;
//           return (
//             <div
//               key={index}
//               className="bg-cream dark:bg-oscuro border border-cocoa/50 dark:border-cream/20 rounded-2xl shadow-sm transition-all"
//             >
//               <button
//                 onClick={() => toggleFAQ(index)}
//                 className="w-full flex items-center justify-between p-4 text-left font-medium text-choco dark:bg-fondo-dark dark:text-cream hover:bg-butter dark:hover:bg-cream/10 focus:outline-none focus:ring-2 focus:ring-cocoa/80 rounded-2xl transition"
//                 aria-expanded={isOpen}
//                 aria-controls={`faq-${index}`}
//               >
//                 {item.question}
//                 <ChevronDown
//                   className={`w-5 h-5 transform transition-transform duration-300 ${
//                     isOpen ? "rotate-180" : ""
//                   }`}
//                 />
//               </button>

//               <AnimatePresence initial={false}>
//                 {isOpen && (
//                   <motion.div
//                     id={`faq-${index}`}
//                     initial={{ height: 0, opacity: 0 }}
//                     animate={{ height: "auto", opacity: 1 }}
//                     exit={{ height: 0, opacity: 0 }}
//                     transition={{ duration: 0.3 }}
//                     className="overflow-hidden px-4 pb-4 text-choco dark:text-cream"
//                   >
//                     <p className="pt-2">{item.answer}</p>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           );
//         })}
//       </div>
//     </section>
//   );
// };
