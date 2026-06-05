import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

export const socialLinks = [
  {
    id: 1,
    title: "Facebook",
    href: "https://www.facebook.com",
    icon: <FaFacebookF />,
    className:
      "flex items-center justify-center p-3 text-xl text-cream/70 bg-cream/20 rounded-full hover:text-gray-200 hover:text-gray-100 hover:transition ease-in-out duration-1000 hover:scale-110 hover:bg-[#3b5998]",
    className2:
      "flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-md bg-cocoa/5 dark:bg-cream/5 border border-cocoa/10 dark:border-cream/10  shadow-choco/30 dark:shadow-cream/10 shadow-md hover:transition ease-in-out duration-1000 hover:scale-110 hover:bg-[#3b5998] hover:text-cream",
  },
  {
    id: 2,
    title: "Twitter",
    href: "https://www.twitter.com",
    icon: <FaXTwitter />,
    className:
      "flex items-center justify-center p-3 text-xl text-cream/70 bg-cream/20 rounded-full hover:text-gray-200 hover:scale-110 hover:transition ease-in-out duration-1000 hover:bg-[#00acee]",
    className2:
      "flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-md bg-cocoa/5 dark:bg-cream/5 border border-cocoa/10 dark:border-cream/10  shadow-choco/30 dark:shadow-cream/10 shadow-md hover:transition ease-in-out duration-1000 hover:scale-110 hover:bg-[#00acee] hover:text-cream",
  },
  {
    id: 3,
    title: "Instagram",
    href: "https://www.instagram.com",
    icon: <FaInstagram />,
    className:
      "icon flex items-center justify-center p-3 text-xl text-cream/70 bg-cream/20 rounded-full hover:text-gray-200 hover:scale-110",
    className2:
      "icon flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-md bg-cocoa/5 dark:bg-cream/5 border border-cocoa/10 dark:border-cream/10 shadow-choco/30 dark:shadow-cream/10 shadow-md hover:transition ease-in-out duration-1000 hover:scale-110 hover:text-cream",
  },
  {
    id: 4,
    title: "Tiktok",
    href: "https://www.tiktok.com",
    icon: <FaTiktok />,
    className:
      "flex items-center justify-center p-3 text-xl text-cream/70 bg-cream/20 rounded-full hover:text-gray-200 hover:scale-110 hover:transition ease-in-out duration-1000 hover:bg-[#00f2ea]",
    className2:
      "flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-md bg-cocoa/5 dark:bg-cream/5 border border-cocoa/10 dark:border-cream/10  shadow-choco/30 dark:shadow-cream/10 shadow-md hover:transition ease-in-out duration-1000 hover:scale-110 hover:bg-[#00f2ea] hover:text-cream",
  },
  {
    id: 5,
    title: "YouTube",
    href: "https://www.youtube.com",
    icon: <FaYoutube />,
    className:
      "flex items-center justify-center p-3 text-xl text-cream/70 bg-cream/20 rounded-full hover:text-gray-200 hover:transition ease-in-out duration-1000 hover:scale-110 hover:bg-[#c4302b]",
    className2:
      "flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-md bg-cocoa/5 dark:bg-cream/5 border border-cocoa/10 dark:border-cream/10  shadow-choco/30 dark:shadow-cream/10 shadow-md hover:transition ease-in-out duration-1000 hover:scale-110 hover:bg-[#c4302b] hover:text-cream",
  },
];