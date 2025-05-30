export const getColSpan = (i: number): string => {
  const pairInCycle = i % 6; // cada ciclo son 3 filas = 6 elementos

  if (pairInCycle === 0) return "lg:col-span-6"; // 1ra fila, 1er elemento
  if (pairInCycle === 1) return "lg:col-span-4"; // 1ra fila, 2do elemento

  if (pairInCycle === 2) return "lg:col-span-4"; // 2da fila, 1er elemento
  if (pairInCycle === 3) return "lg:col-span-6"; // 2da fila, 2do elemento

  if (pairInCycle === 4 || pairInCycle === 5) return "lg:col-span-5"; // 3ra fila

  return "lg:col-span-5"; // fallback (por seguridad)
};

// export const getColSpan = (i: number): string => {
//   const pairIndex = Math.floor(i / 2);
//   const isEvenPair = pairIndex % 2 === 0;

//   return i % 2 === 0
//     ? isEvenPair
//       ? "lg:col-span-6"
//       : "lg:col-span-4"
//     : isEvenPair
//     ? "lg:col-span-4"
//     : "lg:col-span-6";
// };

export const getMaxHeight = (i: number): string => {
  const col = getColSpan(i);
  return col === "lg:col-span-6" ? "max-h-[32rem]" : "max-h-[24rem]";
};

export const getImageClass = (i: number): string => {
  const col = getColSpan(i);
  return col === "lg:col-span-6"
    ? "aspect-[16/9] object-cover rounded-xl"
    : "aspect-[4/3] object-cover rounded-lg";
};
