import { useQuery } from "@tanstack/react-query";
import { getWishlist } from "./api";
import type { Listing } from "../../shared/types";
import ListingCard from "../home/ui/listing-card";
import ListingCardSkeleton from "../home/ui/listing-card/skeleton";
import ErrorScreen from "../../shared/ui/error-screen";
import EmptyData from "../../shared/ui/empty-data";

export default function WishlistPage() {
  const {
    data: listings,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
  });

  if (isError) {
    return <ErrorScreen text={"Error loading wishlist"} />;
  }

  return (
    <section className="page-layout">
      <h1 className="page-title">Wishlist</h1>
      {!isLoading && listings && listings.length === 0 && (
        <EmptyData text={"No items in wishlist"} />
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
