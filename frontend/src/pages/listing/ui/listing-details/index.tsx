import {
  EnvelopeIcon,
  StarIcon,
  ShareIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  TrashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { formatDate } from "../../../../shared/helpers/formatDate";
import { formatDateTime } from "../../../../shared/helpers/formatDateTime";
import type { Listing } from "../../../../shared/types";
import { Button } from "../../../../shared/ui/button";
import { Card } from "../../../../shared/ui/card";
import TelegramLogo from "../../../../shared/ui/telegram-logo";
import { useNavigate } from "react-router";
// import { useAuth } from "../../../../shared/core/auth";
import { useState } from "react";
import UpdateListingForm from "../updating-listing";
import DeletingAlert from "../deleting-alert";

export default function ListingDetails({ listing }: { listing: Listing }) {
  const navigate = useNavigate();
  // const { data } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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

  function handleAddToWishList() {
    console.log("add to wishlist");
  }

  function handleUpdate() {
    setIsUpdating(true);
  }

  function handleDelete() {
    setIsDeleting(true);
  }

  return (
    <div className="base:w-[45%] w-full flex flex-col break-all gap-5">
      {/* {listing.user === data?.user && (
        <div className="flex gap-5 items-center">
          <Button
            className="flex-1 font-semibold flex justify-center items-center gap-1"
            variant="primary"
            onClick={handleUpdateListing}
          >
            <ArrowPathIcon className="size-5" />
            <span>Update</span>
          </Button>
          <Button
            className="flex-1 font-semibold flex justify-center gap-1 items-center"
            variant="danger"
          >
            <TrashIcon className="size-5" />
            <span>Delete</span>
          </Button>
        </div>
      )} */}

      <div className="flex gap-5 items-center">
        <Button
          className="flex-1 font-semibold flex justify-center items-center gap-1"
          variant="primary"
          onClick={handleUpdate}
        >
          <ArrowPathIcon className="size-5" />
          <span>Update</span>
        </Button>
        <Button
          className="flex-1 font-semibold flex justify-center gap-1 items-center"
          variant="danger"
          onClick={handleDelete}
        >
          <TrashIcon className="size-5" />
          <span>Delete</span>
        </Button>
      </div>

      {isUpdating && (
        <UpdateListingForm setIsUpdating={setIsUpdating} listing={listing} />
      )}

      {isDeleting && (
        <DeletingAlert setIsDeleting={setIsDeleting} id={listing.id} />
      )}

      <Card className="p-8 w-full">
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
                className={`shadow-base w-fit px-2 py-1 text-sm font-semibold rounded-full ${
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
