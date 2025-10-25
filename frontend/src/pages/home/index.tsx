// import { useQuery } from "@tanstack/react-query";
// import { getListings } from "../../api";
import type { Listing } from "../../shared/types";
import { Button } from "../../shared/ui/button";
import ListingComponent from "./ui/listing";
import { useAuth } from "../../shared/core/auth";
import { useState } from "react";
import CreateListingForm from "./ui/create-listing-form";

export default function Home() {
  // const { data: listings } = useQuery({
  //   queryKey: ["listings"],
  //   queryFn: getListings,
  // });

  // console.log(listings);

  const { data: authData } = useAuth();
  const isAuthenticated = !!authData?.user;
  const [isCreating, setIsCreating] = useState(false);

  let listings: Listing[] = [
    {
      id: 1,
      created_at: "2025-10-24T18:44:51.74984Z",
      updated_at: "2025-10-24T18:44:52.3198Z",
      deleted_at: null,
      user_id: 1,
      title: "MacBook Pro M2",
      description: "Used for 3 months",
      image_urls: [
        "/images/macbook.webp",
        "/images/hoodie.webp",
        "/images/macbook.webp",
      ],
      price: 1200,
      is_closed: false,
    },
    {
      id: 2,
      created_at: "2025-10-24T18:53:53.819019Z",
      updated_at: "2025-10-24T18:53:54.473029Z",
      deleted_at: null,
      user_id: 1,
      title: "The best hoodie in this world (just trust me bro)",
      description: "i can't believe you are reading this",
      image_urls: ["/images/hoodie.webp"],
      price: 100,
      is_closed: false,
    },
    {
      id: 3,
      created_at: "2025-10-24T18:53:53.819019Z",
      updated_at: "2025-10-24T18:53:54.473029Z",
      deleted_at: null,
      user_id: 1,
      title: "The best hoodie in this world (just trust me bro)",
      description: "i can't believe you are reading this",
      image_urls: ["/images/hoodie.webp"],
      price: 100,
      is_closed: true,
    },
    {
      id: 4,
      created_at: "2025-10-24T18:44:51.74984Z",
      updated_at: "2025-10-24T18:44:52.3198Z",
      deleted_at: null,
      user_id: 1,
      title: "MacBook Pro M2",
      description: "Used for 3 months",
      image_urls: [
        "/images/macbook.webp",
        "/images/hoodie.webp",
        "/images/macbook.webp",
      ],
      price: 1200,
      is_closed: true,
    },
    {
      id: 5,
      created_at: "2025-10-24T18:53:53.819019Z",
      updated_at: "2025-10-24T18:53:54.473029Z",
      deleted_at: null,
      user_id: 1,
      title: "The best hoodie in this world (just trust me bro)",
      description: "i can't believe you are reading this",
      image_urls: ["/images/hoodie.webp"],
      price: 100,
      is_closed: false,
    },
    {
      id: 6,
      created_at: "2025-10-24T18:44:51.74984Z",
      updated_at: "2025-10-24T18:44:52.3198Z",
      deleted_at: null,
      user_id: 1,
      title: "MacBook Pro M2",
      description: "Used for 3 months",
      image_urls: [
        "/images/macbook.webp",
        "/images/hoodie.webp",
        "/images/macbook.webp",
      ],
      price: 1200,
      is_closed: true,
    },
  ];

  const handleCreateListing = () => {
    setIsCreating(true);
  };

  return (
    <section className="max-w-11/12 md:max-w-10/12 w-full flex flex-col gap-10 py-5">
      <div className="flex justify-between">
        <h1 className="text-5xl font-normal font-nice italic">
          Recent Listings
        </h1>
        {isAuthenticated && (
          <Button variant="secondary" onClick={handleCreateListing}>
            Create listing
          </Button>
        )}
      </div>
      {isCreating && <CreateListingForm setIsCreating={setIsCreating} />}

      <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-5 items-center justify-between">
        {listings?.map((listing: Listing) => (
          <ListingComponent key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  );
}
