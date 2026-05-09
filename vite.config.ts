import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";
import mdPlugin from "vite-plugin-md";

export default defineConfig({
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
      includeAssets: ["favicon.svg", "robots.txt", "sitemap.xml"],
      manifest: {
        name: "Bocaditos Yomi's",
        short_name: "Yomi's",
        description: "Snacks y golosinas artesanales. Frescos y deliciosos.",
        theme_color: "#6b4226",
        background_color: "#f9f5f0",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        icons: [
          {
            src: "/icons/web-app-manifest-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/web-app-manifest-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        shortcuts: [
          {
            name: "Ver Productos",
            url: "/products",
            icons: [
              { src: "/icons/web-app-manifest-192x192.png", sizes: "192x192" },
            ],
          },
          {
            name: "Mi Pedido",
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
