import { useQuery } from "@tanstack/react-query";
import { getUser } from "./api";
import type { ListingData } from "../../shared/types";
import ListingCard from "../home/ui/listing-card";
import AccountDetails from "./ui/account-details";
import AccountDetailsSkeleton from "./ui/account-details/skeleton";
import { useParams } from "react-router";
import ListingCardSkeleton from "../home/ui/listing-card/skeleton";
import EmptyData from "../../shared/ui/empty-data";
import { useTranslation } from "react-i18next";
import ErrorScreen from "../../shared/ui/error-screen";

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
  const { t } = useTranslation();

  if (isError) {
    return <ErrorScreen text={t("errors.account.loading")} />;
  }

  return (
    <div className="page-layout">
      <h1 className="page-title">{t("profile.account")}</h1>
      {isLoading ? (
        <AccountDetailsSkeleton />
      ) : (
        user && <AccountDetails user={user} />
      )}

      <h2 className="font-nice text-4xl italic">{t("listings")}</h2>

      {!isLoading && user && user.listings && user.listings.length === 0 && (
        <EmptyData text={t("errors.account.listings.absence")} />
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
          user &&
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
