import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;

// import { useEffect, useRef } from "react";
// import { useLocation } from "react-router-dom";

// const ScrollToTop = () => {
//   const { pathname } = useLocation();
//   const scrollPositions = useRef<Record<string, number>>({});

//   useEffect(() => {
//     // Guardamos la posición actual antes de cambiar de página
//     const currentScrollPositions = scrollPositions.current;
//     return () => {
//       currentScrollPositions[pathname] = window.scrollY;
//     };
//   }, [pathname]);

//   useEffect(() => {
//     const savedPosition = scrollPositions.current[pathname];
//     if (savedPosition !== undefined) {
//       window.scrollTo(0, savedPosition);
//     } else {
//       window.scrollTo(0, 0);
//     }
//   }, [pathname]);

//   return null;
// };

// export default ScrollToTop;
