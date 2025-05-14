import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "@layout/Layout";
import {
  AboutPage,
  CheckoutPage,
  DashboardCategoriesPage,
  DashboardDeliverysPage,
  DashboardDeliverysUpdatePage,
  DashboardProductUpdatePage,
  DashboardOrdersPage,
  DashboardProductsPage,
  DashboardPromoPage,
  DashboardCategoryUpdatePage,
  HomePage,
  LoginPage,
  OrdersUserPage,
  OrderUserPage,
  ProductPage,
  RegisterPage,
  ThankyouPage,
  DashboardPromoUpdatePage,
  DashboardOrderPage,
  TermsOfUsers,
  Soporte,
  Policies,
  Condiciones,
} from "@/pages";
import BlogPages from "@/pages/blog/BlogPages";
import BlogPostsList from "@/pages/blog/BlogPostsList";
import NuestraHistoriaPage from "@/pages/informations/NuestraHistoriaPage";
import ContactUsPage from "@/pages/ContactUsPage";
import ProductsPage from "@/pages/product/ProductsPage";
import ClientLayout from "@/layout/ClientLayout";
import DashboardLayout from "@/layout/DashboardLayout";

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
      { path: "/soporte", element: <Soporte /> },
      { path: "/terms-of-use", element: <TermsOfUsers /> },
      { path: "/policies", element: <Policies /> },
      { path: "/conditions", element: <Condiciones /> },
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
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: <Navigate to="/dashboard/products" />,
      },
      {
        path: "products",
        element: <DashboardProductsPage />,
      },
      {
        path: "product/new",
        element: <DashboardProductUpdatePage />,
      },
      {
        path: "product/edit/:id",
        element: <DashboardProductUpdatePage />,
      },
      {
        path: "orders",
        element: <DashboardOrdersPage />,
      },
      {
        path: "orders/:id",
        element: <DashboardOrderPage />,
      },
      {
        path: "categories",
        element: <DashboardCategoriesPage />,
      },
      {
        path: "category/new",
        element: <DashboardCategoryUpdatePage />,
      },
      {
        path: "category/edit/:id",
        element: <DashboardCategoryUpdatePage />,
      },
      {
        path: "deliverys",
        element: <DashboardDeliverysPage />,
      },
      {
        path: "deliverys/new",
        element: <DashboardDeliverysUpdatePage />,
      },
      {
        path: "deliverys/edit/:id",
        element: <DashboardDeliverysUpdatePage />,
      }, 
      {
        path: "promotions",
        element: <DashboardPromoPage />,
      },
      {
        path: "promotions/new",
        element: <DashboardPromoUpdatePage />,
      },
      {
        path: "promotions/edit/:id",
        element: <DashboardPromoUpdatePage />,
      },
    ],
  },
]);
