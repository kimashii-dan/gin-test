import { useQuery } from "@tanstack/react-query";
import { getListings } from "./api";

import type { ListingData } from "../../shared/types";
import { Button } from "../../shared/ui/button";
import ListingComponent from "./ui/listing";
import { useAuth } from "../../shared/core/auth";
import { useState } from "react";
import CreateListingForm from "./ui/create-listing-form";
import SelectListingType from "./ui/select-listing-type";
// import { filteredListings } from "../../shared/core/mock";

export default function Home() {
  const { data: listingsData } = useQuery({
    queryKey: ["listings"],
    queryFn: getListings,
  });

  const { data: authData } = useAuth();
  const isAuthenticated = !!authData?.user;

  const [isCreating, setIsCreating] = useState(false);
  const [listingType, setListingType] = useState("All");
  const [isOpen, setIsOpen] = useState(false);

  const handleCreateListing = () => {
    setIsCreating(true);
  };

  const options = ["All", "Mine"];

  const filteredListings =
    Array.isArray(listingsData) && listingsData
      ? listingsData.filter((listingData: ListingData) => {
          if (listingType === "All") {
            return true;
          }
          if (listingType === "Mine") {
            return listingData.listing.user_id === authData?.user?.id;
          }

          return true;
        })
      : [];

  return (
    <section className="max-w-11/12 md:max-w-10/12 w-full flex flex-col gap-10 py-5">
      <div className="flex justify-between items-end gap-5">
        <div className="flex flex-col lg:flex-row lg:items-end gap-5">
          <h1 className="text-5xl font-normal font-nice italic">
            Recent Listings
          </h1>
          {isAuthenticated && (
            <SelectListingType
              options={options}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              listingType={listingType}
              setListingType={setListingType}
            />
          )}
        </div>
        {isAuthenticated && (
          <Button
            variant="secondary"
            className="w-48 h-fit"
            onClick={handleCreateListing}
          >
            Create listing
          </Button>
        )}
      </div>
      {isCreating && <CreateListingForm setIsCreating={setIsCreating} />}

      <div className="grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-5 justify-start">
        {filteredListings.map((listingData: ListingData) => (
          <ListingComponent
            key={listingData.listing.id}
            listing={listingData.listing}
            isInWishlist={listingData.is_in_wishlist}
          />
        ))}
      </div>
    </section>
  );
}
