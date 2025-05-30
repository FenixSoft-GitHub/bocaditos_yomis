import { BsTagsFill } from "react-icons/bs";
import { TbTruckDelivery } from "react-icons/tb";
import { FaBlog, FaBoxOpen, FaCartShopping, FaUserCheck } from "react-icons/fa6";
import { MdCategory } from "react-icons/md";
import { IoBarChartSharp } from "react-icons/io5";

export const DashboardLinks = [
  {
    id: 1,
    title: "Productos",
    href: "/dashboard/products",
    icon: <FaBoxOpen size={25} />,
  },
  {
    id: 2,
    title: "Ordenes",
    href: "/dashboard/orders",
    icon: <FaCartShopping size={25} />,
  },
  {
    id: 3,
    title: "Categorias",
    href: "/dashboard/categories",
    icon: <MdCategory size={25} />,
  },
  {
    id: 4,
    title: "Promociones",
    href: "/dashboard/promotions",
    icon: <BsTagsFill size={25} />,
  },
  {
    id: 5,
    title: "Delivery",
    href: "/dashboard/deliverys",
    icon: <TbTruckDelivery size={25} />,
  },
  {
    id: 6,
    title: "Blog",
    href: "/dashboard/blog",
    icon: <FaBlog size={25} />,
  },
  {
    id: 7,
    title: "Usuarios",
    href: "/dashboard/users",
    icon: <FaUserCheck size={25} />,
  },
  {
    id: 8,
    title: "Gráficos",
    href: "/dashboard/charts",
    icon: <IoBarChartSharp size={25} />,
  },
];
