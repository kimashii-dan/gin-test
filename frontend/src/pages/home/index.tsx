import { useQuery } from "@tanstack/react-query";
import { getListings } from "./api";

import type { ListingData } from "../../shared/types";
import { Button } from "../../shared/ui/button";
import { useAuth } from "../../shared/core/auth";
import { useState } from "react";
import { useSearchParams } from "react-router";
import CreateListingForm from "./ui/create-listing-form";
import styles from "./styles.module.css";
import ListingCard from "./ui/listing-card";
import ListingCardSkeleton from "./ui/listing-card/skeleton";
import ErrorScreen from "../../shared/ui/error-screen";
import SelectSortBy from "./ui/select-sort-by";
import Search from "./ui/search";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy") || "Newest first";
  const searchQuery = searchParams.get("search") || "";

  const setSortBy = (value: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("sortBy", value);
      return newParams;
    });
  };

  const handleCreateListing = () => {
    setIsCreating(true);
  };

  // Filter listings based on search query
  let filteredListings = listingsData;
  if (listingsData && searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    filteredListings = listingsData.filter((listingData) =>
      listingData.listing.title.toLowerCase().includes(query)
    );
  }

  // Apply sorting to filtered listings
  if (filteredListings) {
    if (sortBy === "Title A-Z") {
      filteredListings.sort((a, b) =>
        a.listing.title.localeCompare(b.listing.title)
      );
    } else if (sortBy === "Newest first") {
      filteredListings.sort(
        (a, b) =>
          new Date(b.listing.created_at).getTime() -
          new Date(a.listing.created_at).getTime()
      );
    } else if (sortBy === "Oldest first") {
      filteredListings.sort(
        (a, b) =>
          new Date(a.listing.created_at).getTime() -
          new Date(b.listing.created_at).getTime()
      );
    } else if (sortBy === "Low to High") {
      filteredListings.sort((a, b) => a.listing.price - b.listing.price);
    } else if (sortBy === "High to Low") {
      filteredListings.sort((a, b) => b.listing.price - a.listing.price);
    }
  }

  if (isError) {
    return <ErrorScreen text={"Error loading listings"} />;
  }

  return (
    <section className="page-layout">
      {isCreating && <CreateListingForm setIsCreating={setIsCreating} />}

      <Search searchParams={searchParams} setSearchParams={setSearchParams} />

      <div className="flex flex-col gap-5">
        <div className={styles.listing_controls}>
          <div className="flex flex-row items-center gap-5">
            {isAuthenticated && (
              <SelectSortBy sortBy={sortBy} setSortBy={setSortBy} />
            )}
          </div>

          {isAuthenticated && (
            <Button
              variant="primary"
              className="w-fit h-fit"
              onClick={handleCreateListing}
            >
              Create listing
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
            filteredListings &&
            filteredListings.length > 0 &&
            filteredListings.map((listingData: ListingData) => (
              <ListingCard
                key={listingData.listing.id}
                listing={listingData.listing}
                isInWishlist={listingData.is_in_wishlist}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
