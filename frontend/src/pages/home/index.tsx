import { useQuery } from "@tanstack/react-query";
import { getListings } from "./api";

import type { ListingData } from "../../shared/types";
import { Button } from "../../shared/ui/button";
import { useAuth } from "../../shared/core/auth";
import { useState } from "react";
import CreateListingForm from "./ui/create-listing-form";
import styles from "./styles.module.css";
import ListingCard from "./ui/listing-card";
import ListingCardSkeleton from "./ui/listing-card/skeleton";
import ErrorScreen from "../../shared/ui/error-screen";

import { useTranslation } from "react-i18next";
// import { filteredListings } from "../../shared/core/mock";

export default function Home() {
  const {
    data: listingsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["listings"],
    queryFn: getListings,
  });

  const { data: authData } = useAuth();
  const isAuthenticated = !!authData?.user;
  const { t } = useTranslation();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateListing = () => {
    setIsCreating(true);
  };

  if (isError) {
    return <ErrorScreen text={t("errors.home.loading")} />;
  }

  return (
    <section className="page-layout">
      <div className={styles.listing_controls}>
        {isCreating && <CreateListingForm setIsCreating={setIsCreating} />}

        {isAuthenticated && (
          <Button
            variant="primary"
            className="w-fit h-fit"
            onClick={handleCreateListing}
          >
            {t("buttons.createListing")}
          </Button>
        )}
      </div>
      <div className="cards">
        {isLoading ? (
          <>
            <ListingCardSkeleton />
            <ListingCardSkeleton />
            <ListingCardSkeleton />
            <ListingCardSkeleton />
          </>
        ) : (
          listingsData &&
          listingsData.length > 0 &&
          listingsData.map((listingData: ListingData) => (
            <ListingCard
              key={listingData.listing.id}
              listing={listingData.listing}
              isInWishlist={listingData.is_in_wishlist}
            />
          ))
        )}
      </div>
    </section>
  );
}
