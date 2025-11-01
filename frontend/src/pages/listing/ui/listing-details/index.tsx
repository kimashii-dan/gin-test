import {
  EnvelopeIcon,
  ShareIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  TrashIcon,
  ArrowPathIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { formatDate } from "../../../../shared/helpers/formatDate";
import { formatDateTime } from "../../../../shared/helpers/formatDateTime";
import type { Listing, ServerError } from "../../../../shared/types";
import { Button } from "../../../../shared/ui/button";
import { Card } from "../../../../shared/ui/card";
import TelegramLogo from "../../../../shared/ui/telegram-logo";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../../../shared/core/auth";
import { useState } from "react";
import UpdateListingForm from "../updating-listing";
import DeletingAlert from "../deleting-alert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToWishlist, updateListing } from "../../api";

export default function ListingDetails({
  listing,
  isInWishlist,
}: {
  listing: Listing;
  isInWishlist: boolean;
}) {
  const navigate = useNavigate();
  const { data: authData } = useAuth();
  const isAuthenticated = !!authData?.user;
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: updateListing,
    onSuccess: (data) => {
      console.log(data);
      setIsUpdating(false);
      queryClient.invalidateQueries({ queryKey: ["listing"] });
    },
    onError: (error: ServerError) => {
      console.log(error.response.data.error);
    },
  });

  const likeMutation = useMutation({
    mutationFn: addToWishlist,
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["listing"] });
    },
    onError: (error: ServerError) => {
      console.log(error.response.data.error);
    },
  });

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

  function handleUpdate() {
    setIsUpdating(true);
  }

  function handleDelete() {
    setIsDeleting(true);
  }

  function handleToggleStatus() {
    if (updateMutation.isPending) return;
    const formData = new FormData();
    formData.append("is_closed", String(!listing.is_closed));
    const id = listing.id;
    updateMutation.mutate({ id, formData });
  }

  function handleAddToWishList() {
    if (likeMutation.isPending) return;
    const id = listing.id;
    likeMutation.mutate(id);
  }

  return (
    <div className="base:w-[45%] w-full flex flex-col break-all gap-5">
      {listing.user?.id === authData?.user.id && (
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
      )}

      {isUpdating && (
        <UpdateListingForm setIsUpdating={setIsUpdating} listing={listing} />
      )}

      {isDeleting && (
        <DeletingAlert setIsDeleting={setIsDeleting} id={listing.id} />
      )}

      <Card className="p-8 flex-col">
        <div className="flex flex-col gap-8">
          <h1 className="text-4xl font-nice italic font-medium">
            {listing.title}
          </h1>
          <h2 className="text-3xl font-semibold text-highlight">
            ${listing.price}
          </h2>
          <div className="flex justify-between items-center">
            {listing.user?.id === authData?.user.id ? (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-medium ${
                      listing.is_closed
                        ? "text-muted-foreground"
                        : "text-accent"
                    }`}
                  >
                    Available
                  </span>

                  <button
                    onClick={handleToggleStatus}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      listing.is_closed ? "bg-destructive" : "bg-accent"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        listing.is_closed ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>

                  <span
                    className={`text-sm font-medium ${
                      listing.is_closed
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}
                  >
                    Sold
                  </span>
                </div>
              </div>
            ) : (
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
            )}
            {isAuthenticated && (
              <button
                onClick={handleAddToWishList}
                className="flex items-center gap-2"
              >
                <HeartIcon
                  fill={`${isInWishlist ? "red" : "none"}`}
                  className="size-7 text-destructive"
                />
                <span>Like</span>
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xl font-medium">Description</p>
            <p className="text-base font-normal text-muted-foreground">
              {listing.description}
            </p>
          </div>

          <hr />

          <Link
            to={`/users/${listing.user?.id}`}
            className="flex items-center w-fit gap-5"
          >
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
          </Link>

          <div className="flex flex-col md:flex-row gap-5">
            {listing.user?.telegram_link ? (
              <Button
                variant="primary"
                className="flex items-center justify-center gap-2 flex-1"
                onClick={handleContact}
              >
                <TelegramLogo width={25} height={25} />
                <p className="font-semibold text-base">Contact via Telegram</p>
              </Button>
            ) : (
              <Button
                variant="primary"
                className="flex items-center justify-center gap-2 flex-1"
                onClick={handleContact}
              >
                <EnvelopeIcon className="size-5" />
                <p className="font-semibold text-base">Contact via Email</p>
              </Button>
            )}

            <Button
              variant="secondary"
              className="flex items-center justify-center gap-2 flex-1"
              onClick={handleShare}
            >
              <ShareIcon className="size-5 text-primary" />
              <p className="font-semibold text-base">Share</p>
            </Button>
          </div>

          <hr />
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-5">
            <div className="flex items-center w-fit gap-2">
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

            <div className="flex items-center w-fit gap-2">
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
