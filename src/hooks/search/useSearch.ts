// src/hooks/useSearch.ts

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchAll } from "@/actions/product";
import { SearchResults } from "@/interfaces/product.interface";

const HISTORY_KEY = "yomis_search_history";
const MAX_HISTORY = 5;
const DEBOUNCE_MS = 300;
const MIN_CHARS = 2;

// ── Historial de búsquedas recientes (localStorage) ───────────────────────

export const getSearchHistory = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
  } catch {
    return [];
  }
};

const addToHistory = (term: string) => {
  const trimmed = term.trim();
  if (!trimmed || trimmed.length < MIN_CHARS) return;

  const history = getSearchHistory().filter(
    (h) => h.toLowerCase() !== trimmed.toLowerCase(),
  );

  const updated = [trimmed, ...history].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
};

export const removeFromHistory = (term: string) => {
  const updated = getSearchHistory().filter((h) => h !== term);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
};

export const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
};

// ── Hook principal ─────────────────────────────────────────────────────────

interface UseSearchReturn {
  // Estado
  inputValue: string;
  debouncedTerm: string;
  setInputValue: (value: string) => void;

  // Resultados
  results: SearchResults;
  isLoading: boolean;
  isError: boolean;
  hasResults: boolean;
  totalCount: number;

  // Historial
  history: string[];
  selectFromHistory: (term: string) => void;
  removeFromHistory: (term: string) => void;
  clearHistory: () => void;

  // Helpers
  reset: () => void;
}

export const useSearch = (): UseSearchReturn => {
  const [inputValue, setInputValue] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [history, setHistory] = useState<string[]>(getSearchHistory);

  // Debounce: actualiza el término de búsqueda real tras 300ms
  useEffect(() => {
    if (inputValue.trim().length < MIN_CHARS) {
      setDebouncedTerm("");
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedTerm(inputValue.trim());
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [inputValue]);

  // Guardar en historial cuando hay una búsqueda completada
  useEffect(() => {
    if (debouncedTerm.length >= MIN_CHARS) {
      addToHistory(debouncedTerm);
      setHistory(getSearchHistory());
    }
  }, [debouncedTerm]);

  // TanStack Query — solo dispara cuando hay término válido
  const {
    data,
    isFetching: isLoading,
    isError,
  } = useQuery<SearchResults>({
    queryKey: ["search", debouncedTerm],
    queryFn: () => searchAll(debouncedTerm),
    enabled: debouncedTerm.length >= MIN_CHARS,
    staleTime: 1000 * 30, // 30s — resultados frescos sin re-fetch
    gcTime: 1000 * 60 * 5, // 5min — cache en memoria
    placeholderData: (prev) => prev, // mantiene resultados anteriores mientras carga
  });

  const results: SearchResults = data ?? {
    products: [],
    categories: [],
    posts: [],
  };

  const totalCount =
    results.products.length + results.categories.length + results.posts.length;

  const hasResults = totalCount > 0;

  const reset = () => {
    setInputValue("");
    setDebouncedTerm("");
  };

  const selectFromHistory = (term: string) => {
    setInputValue(term);
    setDebouncedTerm(term);
  };

  const handleRemoveFromHistory = (term: string) => {
    removeFromHistory(term);
    setHistory(getSearchHistory());
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  return {
    inputValue,
    debouncedTerm,
    setInputValue,
    results,
    isLoading,
    isError,
    hasResults,
    totalCount,
    history,
    selectFromHistory,
    removeFromHistory: handleRemoveFromHistory,
    clearHistory: handleClearHistory,
    reset,
  };
};
