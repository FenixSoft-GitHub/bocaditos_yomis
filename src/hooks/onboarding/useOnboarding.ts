// src/hooks/useOnboarding.ts

import { useState, useEffect } from "react";
import { useUser } from "@/hooks";

const ONBOARDING_KEY = "yomis_onboarding_done";

export const useOnboarding = () => {
  const { session, isLoading } = useUser();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!session) return; // solo para usuarios logueados

    const done = localStorage.getItem(ONBOARDING_KEY);
    if (!done) setShow(true);
  }, [session, isLoading]);

  const complete = () => {
    localStorage.setItem(ONBOARDING_KEY, "1");
    setShow(false);
  };

  return { show, complete };
};
