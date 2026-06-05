// src/hooks/useSearch.ts
import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { searchAll } from "@/actions/product";
import { SearchResults } from "@/interfaces/product.interface";
import { supabase } from "@/supabase/client";
import { useUser } from "@/hooks";

const HISTORY_KEY = "yomis_search_history";
const MAX_HISTORY = 5;
const DEBOUNCE_MS = 300;
const MIN_CHARS = 2;

// ── Historial local ────────────────────────────────────────────────────────

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
  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify([trimmed, ...history].slice(0, MAX_HISTORY)),
  );
};

export const removeFromHistory = (term: string) => {
  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(getSearchHistory().filter((h) => h !== term)),
  );
};

export const clearHistory = () => localStorage.removeItem(HISTORY_KEY);

// ── Registrar búsqueda en Supabase ─────────────────────────────────────────

const logSearch = async (query: string, results: number, userId?: string) => {
  try {
    await supabase.from("search_logs").insert({
      query,
      results,
      user_id: userId ?? null,
    });
  } catch {
    // Silencioso — no interrumpir la búsqueda si falla el log
  }
};

// ── Tipos ─────────────────────────────────────────────────────────────────

interface PopularSearch {
  query: string;
  count: number;
}

interface UseSearchReturn {
  inputValue: string;
  debouncedTerm: string;
  setInputValue: (value: string) => void;

  results: SearchResults;
  isLoading: boolean;
  isError: boolean;
  hasResults: boolean;
  totalCount: number;

  history: string[];
  selectFromHistory: (term: string) => void;
  removeFromHistory: (term: string) => void;
  clearHistory: () => void;

  popularSearches: PopularSearch[];
  isLoadingPopular: boolean;
  selectFromPopular: (term: string) => void;

  // Voz
  isListening: boolean;
  voiceSupported: boolean;
  startListening: () => void;
  stopListening: () => void;

  reset: () => void;
}

// ── Hook principal ─────────────────────────────────────────────────────────

export const useSearch = (): UseSearchReturn => {
  const { user } = useUser();
  const [inputValue, setInputValue] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [history, setHistory] = useState<string[]>(getSearchHistory);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  // const recognitionRef = useRef<InstanceType<typeof SpeechRecognition> | null>(
  //   null,
  // );
  const loggedTermsRef = useRef<Set<string>>(new Set());
  const queryClient = useQueryClient();

  // ── Debounce ─────────────────────────────────────────────────────────────
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

  // ── Historial + log ───────────────────────────────────────────────────────
  useEffect(() => {
    if (debouncedTerm.length >= MIN_CHARS) {
      addToHistory(debouncedTerm);
      setHistory(getSearchHistory());
    }
  }, [debouncedTerm]);

  // ── Query principal ───────────────────────────────────────────────────────
  const {
    data,
    isFetching: isLoading,
    isError,
  } = useQuery<SearchResults>({
    queryKey: ["search", debouncedTerm],
    queryFn: () => searchAll(debouncedTerm),
    enabled: debouncedTerm.length >= MIN_CHARS,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  });

  // ── Registrar búsqueda en Supabase (solo una vez por término) ─────────────
  useEffect(() => {
    if (!data || !debouncedTerm || loggedTermsRef.current.has(debouncedTerm))
      return;
    const total =
      (data.products?.length ?? 0) +
      (data.categories?.length ?? 0) +
      (data.posts?.length ?? 0);
    loggedTermsRef.current.add(debouncedTerm);
    logSearch(debouncedTerm, total, user?.id);
    // Invalidar búsquedas populares para que se actualicen
    queryClient.invalidateQueries({ queryKey: ["popular-searches"] });
  }, [data, debouncedTerm, user?.id, queryClient]);

  // ── Búsquedas populares ───────────────────────────────────────────────────
  const { data: popularData, isFetching: isLoadingPopular } = useQuery<
    PopularSearch[]
  >({
    queryKey: ["popular-searches"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_popular_searches");
      if (error) throw error;
      return (data as unknown as PopularSearch[]) ?? [];
    },
    staleTime: 1000 * 60 * 5, // 5 min
    gcTime: 1000 * 60 * 10,
  });

  // ── Web Speech API ────────────────────────────────────────────────────────
  const voiceSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const startListening = () => {
    if (!voiceSupported) return;

    const SpeechRecognition =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = "es-VE";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  // ── Resultados ────────────────────────────────────────────────────────────
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
    loggedTermsRef.current.clear();
  };

  const selectFromHistory = (term: string) => {
    setInputValue(term);
    setDebouncedTerm(term);
  };

  const selectFromPopular = (term: string) => {
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
    popularSearches: popularData ?? [],
    isLoadingPopular,
    selectFromPopular,
    isListening,
    voiceSupported,
    startListening,
    stopListening,
    reset,
  };
};