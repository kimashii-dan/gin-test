import { ClockIcon } from "@heroicons/react/24/outline";

import { Link } from "react-router";
import type { Listing } from "../../../../shared/types";
import { Button } from "../../../../shared/ui/button";
import { Card } from "../../../../shared/ui/card";

export default function ListingComponent({ listing }: { listing: Listing }) {
  function timeAgo(dateString: string) {
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400)
      return `${Math.floor(diff / 3600)} hour${
        Math.floor(diff / 3600) > 1 ? "s" : ""
      } ago`;
    if (diff < 2592000)
      return `${Math.floor(diff / 86400)} day${
        Math.floor(diff / 86400) > 1 ? "s" : ""
      } ago`;
    return date.toLocaleDateString();
  }

  function handleAddToCard(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    event.stopPropagation();
    event.preventDefault();
    console.log("add to cart");
  }

  return (
    <Link to={`/listings/${listing.id}`}>
      <Card className="max-w-[300px] mx-auto w-full h-full flex flex-col justify-between gap-5 p-5 hover:-translate-y-1 hover:shadow-base">
        <div className="relative w-full aspect-square overflow-hidden rounded-xl group">
          <img
            src={
              listing.image_urls && listing.image_urls.length > 0
                ? listing.image_urls[0]
                : "/images/placeholder.webp"
            }
            className="w-full h-full object-cover"
            alt={`${listing.title} image 1`}
          />

          <span
            className={`absolute shadow-sm top-2 left-2 px-2 py-0.5 text-sm font-semibold rounded-full ${
              listing.is_closed
                ? "bg-destructive text-destructive-foreground"
                : "bg-accent text-accent-foreground"
            }`}
          >
            {listing.is_closed ? "Sold" : "Available"}
          </span>

          <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            <div className="flex items-center gap-1">
              <ClockIcon className="size-4" />
              <span>{timeAgo(listing.created_at)}</span>
            </div>
          </span>
        </div>

        <div className="w-full flex flex-col gap-5">
          <div className="">
            <h1 className="text-xl font-medium truncate">{listing.title}</h1>
            <p className="text-sm text-muted-foreground">
              {listing.description}
            </p>
          </div>

          <div className="w-full flex justify-between">
            <h2 className="text-2xl font-semibold text-highlight">
              ${listing.price}
            </h2>
            <Button
              className="shadow-lg"
              variant="secondary"
              onClick={(e) => handleAddToCard(e)}
            >
              Add to cart
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
