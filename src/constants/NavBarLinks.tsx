import { Home, Store, Mail, Info, Rss } from "lucide-react";

export const navbarLinks = [
  {
    id: 1,
    title: "Inicio",
    href: "/",
    icon: <Home className="w-4 h-4" />,
  },
  {
    id: 2,
    title: "Productos",
    href: "/products",
    icon: <Store className="w-4 h-4" />,
  },
  {
    id: 3,
    title: "Sobre Nosotros",
    href: "/about",
    icon: <Info className="w-4 h-4" />,
  },
  {
    id: 4,
    title: "Blog",
    href: "/blog",
    icon: <Rss className="w-4 h-4" />,
  },
  {
    id: 5,
    title: "Contáctanos",
    href: "/contact-us",
    icon: <Mail className="w-4 h-4" />,
  },
];
