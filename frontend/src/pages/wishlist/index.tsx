import { useQuery } from "@tanstack/react-query";
import { getWishlist } from "./api";
import ListingComponent from "../home/ui/listing";
import type { Listing } from "../../shared/types";

export default function WishlistPage() {
  const { data: listings } = useQuery({
    queryKey: ["listing"],
    queryFn: getWishlist,
  });

  return (
    <section className="max-w-11/12 md:max-w-10/12 w-full flex flex-col gap-10 py-5">
      <h1 className="text-5xl font-normal font-nice italic">Wishlist</h1>

      <div className="grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-5 items-center justify-between">
        {listings &&
          Array.isArray(listings) &&
          listings.map((listing: Listing) => (
            <ListingComponent
              key={listing.id}
              listing={listing}
              isInWishlist={true}
            />
          ))}
      </div>
    </section>
  );
}
