/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";
import mdPlugin from "vite-plugin-md";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/tests/",
        "src/pages/",
        "src/router/",
        "src/main.tsx",
        "**/*.d.ts",
        "**/*.config.*",
      ],
    },
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", "dist", "e2e"],
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@layout": path.resolve(__dirname, "src/layout"),
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-state": ["zustand", "@tanstack/react-query"],
          "vendor-ui": ["framer-motion", "react-hot-toast"],
          "vendor-charts": ["recharts", "d3"],
          "vendor-supabase": ["@supabase/supabase-js"],
          "vendor-markdown": [
            "react-markdown",
            "unified",
            "remark-parse",
            "remark-rehype",
            "rehype-stringify",
          ],
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },

  plugins: [
    react(),
    tailwindcss(),
    mdPlugin(),
    VitePWA({
      registerType: "autoUpdate",
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      injectManifest: {
        injectionPoint: "self.__WB_MANIFEST",
      },
      includeAssets: [
        "favicon.svg",
        "robots.txt",
        "sitemap.xml",
        "offline.html",
        "LogoBocaditosYomis.avif",
      ],
      manifest: {
        name: "Bocaditos Yomi's",
        short_name: "Yomi's",
        description: "Snacks y golosinas artesanales. Frescos y deliciosos.",
        theme_color: "#6b4226",
        background_color: "#f9f5f0",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        lang: "es",
        categories: ["food", "shopping"],
        icons: [
          {
            src: "/icons/favicon-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "/icons/web-app-manifest-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/web-app-manifest-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        shortcuts: [
          {
            name: "Ver Productos",
            short_name: "Productos",
            url: "/products",
            icons: [
              { src: "/icons/web-app-manifest-192x192.png", sizes: "192x192" },
            ],
          },
          {
            name: "Mi Pedido",
            short_name: "Pedidos",
            url: "/account/pedidos",
            icons: [
              { src: "/icons/web-app-manifest-192x192.png", sizes: "192x192" },
            ],
          },
        ],
      },
    }),
  ],

  assetsInclude: ["**/*.md"],
});
