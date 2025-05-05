import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "@layout/Layout";
import { AboutPage, CheckoutPage, HomePage, LoginPage, OrdersUserPage, OrderUserPage, ProductPage, RegisterPage, ThankyouPage } from "@/pages";
import BlogPages from "@/pages/blog/BlogPages";
import BlogPostsList from "@/pages/blog/BlogPostsList";
import NuestraHistoriaPage from "@/pages/NuestraHistoriaPage";
import ContactUsPage from "@/pages/ContactUsPage";
import ProductsPage  from "@/pages/product/ProductsPage";
import ClientLayout from "@/layout/ClientLayout";

export const AppRoutes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/products", element: <ProductsPage /> },
      { path: "/products/:slug", element: <ProductPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/about/nuestra-historia", element: <NuestraHistoriaPage /> },
      { path: "/blog", element: <BlogPostsList /> },
      { path: "/blog/:slug", element: <BlogPages /> },
      { path: "/contact-us", element: <ContactUsPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      {
        path: "account",
        element: <ClientLayout />,
        children: [
          { path: "", element: <Navigate to="/account/pedidos" /> },
          { path: "pedidos", element: <OrdersUserPage /> },
          { path: "pedidos/:id", element: <OrderUserPage /> },
        ],
      },
    ],
  },
  { path: "/checkout", element: <CheckoutPage /> },
  { path: "/checkout/:id/thank-you", element: <ThankyouPage /> },
]);
