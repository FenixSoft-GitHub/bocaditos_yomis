import { IoIosStarHalf, IoIosStarOutline } from "react-icons/io";
import { IoStarSharp } from "react-icons/io5";

interface Props {
  rating: number; // de 0 a 5, puede ser decimal (ej. 4.5)
}

export const StarRating = ({ rating }: Props) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center justify-center gap-0.5 text-yellow-500">
      {Array.from({ length: fullStars }).map((_, i) => (
        <IoStarSharp key={`full-${i}`} className="size-4 fill-current" />
      ))}
      {hasHalfStar && <IoIosStarHalf className="size-4 fill-current" />}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <IoIosStarOutline key={`empty-${i}`} className="size-4 fill-current" />
      ))}
    </div>
  );
};
