import { useQuery } from "@tanstack/react-query";
import { getListing } from "./api";
import { useParams } from "react-router";

import ImageGallery from "./ui/image-gallery";
import ListingDetails from "./ui/listing-details";
import ListingPageSkeleton from "./skeleton";
import styles from "./styles.module.css";
import ErrorScreen from "../../shared/ui/error-screen";
import { useTranslation } from "react-i18next";

// import { listingData } from "../../shared/core/mock";

export default function ListingPage() {
  let { id } = useParams();
  const { t } = useTranslation();

  const {
    data: listingData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["listing", Number(id)],
    queryFn: () => getListing(Number(id)),
  });

  if (isLoading) {
    return <ListingPageSkeleton />;
  }

  if (isError || !listingData?.listing) {
    return <ErrorScreen text={t("errors.listing.loading")} />;
  }

  return (
    <div className={styles.page_listing}>
      <ImageGallery listing={listingData.listing} />
      <ListingDetails
        listing={listingData.listing}
        isInWishlist={listingData.is_in_wishlist}
      />
    </div>
  );
}
