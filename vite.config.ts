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
      includeAssets: [
        "favicon.svg",
        "robots.txt",
        "sitemap.xml",
        "offline.html",
        "LogoBocaditosYomis.avif",
      ],
      workbox: {
        navigateFallback: "/offline.html",
        navigateFallbackDenylist: [/^\/api/, /^\/dashboard/],
        runtimeCaching: [
          {
            // Imágenes de Supabase → CacheFirst 30 días
            urlPattern: /^https:\/\/.*\.supabase\.co\/storage\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "supabase-images",
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Fuentes Google → CacheFirst 1 año
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // API Supabase → NetworkFirst con fallback 5 min
            urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "supabase-api",
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 5 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Assets JS/CSS → StaleWhileRevalidate 7 días
            urlPattern: /\.(?:js|css|woff2?)$/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "static-assets",
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
          {
            // Imágenes locales → CacheFirst 30 días
            urlPattern: /\.(?:png|jpg|jpeg|svg|avif|webp|ico)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "local-images",
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
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
