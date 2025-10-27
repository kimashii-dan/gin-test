import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getListing } from "./api";

import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import {
  AcademicCapIcon,
  CalendarDaysIcon,
  EnvelopeIcon,
  ShareIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { formatDateTime } from "../../shared/helpers/formatDateTime";
import { Card } from "../../shared/ui/card";
import { formatDate } from "../../shared/helpers/formatDate";
import { Button } from "../../shared/ui/button";
import TelegramLogo from "../../shared/ui/telegram-logo";
import { useNavigate } from "react-router";

export default function ListingPage() {
  let { id } = useParams();

  const {
    data: listing,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["listings"],
    queryFn: () => getListing(Number(id)),
  });

  function handleAddToWishList(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    event.stopPropagation();
    event.preventDefault();
    console.log("add to cart");
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // const listing = {
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
  //     "/images/macbook.webp",
  //     "/images/hoodie.webp",
  //     "/images/react-logo.webp",
  //   ],
  //   price: 1200,
  //   is_closed: false,
  //   user: {
  //     id: 1,
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
  //     listing: null,
  //   },
  // };

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

  function handleContact() {
    if (!listing) {
      return;
    }

    if (listing.user?.telegram_link) {
      navigate(listing.user.telegram_link);
    } else {
      const mailto = `mailto:${listing.user?.email}`;
      window.location.href = mailto;
    }
  }

  function handleShare() {
    console.log("share");
  }

  return (
    <div className="max-w-11/12 base:max-w-10/12 w-full flex flex-col base:flex-row gap-10 py-5">
      <div className="base:w-[45%] w-full flex flex-col gap-5 h-fit base:sticky base:top-30">
        <div className="relative w-full aspect-square overflow-hidden rounded-xl">
          <img
            src={
              listing.image_urls && listing.image_urls.length > 0
                ? listing.image_urls[currentIndex]
                : "/images/hoodie.webp"
            }
            className="w-full h-full object-cover"
            alt={`${listing.title} image 1`}
          />
          <div className="absolute top-1/2 left-1">
            <button
              onClick={() =>
                setCurrentIndex((prev) => {
                  if (currentIndex === 0) {
                    return listing.image_urls.length - 1;
                  }

                  return prev - 1;
                })
              }
            >
              <ArrowLeftIcon className="size-8 text-foreground bg-black/60 rounded-full p-1" />
            </button>
          </div>
          <div className="absolute top-1/2 right-1">
            <button
              onClick={() => {
                setCurrentIndex((prev) => {
                  if (currentIndex === listing.image_urls.length - 1) {
                    return 0;
                  }

                  return prev + 1;
                });
              }}
            >
              <ArrowRightIcon className="size-8 text-foreground bg-black/60 rounded-full p-1" />
            </button>
          </div>
        </div>

        <div className="flex w-full md:gap-3 gap-2">
          {listing.image_urls &&
            listing.image_urls.map((url, index) => (
              <div
                key={index}
                className={`relative flex-1 aspect-square overflow-hidden rounded-lg cursor-pointer ${
                  index === currentIndex ? "" : ""
                }`}
                onClick={() => setCurrentIndex(index)}
              >
                <img
                  src={url}
                  alt={`${listing.title} ${index}`}
                  className={`w-full h-full object-cover ${
                    index === currentIndex ? "" : "brightness-50"
                  } `}
                />
              </div>
            ))}
        </div>
      </div>
      <Card className="base:w-[45%] w-full flex flex-col break-all p-8 flex-1">
        <div className="flex flex-col gap-8">
          <h1 className="text-4xl font-nice italic font-medium">
            {listing.title}
          </h1>

          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-semibold text-highlight">
              ${listing.price}
            </h2>

            <div className="flex justify-between">
              <div
                className={`shadow-base w-fit px-2 py-0.5 text-sm font-semibold rounded-full ${
                  listing.is_closed
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-accent text-accent-foreground"
                }`}
              >
                {listing.is_closed ? "Sold" : "Available"}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-lg font-medium">Description</p>
            <p className="text-base font-normal text-muted-foreground">
              {listing.description}
            </p>
          </div>

          <hr />

          <div className="flex items-center w-fit gap-5">
            <div className="w-15 h-15 relative aspect-square  ">
              {listing.user?.avatar_url ? (
                <img
                  className="w-full h-full rounded-full object-cover"
                  src={listing.user.avatar_url}
                  alt=""
                />
              ) : (
                <div className="rounded-full shadow-sm w-full h-full bg-background text-foreground text-xl font-bold flex justify-center items-center">
                  {listing.user?.email[0].toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex flex-col justify-between">
              <p className="text-lg font-medium">{listing.user?.email}</p>
              <p className="text-base font-normal text-muted-foreground">
                Member since {formatDate(listing.user?.created_at)}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {listing.user?.telegram_link ? (
              <Button
                variant="secondary"
                className="flex items-center justify-center gap-2"
                onClick={handleContact}
              >
                <TelegramLogo width={30} height={30} />
                <p className="font-semibold text-lg">Contact via Telegram</p>
              </Button>
            ) : (
              <Button
                variant="secondary"
                className="flex items-center justify-center gap-2"
                onClick={handleContact}
              >
                <EnvelopeIcon className="size-5" />
                <p className="font-semibold text-lg">Contact via Email</p>
              </Button>
            )}

            <div className="flex flex-col base:flex-row base:items-center gap-5">
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2 flex-1"
                onClick={handleAddToWishList}
              >
                <StarIcon className="size-5 text-yellow-500" />
                <p className="font-semibold text-lg">Add to Wishlist</p>
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2 flex-1"
                onClick={handleShare}
              >
                <ShareIcon className="size-5 text-primary" />
                <p className="font-semibold text-lg">Share</p>
              </Button>
            </div>
          </div>

          <hr />
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-5">
            <div className="flex items-center w-fit gap-5">
              <AcademicCapIcon className="size-8 text-muted-foreground" />
              <div className="flex flex-col">
                <p className="text-base font-normal text-muted-foreground">
                  University
                </p>
                <p className="text-base font-medium">
                  {listing.user?.university === ""
                    ? "Unknown"
                    : listing.user?.university}
                </p>
              </div>
            </div>

            <div className="flex items-center w-fit gap-5">
              <CalendarDaysIcon className="size-8 text-muted-foreground" />
              <div className="flex flex-col">
                <p className="text-base font-normal text-muted-foreground">
                  Posted
                </p>
                <p className="text-base font-medium">
                  {formatDateTime(listing.created_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
