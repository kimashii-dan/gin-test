import { useQuery } from "@tanstack/react-query";
import { getWishlist } from "./api";
import type { Listing } from "../../shared/types";

import ErrorScreen from "../../shared/ui/error-screen";
import EmptyData from "../../shared/ui/empty-data";
import { useTranslation } from "react-i18next";
import ListingCardSkeleton from "../../shared/ui/listing-card/skeleton";
import ListingCard from "../../shared/ui/listing-card";

export default function WishlistPage() {
  const {
    data: listings,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
  });

  const { t } = useTranslation();

  if (isError) {
    return <ErrorScreen text={t("errors.wishlist.loading")} />;
  }

  return (
    <section className="page-layout">
      <h1 className="page-title">{t("wishlist")}</h1>
      {!isLoading && listings && listings.length === 0 && (
        <EmptyData text={t("errors.wishlist.absence")} />
      )}
      <div className="cards">
        {isLoading ? (
          <>
            <ListingCardSkeleton />
            <ListingCardSkeleton />
            <ListingCardSkeleton />
            <ListingCardSkeleton />
          </>
        ) : (
          Array.isArray(listings) &&
          listings.map((listing: Listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              isInWishlist={true}
              queryKey={"wishlist"}
            />
          ))
        )}
      </div>
    </section>
  );
}
