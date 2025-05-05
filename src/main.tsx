import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { AppRoutes } from './router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from "react-hot-toast";
import "@theme-toggles/react/css/Expand.css";

// Create a client
const queryClient = new QueryClient()


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={AppRoutes} />
      <Toaster />
    </QueryClientProvider>
  </StrictMode>
);
