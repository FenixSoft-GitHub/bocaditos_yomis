import { Home, Store, Info } from "lucide-react";
import { GrBlog } from "react-icons/gr";
import { MdOutlineConnectWithoutContact } from "react-icons/md";

export const NavbarLinks = [
  {
    id: 1,
    title: "Inicio",
    href: "/",
    icon: <Home className="size-5" />,
  },
  {
    id: 2,
    title: "Productos",
    href: "/products",
    icon: <Store className="size-5" />,
  },
  {
    id: 3,
    title: "Sobre Nosotros",
    href: "/about",
    icon: <Info className="size-5" />,
  },
  {
    id: 4,
    title: "Blog",
    href: "/blog",
    icon: <GrBlog className="size-5" />,
  },
  {
    id: 5,
    title: "Contáctanos",
    href: "/contact-us",
    icon: <MdOutlineConnectWithoutContact className="size-6" />,
  },
];
