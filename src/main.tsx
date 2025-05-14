import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { AppRoutes } from './router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from './components/shared/ThemeProvider'

// Create a client
const queryClient = new QueryClient()


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={AppRoutes} />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
);
