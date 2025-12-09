import { ClockIcon, HeartIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router";

import styles from "./styles.module.css";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../core/auth";
import type { Listing, ServerError } from "../../types";
import { addToWishlist } from "../../../pages/listing/api";
import { Card } from "../card";
import { timeAgo } from "../../helpers/timeAgo";

export default function ListingCard({
  listing,
  isInWishlist,
  queryKey = "listings",
}: {
  listing: Listing;
  isInWishlist?: boolean;
  queryKey?: string;
}) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data: authData } = useAuth();
  const isAuthenticated = !!authData?.user;
  const likeMutation = useMutation({
    mutationFn: addToWishlist,
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    onError: (error: ServerError) => {
      console.log(error.response.data.error);
    },
  });

  function handleAddToWishList(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    event.stopPropagation();
    event.preventDefault();
    if (likeMutation.isPending) return;
    const id = listing.id;
    likeMutation.mutate(id);
  }

  return (
    <Link to={`/listings/${listing.id}`}>
      <Card className={styles.card_listing}>
        <div className={styles.card_img}>
          <img
            src={
              listing.image_urls && listing.image_urls.length > 0
                ? listing.image_urls[0]
                : "/images/placeholder.webp"
            }
            className="w-full h-full object-cover"
            alt={`${listing.title} image 1`}
          />

          <span
            className={
              listing.is_closed
                ? styles.card_status_sold
                : styles.card_status_available
            }
          >
            {listing.is_closed
              ? t("listingCard.status.sold")
              : t("listingCard.status.available")}
          </span>

          <span className={styles.card_posted}>
            <div className="flex items-center gap-1">
              <ClockIcon className="size-4" />
              <span>{timeAgo(listing.created_at)}</span>
            </div>
          </span>
        </div>

        <div className="w-full flex flex-col flex-1 gap-5">
          <div className="">
            <h1 className={styles.card_title}>{listing.title}</h1>
            {listing.category && (
              <span className="inline-block px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full mt-1 mb-2">
                {t(
                  `listingForm.category.categories.${listing.category.toLowerCase()}`
                )}
              </span>
            )}
            <p className={styles.card_description}>{listing.description}</p>
          </div>

          <div className="w-full flex justify-between mt-auto">
            <h2 className={styles.card_price}>${listing.price}</h2>

            {isAuthenticated && authData.user.id !== listing.user_id && (
              <button
                onClick={handleAddToWishList}
                className="flex items-center gap-2"
              >
                <HeartIcon
                  fill={`${isInWishlist ? "red" : "none"}`}
                  className="size-7 text-destructive"
                />
                <span>{t("listingCard.like")}</span>
              </button>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
