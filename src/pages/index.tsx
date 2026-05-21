import { lazy } from "react";

// ── Páginas públicas ──────────────────────────────────────────────
export const HomePage = lazy(() => import("@pages/HomePage"));
export const AboutPage = lazy(() => import("@pages/AboutPage"));
export const NuestraHistoriaPage = lazy(
  () => import("@/pages/informations/NuestraHistoriaPage"),
);
export const ContactUsPage = lazy(() => import("@pages/ContactUsPage"));
export const ProductsPage = lazy(() => import("@pages/product/ProductsPage"));
export const ProductPage = lazy(() => import("@pages/product/ProductPage"));

// ── Autenticación ─────────────────────────────────────────────────
export const LoginPage = lazy(() => import("@pages/authentication/LoginPage"));
export const RegisterPage = lazy(
  () => import("@pages/authentication/RegisterPage"),
);

// ── Cuenta de usuario ─────────────────────────────────────────────
export const OrdersUserPage = lazy(
  () => import("@pages/orders/OrdersUserPage"),
);
export const OrderUserPage = lazy(() => import("@pages/orders/OrderUserPage"));

// ── Checkout ──────────────────────────────────────────────────────
export const CheckoutPage = lazy(() => import("@pages/checkout/CheckoutPage"));
export const ThankyouPage = lazy(() => import("@pages/checkout/ThankyouPage"));

// ── Blog público ──────────────────────────────────────────────────
export const BlogPublicListPage = lazy(
  () => import("@pages/blog/BlogPublicListPage"),
);
export const BlogPostDetailPage = lazy(
  () => import("@pages/blog/BlogPostDetailPage"),
);

// ── Información legal ─────────────────────────────────────────────
export const Policies = lazy(() => import("@/pages/informations/Policies"));
export const Soporte = lazy(() => import("@/pages/informations/Soporte"));
export const TermsOfUsers = lazy(
  () => import("@/pages/informations/TermsOfUsers"),
);
export const Condiciones = lazy(
  () => import("@/pages/informations/Condiciones"),
);

// ── Dashboard (solo se carga cuando el admin accede) ──────────────
export const DashboardProductsPage = lazy(
  () => import("@pages/dashboard/DashboardProductsPage"),
);
export const DashboardDeliverysPage = lazy(
  () => import("@pages/dashboard/DashboardDeliverysPage"),
);
export const DashboardPromoPage = lazy(
  () => import("@pages/dashboard/DashboardPromoPage"),
);
export const DashboardCategoriesPage = lazy(
  () => import("@pages/dashboard/DashboardCategoriesPage"),
);
export const DashboardOrdersPage = lazy(
  () => import("@pages/dashboard/DashboardOrdersPage"),
);
export const DashboardOrderPage = lazy(
  () => import("@pages/dashboard/DashboardOrderPage"),
);
export const DashboardProductUpdatePage = lazy(
  () => import("@/pages/dashboard/DashboardProductUpdatePage"),
);
export const DashboardCategoryUpdatePage = lazy(
  () => import("@/pages/dashboard/DashboardCategoryUpdatePage"),
);
export const DashboardDeliverysUpdatePage = lazy(
  () => import("@pages/dashboard/DashboardDeliverysUpdatePage"),
);
export const DashboardPromoUpdatePage = lazy(
  () => import("@pages/dashboard/DashboardPromoUpdatePage"),
);
export const DashboardChartsPage = lazy(
  () => import("@pages/dashboard/DashboardChartsPage"),
);
export const DashboardUsersPage = lazy(
  () => import("@pages/dashboard/DashboardUsersPage"),
);
export const DashboardReceiptsPage = lazy(
  // ← NUEVO
  () => import("@pages/dashboard/DashboardReceiptsPage"),
);
export const BlogDashboardPage = lazy(
  () => import("@pages/dashboard/blog/BlogDashboardPage"),
);
export const NewBlogPostPage = lazy(
  () => import("@pages/dashboard/blog/NewBlogPostPage"),
);
export const EditBlogPostPage = lazy(
  () => import("@pages/dashboard/blog/EditBlogPostPage"),
);

// ── Página 404 ───────────────────────────────────────────────────
export const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
