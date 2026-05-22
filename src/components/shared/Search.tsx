// src/components/ui/Search.tsx

import { useRef } from "react";
import {
  Search as SearchIcon,
  RotateCcw,
  X,
  Loader2,
  Clock,
  Tag,
  ShoppingBag,
  BookOpen,
  Trash2,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useGlobalStore } from "@/store/global.store";
import { useSearch } from "@/hooks/search/useSearch";
import { formatPrice } from "@/helpers";
import {
  getDiscountedPrice,
  getDiscountPercentage,
  isDiscountActive,
} from "@/lib/discount";

// ── Highlight: resalta el término buscado en el texto ─────────────────────

const Highlight = ({ text, term }: { text: string; term: string }) => {
  if (!term.trim()) return <>{text}</>;

  const regex = new RegExp(
    `(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi",
  );
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-dorado/30 text-choco dark:text-cream rounded px-0.5 not-italic"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
};

// ── Componente principal ───────────────────────────────────────────────────

export const Search = () => {
  const navigate = useNavigate();
  const closeSheet = useGlobalStore((state) => state.closeSheet);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    inputValue,
    debouncedTerm,
    setInputValue,
    results,
    isLoading,
    hasResults,
    totalCount,
    history,
    selectFromHistory,
    removeFromHistory,
    clearHistory,
    reset,
  } = useSearch();

  const isTyping = inputValue.trim().length >= 2;
  const showHistory = !isTyping && history.length > 0;
  const showEmpty = isTyping && !isLoading && !hasResults && debouncedTerm;

  const handleClose = () => {
    reset();
    closeSheet();
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleClose();
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full bg-fondo dark:bg-fondo-dark text-choco dark:text-cream">
      {/* ── HEADER / Input ─────────────────────────────────────────────── */}
      <div className="py-4 px-4 flex gap-3 items-center border-b border-cocoa/20 dark:border-cream/10 shrink-0">
        <div className="flex gap-3 items-center flex-1 bg-cocoa/10 dark:bg-cream/10 rounded-full px-4 py-2.5">
          <SearchIcon className="size-4 text-choco/50 dark:text-cream/50 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar productos, categorías, artículos..."
            autoFocus
            autoComplete="off"
            className="outline-none w-full text-sm bg-transparent placeholder:text-choco/40 dark:placeholder:text-cream/40"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.span
                key="spinner"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Loader2 className="size-4 text-choco/40 dark:text-cream/40 animate-spin shrink-0" />
              </motion.span>
            ) : inputValue ? (
              <motion.button
                key="clear"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => {
                  setInputValue("");
                  inputRef.current?.focus();
                }}
                className="shrink-0 text-choco/40 dark:text-cream/40 hover:text-choco dark:hover:text-cream transition-colors"
                aria-label="Limpiar búsqueda"
              >
                <RotateCcw className="size-4" />
              </motion.button>
            ) : null}
          </AnimatePresence>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleClose}
          className="p-1.5 rounded-full bg-choco/10 dark:bg-cream/10 hover:bg-choco/20 dark:hover:bg-cream/20 transition-colors shrink-0 cursor-pointer"
          aria-label="Cerrar búsqueda"
        >
          <X className="size-4" />
        </motion.button>
      </div>

      {/* ── BODY / Resultados ──────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto pb-24">
        <AnimatePresence mode="wait">
          {/* Estado inicial — historial o sugerencias */}
          {!isTyping && (
            <motion.div
              key="initial"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="p-4 space-y-6"
            >
              {/* Historial de búsquedas recientes */}
              {showHistory && (
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-choco/40 dark:text-cream/40">
                      Búsquedas recientes
                    </span>
                    <button
                      onClick={clearHistory}
                      className="text-xs text-choco/40 dark:text-cream/40 hover:text-choco dark:hover:text-cream transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="size-3" />
                      Limpiar
                    </button>
                  </div>
                  <ul className="space-y-1">
                    {history.map((term) => (
                      <li key={term} className="flex items-center gap-2 group">
                        <button
                          onClick={() => selectFromHistory(term)}
                          className="flex items-center gap-2.5 flex-1 py-2 px-3 rounded-xl hover:bg-cocoa/10 dark:hover:bg-cream/10 transition-colors text-left"
                        >
                          <Clock className="size-3.5 text-choco/30 dark:text-cream/30 shrink-0" />
                          <span className="text-sm">{term}</span>
                        </button>
                        <button
                          onClick={() => removeFromHistory(term)}
                          className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-choco/30 hover:text-choco dark:text-cream/30 dark:hover:text-cream"
                          aria-label={`Eliminar "${term}" del historial`}
                        >
                          <X className="size-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Sugerencia inicial cuando no hay historial */}
              {!showHistory && (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-choco/30 dark:text-cream/30">
                  <TrendingUp className="size-10" />
                  <p className="text-sm text-center">
                    Busca productos, categorías o artículos del blog
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Sin resultados */}
          {showEmpty && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 gap-4 px-4"
            >
              <img
                src="/img/misc/Search2.webp"
                alt="Sin resultados"
                className="w-1/2 rounded-lg opacity-80"
              />
              <div className="text-center">
                <p className="text-sm text-choco/60 dark:text-cream/60">
                  No encontramos resultados para
                </p>
                <p className="text-sm font-semibold mt-0.5">
                  "{debouncedTerm}"
                </p>
              </div>
            </motion.div>
          )}

          {/* Resultados agrupados */}
          {isTyping && hasResults && !isLoading && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="p-4 space-y-6"
            >
              {/* Contador total */}
              <p className="text-xs text-choco/40 dark:text-cream/40">
                {totalCount} resultado{totalCount !== 1 ? "s" : ""} para{" "}
                <strong className="text-choco/60 dark:text-cream/60">
                  "{debouncedTerm}"
                </strong>
              </p>

              {/* ── PRODUCTOS ──────────────────────────────────────── */}
              {results.products.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <ShoppingBag className="size-3.5 text-choco/40 dark:text-cream/40" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-choco/40 dark:text-cream/40">
                      Productos
                    </span>
                    <span className="text-xs bg-cocoa/10 dark:bg-cream/10 px-1.5 py-0.5 rounded-full">
                      {results.products.length}
                    </span>
                  </div>

                  <ul className="space-y-1">
                    {results.products.map((product) => {
                      const activeDiscount =
                        product.discount && isDiscountActive(product.discount)
                          ? product.discount
                          : null;
                      const discountedPrice = activeDiscount
                        ? getDiscountedPrice(product.price, activeDiscount)
                        : product.price;
                      const discountPct = activeDiscount
                        ? getDiscountPercentage(product.price, activeDiscount)
                        : null;

                      return (
                        <li key={product.id}>
                          <button
                            onClick={() =>
                              handleNavigate(`/products/${product.slug}`)
                            }
                            className="flex items-center gap-3 w-full text-left p-2.5 rounded-xl hover:bg-cocoa/10 dark:hover:bg-cream/10 transition-colors group"
                          >
                            <img
                              src={product.image_url[0]}
                              alt={product.name}
                              className="size-12 object-cover rounded-lg flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold line-clamp-1 group-hover:text-cocoa transition-colors">
                                <Highlight
                                  text={product.name}
                                  term={debouncedTerm}
                                />
                              </p>
                              {product.description && (
                                <p className="text-xs text-choco/50 dark:text-cream/50 truncate mt-0.5">
                                  <Highlight
                                    text={product.description}
                                    term={debouncedTerm}
                                  />
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-1">
                                {activeDiscount ? (
                                  <>
                                    <span className="text-xs line-through text-choco/40 dark:text-cream/40">
                                      {formatPrice(product.price)}
                                    </span>
                                    <span className="text-sm font-bold text-dorado">
                                      {formatPrice(discountedPrice)}
                                    </span>
                                    <span className="text-[10px] bg-dorado/20 text-choco dark:text-dorado font-semibold px-1.5 py-0.5 rounded-full">
                                      -{discountPct}%
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-sm font-semibold">
                                    {formatPrice(product.price)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <ChevronRight className="size-4 text-choco/20 dark:text-cream/20 shrink-0 group-hover:text-cocoa transition-colors" />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}

              {/* ── CATEGORÍAS ─────────────────────────────────────── */}
              {results.categories.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="size-3.5 text-choco/40 dark:text-cream/40" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-choco/40 dark:text-cream/40">
                      Categorías
                    </span>
                    <span className="text-xs bg-cocoa/10 dark:bg-cream/10 px-1.5 py-0.5 rounded-full">
                      {results.categories.length}
                    </span>
                  </div>

                  <ul className="space-y-1">
                    {results.categories.map((cat) => (
                      <li key={cat.id}>
                        <button
                          onClick={() =>
                            handleNavigate(
                              `/products?category=${encodeURIComponent(cat.name)}`,
                            )
                          }
                          className="flex items-center gap-3 w-full text-left p-2.5 rounded-xl hover:bg-cocoa/10 dark:hover:bg-cream/10 transition-colors group"
                        >
                          <div className="size-10 flex items-center justify-center bg-cocoa/10 dark:bg-cream/10 rounded-lg flex-shrink-0">
                            <Tag className="size-4 text-choco/40 dark:text-cream/40" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold group-hover:text-cocoa transition-colors">
                              <Highlight text={cat.name} term={debouncedTerm} />
                            </p>
                            {cat.description && (
                              <p className="text-xs text-choco/50 dark:text-cream/50 truncate">
                                {cat.description}
                              </p>
                            )}
                          </div>
                          <ChevronRight className="size-4 text-choco/20 dark:text-cream/20 shrink-0 group-hover:text-cocoa transition-colors" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* ── BLOG POSTS ─────────────────────────────────────── */}
              {results.posts.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="size-3.5 text-choco/40 dark:text-cream/40" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-choco/40 dark:text-cream/40">
                      Blog
                    </span>
                    <span className="text-xs bg-cocoa/10 dark:bg-cream/10 px-1.5 py-0.5 rounded-full">
                      {results.posts.length}
                    </span>
                  </div>

                  <ul className="space-y-1">
                    {results.posts.map((post) => (
                      <li key={post.id}>
                        <button
                          onClick={() => handleNavigate(`/blog/${post.slug}`)}
                          className="flex items-center gap-3 w-full text-left p-2.5 rounded-xl hover:bg-cocoa/10 dark:hover:bg-cream/10 transition-colors group"
                        >
                          {post.image_url ? (
                            <img
                              src={post.image_url}
                              alt={post.title}
                              className="size-12 object-cover rounded-lg flex-shrink-0"
                            />
                          ) : (
                            <div className="size-12 flex items-center justify-center bg-cocoa/10 dark:bg-cream/10 rounded-lg flex-shrink-0">
                              <BookOpen className="size-5 text-choco/30 dark:text-cream/30" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold line-clamp-1 group-hover:text-cocoa transition-colors">
                              <Highlight
                                text={post.title}
                                term={debouncedTerm}
                              />
                            </p>
                            {post.excerpt && (
                              <p className="text-xs text-choco/50 dark:text-cream/50 line-clamp-1 mt-0.5">
                                {post.excerpt}
                              </p>
                            )}
                          </div>
                          <ChevronRight className="size-4 text-choco/20 dark:text-cream/20 shrink-0 group-hover:text-cocoa transition-colors" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};