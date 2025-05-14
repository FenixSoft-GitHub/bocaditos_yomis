import { BsTagsFill } from "react-icons/bs";
import { TbTruckDelivery } from "react-icons/tb";
import { FaBoxOpen, FaCartShopping } from "react-icons/fa6";
import { MdCategory } from "react-icons/md";

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
];
