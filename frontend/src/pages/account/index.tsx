import { useQuery } from "@tanstack/react-query";
import { getUser } from "./api";
import type { ListingData } from "../../shared/types";
import ListingCard from "../home/ui/listing-card";
import AccountDetails from "./ui/account-details";
import AccountDetailsSkeleton from "./ui/account-details/skeleton";
import { useParams } from "react-router";
import ListingCardSkeleton from "../home/ui/listing-card/skeleton";
import EmptyData from "../../shared/ui/empty-data";

export default function AccountPage() {
  const { id } = useParams();
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["otherUser", id],
    queryFn: () => getUser(Number(id)),
  });

  if (isError || !user) {
    return <EmptyData text={"Error loading account"} />;
  }

  return (
    <div className="page-layout">
      <h1 className="page-title">Account</h1>
      {isLoading ? <AccountDetailsSkeleton /> : <AccountDetails user={user} />}

      <h2 className="font-nice text-4xl italic">Listings</h2>

      {!isLoading && user.listings && user.listings.length === 0 && (
        <EmptyData text={"No listings available"} />
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
          Array.isArray(user.listings) &&
          user.listings.map((listingData: ListingData) => (
            <ListingCard
              key={listingData.listing.id}
              listing={listingData.listing}
              isInWishlist={listingData.is_in_wishlist}
              queryKey={"otherUser"}
            />
          ))
        )}
      </div>
    </div>
  );
}
