import { Star, StarHalf } from "lucide-react";

interface Props {
  rating: number;
}

export const StarRating = ({ rating }: Props) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center justify-center gap-0.5 text-dorado">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className="size-4 fill-current" />
      ))}
      {hasHalf && <StarHalf className="size-4 fill-current" />}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star
          key={`empty-${i}`}
          className="size-4 stroke-current fill-transparent"
        />
      ))}
    </div>
  );
};
