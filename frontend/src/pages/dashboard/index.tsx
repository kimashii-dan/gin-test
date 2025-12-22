import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "./api";
import { useTranslation } from "react-i18next";
import { Card } from "../../shared/ui/card";
import ErrorScreen from "../../shared/ui/error-screen";
import {
  RectangleStackIcon,
  CheckCircleIcon,
  XCircleIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import styles from "./styles.module.css";
import ListingCard from "../../shared/ui/listing-card";
import EmptyData from "../../shared/ui/empty-data";
import type { ListingData, Rating } from "../../shared/types";
import RatingStars from "../../shared/ui/rating-stars";
import { Link } from "react-router";
import CreateListingForm from "../search/ui/create-listing-form";
import { useState } from "react";
import { Button } from "../../shared/ui/button";

export default function DashboardPage() {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user-listings"],
    queryFn: getDashboardStats,
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateListing = () => {
    setIsCreating(true);
  };

  if (isError) {
    return <ErrorScreen text={t("errors.dashboard.loading")} />;
  }

  const stats = data?.stats;
  const listings = data?.listings;
  const ratingsData = data?.ratings;

  return (
    <div className="page-layout">
      <h1 className="page-title">{t("dashboard.title")}</h1>

      {isLoading ? (
        <div className={styles.dashboard_grid}>
          {[...Array(5)].map((_, i) => (
            <Card key={i} className={styles.skeleton_card}>
              <div />
            </Card>
          ))}
        </div>
      ) : (
        stats && (
          <div className={styles.dashboard_grid}>
            <Card className={styles.stat_card}>
              <div className={styles.stat_icon_wrapper}>
                <RectangleStackIcon className={styles.stat_icon} />
              </div>
              <div className={styles.stat_content}>
                <div className={styles.stat_label}>
                  {t("dashboard.totalListings")}
                </div>
                <div className={styles.stat_value}>{stats.total_listings}</div>
              </div>
            </Card>

            <Card className={styles.stat_card}>
              <div className={`${styles.stat_icon_wrapper} ${styles.success}`}>
                <CheckCircleIcon className={styles.stat_icon} />
              </div>
              <div className={styles.stat_content}>
                <div className={styles.stat_label}>
                  {t("dashboard.activeListings")}
                </div>
                <div className={styles.stat_value}>{stats.active_listings}</div>
              </div>
            </Card>

            <Card className={styles.stat_card}>
              <div className={`${styles.stat_icon_wrapper} ${styles.closed}`}>
                <XCircleIcon className={styles.stat_icon} />
              </div>
              <div className={styles.stat_content}>
                <div className={styles.stat_label}>
                  {t("dashboard.closedListings")}
                </div>
                <div className={styles.stat_value}>{stats.closed_listings}</div>
              </div>
            </Card>

            <Card className={styles.stat_card}>
              <div className={`${styles.stat_icon_wrapper} ${styles.wishlist}`}>
                <HeartIcon className={styles.stat_icon} />
              </div>
              <div className={styles.stat_content}>
                <div className={styles.stat_label}>
                  {t("dashboard.totalWishlists")}
                </div>
                <div className={styles.stat_value}>{stats.total_wishlists}</div>
              </div>
            </Card>
          </div>
        )
      )}

      {/* Ratings Section */}
      {!isLoading && ratingsData && (
        <Card className={styles.ratings_card}>
          <div className={styles.ratings_header}>
            <h2 className={styles.ratings_title}>{t("ratings.title")}</h2>
            {ratingsData.rating_count > 0 && (
              <div className={styles.average_rating}>
                <RatingStars
                  rating={ratingsData.average_rating}
                  size="medium"
                  showCount
                  count={ratingsData.rating_count}
                />
                <span className={styles.average_text}>
                  {ratingsData.average_rating.toFixed(1)} {t("ratings.outOf")} 5
                </span>
              </div>
            )}
          </div>

          {ratingsData.ratings.length === 0 ? (
            <EmptyData text={t("ratings.noRatings")} />
          ) : (
            <div className={styles.ratings_list}>
              {ratingsData.ratings.map((rating: Rating) => (
                <Link
                  key={rating.id}
                  to={rating.listing ? `/listings/${rating.listing.id}` : "#"}
                  className={styles.rating_item}
                >
                  <div className={styles.rating_item_header}>
                    <div className={styles.rater_info}>
                      {rating.rater?.avatar_url ? (
                        <img
                          src={rating.rater.avatar_url}
                          alt={rating.rater.name || "User"}
                          className={styles.rating_avatar}
                        />
                      ) : (
                        <div className={styles.rating_avatar_placeholder}>
                          {rating.rater?.email?.[0]?.toUpperCase() || "?"}
                        </div>
                      )}
                      <div>
                        <p className={styles.rater_name}>
                          {rating.rater?.name || t("anonymous")}
                        </p>
                        <p className={styles.rating_date}>
                          {new Date(rating.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <RatingStars rating={rating.rating} size="small" />
                  </div>

                  {rating.comment && (
                    <p className={styles.rating_comment}>{rating.comment}</p>
                  )}

                  {rating.listing && (
                    <p className={styles.listing_ref}>
                      {t("ratings.forListing")}: {rating.listing.title}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </Card>
      )}

      <div className="flex gap-3 flex-wrap">
        <Button
          variant="primary"
          className="w-fit h-fit"
          onClick={handleCreateListing}
        >
          {t("buttons.createListing")}
        </Button>
      </div>

      {isCreating && <CreateListingForm setIsCreating={setIsCreating} />}

      {/* Listings Section */}
      {!isLoading && listings && (
        <div className={styles.section}>
          <h2 className={styles.section_title}>{t("listings")}</h2>
          {listings.length === 0 ? (
            <EmptyData text={t("errors.account.listings.absence")} />
          ) : (
            <div className="cards">
              {listings.map((listingData: ListingData) => (
                <ListingCard
                  key={listingData.listing.id}
                  listing={listingData.listing}
                  isInWishlist={listingData.is_in_wishlist}
                  queryKey="user-listings"
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
