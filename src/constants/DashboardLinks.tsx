import {
  BookOpen,
  Package,
  ShoppingBag,
  Tag,
  Truck,
  Users,
  BarChart3,
  LayoutGrid,
  CreditCard,
  Receipt,
} from "lucide-react";


export const DashboardLinks = [
  {
    id: 1,
    title: "Ordenes",
    href: "/dashboard/orders",
    icon: <ShoppingBag size={22} />,
  },
  {
    id: 2,
    title: "Comprobantes",
    href: "/dashboard/receipts",
    icon: <Receipt size={22} />,
  },
  {
    id: 3,
    title: "Productos",
    href: "/dashboard/products",
    icon: <Package size={22} />,
  },
  {
    id: 4,
    title: "Categorias",
    href: "/dashboard/categories",
    icon: <LayoutGrid size={22} />,
  },
  {
    id: 5,
    title: "Promociones",
    href: "/dashboard/promotions",
    icon: <Tag size={22} />,
  },
  {
    id: 6,
    title: "Delivery",
    href: "/dashboard/deliverys",
    icon: <Truck size={22} />,
  },
  {
    id: 7,
    title: "Blog",
    href: "/dashboard/blog",
    icon: <BookOpen size={22} />,
  },
  {
    id: 8,
    title: "Usuarios",
    href: "/dashboard/users",
    icon: <Users size={22} />,
  },
  {
    id: 9,
    title: "Métodos de Pago",
    href: "/dashboard/payment-methods",
    icon: <CreditCard size={22} />,
  },
  {
    id: 10,
    title: "Gráficos",
    href: "/dashboard/charts",
    icon: <BarChart3 size={22} />,
  },
  {
    id: 11,
    title: "Cupones",
    href: "/dashboard/coupons",
    icon: <Tag size={22} />,
  },
];
