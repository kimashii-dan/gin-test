import { useQuery } from "@tanstack/react-query";
import { getListing } from "./api";
import { useParams } from "react-router";

import ImageGallery from "./ui/image-gallery";
import ListingDetails from "./ui/listing-details";
// import { listing } from "../../shared/core/mock";

export default function ListingPage() {
  let { id } = useParams();

  const {
    data: listingData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["listing"],
    queryFn: () => getListing(Number(id)),
  });

  if (isLoading) {
    return (
      <div className="max-w-11/12 md:max-w-10/12 flex flex-col gap-10 w-full">
        <div className="animate-pulse">
          <div className="h-12 bg-card rounded mb-4"></div>
          <div className="h-40 bg-card rounded"></div>
        </div>
      </div>
    );
  }

  if (isError || !listingData?.listing) {
    return (
      <div className="max-w-11/12 md:max-w-10/12 flex flex-col gap-10 w-full">
        <h1 className="text-5xl font-semibold text-red-500">
          Error loading listing
        </h1>
      </div>
    );
  }

  return (
    <div className="max-w-11/12 base:max-w-10/12 w-full flex flex-col base:flex-row gap-10 py-5">
      <ImageGallery listing={listingData.listing} />
      <ListingDetails
        listing={listingData.listing}
        isInWishlist={listingData.is_in_wishlist}
      />
    </div>
  );
}
