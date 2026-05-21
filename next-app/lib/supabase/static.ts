import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

// Cliente para build-time / static generation (sin cookies, solo lectura pública)
export const createStaticClient = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
};
