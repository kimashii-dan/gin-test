import { useQuery } from "@tanstack/react-query";
import { getUserRatings } from "../../../../shared/api";
import { Card } from "../../../../shared/ui/card";
import RatingStars from "../../../../shared/ui/rating-stars";
import type { Rating } from "../../../../shared/types";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.css";
import EmptyData from "../../../../shared/ui/empty-data";

type UserRatingsProps = {
  userId: number;
};

export default function UserRatings({ userId }: UserRatingsProps) {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["ratings", userId],
    queryFn: () => getUserRatings(userId),
  });

  if (isLoading) {
    return (
      <Card className={styles.card}>
        <h2 className={styles.title}>{t("ratings.title")}</h2>
        <p className={styles.loading}>{t("loading")}...</p>
      </Card>
    );
  }

  if (isError || !data) {
    return null;
  }

  const { ratings, average_rating, rating_count } = data;

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t("ratings.title")}</h2>
        {rating_count > 0 && (
          <div className={styles.averageRating}>
            <RatingStars
              rating={average_rating}
              size="medium"
              showCount
              count={rating_count}
            />
            <span className={styles.averageText}>
              {average_rating.toFixed(1)} {t("ratings.outOf")} 5
            </span>
          </div>
        )}
      </div>

      {ratings.length === 0 ? (
        <EmptyData text={t("ratings.noRatings")} />
      ) : (
        <div className={styles.ratingsList}>
          {ratings.map((rating: Rating) => (
            <div key={rating.id} className={styles.ratingItem}>
              <div className={styles.ratingHeader}>
                <div className={styles.raterInfo}>
                  {rating.rater?.avatar_url ? (
                    <img
                      src={rating.rater.avatar_url}
                      alt={rating.rater.name || "User"}
                      className={styles.avatar}
                    />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {rating.rater?.email?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                  <div>
                    <p className={styles.raterName}>
                      {rating.rater?.name || t("anonymous")}
                    </p>
                    <p className={styles.date}>
                      {new Date(rating.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <RatingStars rating={rating.rating} size="small" />
              </div>

              {rating.comment && (
                <p className={styles.comment}>{rating.comment}</p>
              )}

              {rating.listing && (
                <p className={styles.listingRef}>
                  {t("ratings.forListing")}: {rating.listing.title}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
