import { createBrowserRouter, Navigate } from "react-router-dom";
import { Suspense } from "react";
import type { ReactNode } from "react";
import { Layout } from "@layout/Layout";
import ClientLayout from "@/layout/ClientLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import { Loader } from "@/components/shared/Loader";
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
  DashboardChartsPage,
  DashboardUsersPage,
  BlogDashboardPage,
  NewBlogPostPage,
  EditBlogPostPage,
  BlogPostDetailPage,
  BlogPublicListPage,
  NuestraHistoriaPage,
  ContactUsPage,
  ProductsPage,
} from "@/pages";

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-fondo dark:bg-fondo-dark">
    <Loader size={50} />
  </div>
);

const s = (element: ReactNode) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
);

export const AppRoutes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: s(<HomePage />) },
      { path: "/products", element: s(<ProductsPage />) },
      { path: "/products/:slug", element: s(<ProductPage />) },
      { path: "/about", element: s(<AboutPage />) },
      { path: "/about/nuestra-historia", element: s(<NuestraHistoriaPage />) },
      { path: "/blog", element: s(<BlogPublicListPage />) },
      { path: "/blog/:slug", element: s(<BlogPostDetailPage />) },
      { path: "/contact-us", element: s(<ContactUsPage />) },
      { path: "/login", element: s(<LoginPage />) },
      { path: "/register", element: s(<RegisterPage />) },
      { path: "/soporte", element: s(<Soporte />) },
      { path: "/terms-of-use", element: s(<TermsOfUsers />) },
      { path: "/policies", element: s(<Policies />) },
      { path: "/conditions", element: s(<Condiciones />) },
      {
        path: "account",
        element: <ClientLayout />,
        children: [
          { path: "", element: <Navigate to="/account/pedidos" /> },
          { path: "pedidos", element: s(<OrdersUserPage />) },
          { path: "pedidos/:id", element: s(<OrderUserPage />) },
        ],
      },
    ],
  },
  { path: "/checkout", element: s(<CheckoutPage />) },
  { path: "/checkout/:id/thank-you", element: s(<ThankyouPage />) },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { path: "", element: <Navigate to="/dashboard/products" /> },
      { path: "products", element: s(<DashboardProductsPage />) },
      { path: "product/new", element: s(<DashboardProductUpdatePage />) },
      { path: "product/edit/:id", element: s(<DashboardProductUpdatePage />) },
      { path: "orders", element: s(<DashboardOrdersPage />) },
      { path: "orders/:id", element: s(<DashboardOrderPage />) },
      { path: "categories", element: s(<DashboardCategoriesPage />) },
      { path: "category/new", element: s(<DashboardCategoryUpdatePage />) },
      {
        path: "category/edit/:id",
        element: s(<DashboardCategoryUpdatePage />),
      },
      { path: "deliverys", element: s(<DashboardDeliverysPage />) },
      { path: "deliverys/new", element: s(<DashboardDeliverysUpdatePage />) },
      {
        path: "deliverys/edit/:id",
        element: s(<DashboardDeliverysUpdatePage />),
      },
      { path: "promotions", element: s(<DashboardPromoPage />) },
      { path: "promotions/new", element: s(<DashboardPromoUpdatePage />) },
      { path: "promotions/edit/:id", element: s(<DashboardPromoUpdatePage />) },
      { path: "users", element: s(<DashboardUsersPage />) },
      { path: "charts", element: s(<DashboardChartsPage />) },
      { path: "blog", element: s(<BlogDashboardPage />) },
      { path: "blog/new", element: s(<NewBlogPostPage />) },
      { path: "blog/edit/:id", element: s(<EditBlogPostPage />) },
    ],
  },
]);
