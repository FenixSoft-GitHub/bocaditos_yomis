import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CartButton } from "@/components/layout/CartButton";
import Link from "next/link";
import { Toaster } from "react-hot-toast"; // ← Importar

const geistSans = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bocaditos Yomis",
  description: "Tienda online de bocaditos artesanales",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.className} antialiased min-h-screen flex flex-col bg-gray-950 text-white`}
      >
        {/* Header */}
        <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link
              href="/"
              className="text-xl font-bold hover:text-blue-400 transition-colors"
            >
              🧁 Bocaditos Yomis
            </Link>
            <nav className="flex items-center gap-4">
              <CartButton />
            </nav>
          </div>
        </header>

        {/* Contenido principal */}
        {children}

        {/* ✅ Toaster global para notificaciones */}
        <Toaster
          position="top-right"
          toastOptions={{
            // Estilos base para todos los toasts
            duration: 3000,
            style: {
              background: "#1f2937", // gray-800
              color: "#fff",
              border: "1px solid #374151", // gray-700
              borderRadius: "12px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
            },
            // Estilo para toasts de éxito
            success: {
              iconTheme: { primary: "#22c55e", secondary: "#fff" }, // green-500
              style: { background: "#064e3b" }, // green-900
            },
            // Estilo para errores
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#fff" }, // red-500
              style: { background: "#7f1d1d" }, // red-900
            },
          }}
        />

        {/* Footer */}
        <footer className="mt-auto border-t border-gray-800 py-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Bocaditos Yomis. Todos los derechos
          reservados.
        </footer>
      </body>
    </html>
  );
}
