/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PROJECT_URL_SUPABASE: string;
  readonly VITE_SUPABASE_API_KEY: string;
  // Puedes agregar más variables si las tienes
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

