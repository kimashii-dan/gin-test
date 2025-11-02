import { useQuery } from "@tanstack/react-query";
import { getListings } from "./api";

import type { ListingData } from "../../shared/types";
import { Button } from "../../shared/ui/button";
import { useAuth } from "../../shared/core/auth";
import { useState } from "react";
import CreateListingForm from "./ui/create-listing-form";
import SelectListingType from "./ui/select-listing-type";
import styles from "./styles.module.css";
import ListingCard from "./ui/listing-card";
import ListingCardSkeleton from "./ui/listing-card/skeleton";
import ErrorScreen from "../../shared/ui/error-screen";
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

  const [isCreating, setIsCreating] = useState(false);
  const [listingType, setListingType] = useState("All");

  const handleCreateListing = () => {
    setIsCreating(true);
  };

  const filteredListings =
    listingsData && Array.isArray(listingsData)
      ? listingsData.filter((listingData: ListingData) => {
          if (listingType === "All") {
            return true;
          }
          if (listingType === "Mine") {
            return listingData.listing.user_id === authData?.user.id;
          }

          return true;
        })
      : [];

  if (isError) {
    return <ErrorScreen text={"Error loading listings"} />;
  }

  return (
    <section className="page-layout">
      <div className={styles.listing_controls}>
        <div className="flex flex-col lg:flex-row lg:items-end gap-5">
          <h1 className="page-title">Recent Listings</h1>

          {isAuthenticated && (
            <SelectListingType
              listingType={listingType}
              setListingType={setListingType}
            />
          )}
        </div>

        {isAuthenticated && (
          <Button
            variant="primary"
            className="w-48 h-fit"
            onClick={handleCreateListing}
          >
            Create listing
          </Button>
        )}
      </div>

      {isCreating && <CreateListingForm setIsCreating={setIsCreating} />}

      <div className="cards">
        {isLoading ? (
          <>
            <ListingCardSkeleton />
            <ListingCardSkeleton />
            <ListingCardSkeleton />
            <ListingCardSkeleton />
          </>
        ) : (
          filteredListings.map((listingData: ListingData) => (
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
