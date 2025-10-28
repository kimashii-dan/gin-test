import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getListing } from "./api";

import ImageGallery from "./ui/image-gallery";
// import type { Listing } from "../../shared/types";
import ListingDetails from "./ui/listing-details";
export default function ListingPage() {
  let { id } = useParams();

  const {
    data: listing,
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

  if (isError || !listing) {
    return (
      <div className="max-w-11/12 md:max-w-10/12 flex flex-col gap-10 w-full">
        <h1 className="text-5xl font-semibold text-red-500">
          Error loading listing
        </h1>
      </div>
    );
  }

  // const listing: Listing = {
  //   id: 7,
  //   created_at: "2025-10-24T18:44:51.74984Z",
  //   updated_at: "2025-10-24T18:44:52.3198Z",
  //   deleted_at: null,
  //   user_id: 1,
  //   title: "MacBook Pro M2",
  //   description:
  //     "Used M2 MacBook Pro 13-inch (Late 2022) – Excellent Condition! It features the M2 chip with an upgraded 16GB Unified Memory and a fast 512GB SSD. The condition is flawless; there are no visible scratches or dents on the casing or display. The battery health is 98%, with a very low cycle count (currently 35). Comes complete with the original 67W USB-C Power Adapter, charging cable, and the retail box. Price is firm at $1200. Local pickup or secure shipping available.",
  //   image_urls: [
  //     "/images/macbook.webp",
  //     "/images/hoodie.webp",
  //     "/images/react-logo.webp",
  //   ],
  //   price: 1200,
  //   is_closed: false,
  //   user: {
  //     created_at: "2025-10-24T18:44:36.309077Z",
  //     updated_at: "2025-10-26T19:13:10.891468Z",
  //     deleted_at: null,
  //     email: "daniyarmunsyzbaev@gmail.com",
  //     name: "Daniyar",
  //     university: "KBTU",
  //     phone: "",
  //     telegram_link: "",
  //     bio: "",
  //     avatar_url: "",
  //   },
  // };

  return (
    <div className="max-w-11/12 base:max-w-10/12 w-full flex flex-col base:flex-row gap-10 py-5">
      <ImageGallery listing={listing} />
      <ListingDetails listing={listing} />
    </div>
  );
}
