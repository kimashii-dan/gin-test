import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import styles from "./styles.module.css";

type RatingStarsProps = {
  rating: number;
  maxRating?: number;
  size?: "small" | "medium" | "large";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showCount?: boolean;
  count?: number;
};

export default function RatingStars({
  rating,
  maxRating = 5,
  size = "medium",
  interactive = false,
  onRatingChange,
  showCount = false,
  count,
}: RatingStarsProps) {
  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  const sizeClass = styles[size];

  return (
    <div className={styles.container}>
      <div className={styles.stars}>
        {Array.from({ length: maxRating }, (_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= Math.round(rating);

          return (
            <button
              key={index}
              type="button"
              className={`${styles.star} ${sizeClass} ${
                interactive ? styles.interactive : ""
              }`}
              onClick={() => handleClick(starValue)}
              disabled={!interactive}
              aria-label={`Rate ${starValue} stars`}
            >
              {isFilled ? (
                <StarSolidIcon className={styles.icon} />
              ) : (
                <StarOutlineIcon className={styles.icon} />
              )}
            </button>
          );
        })}
      </div>
      {showCount && count !== undefined && (
        <span className={styles.count}>({count})</span>
      )}
    </div>
  );
}
