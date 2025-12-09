import {
  EnvelopeIcon,
  ShareIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  TrashIcon,
  ArrowPathIcon,
  HeartIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { formatDate } from "../../../../shared/helpers/formatDate";
import { formatDateTime } from "../../../../shared/helpers/formatDateTime";
import type { Listing, ServerError } from "../../../../shared/types";
import { Button } from "../../../../shared/ui/button";
import { Card } from "../../../../shared/ui/card";
import TelegramLogo from "../../../../shared/ui/telegram-logo";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../../../shared/core/auth";
import { useRef, useState } from "react";
import UpdateListingForm from "../updating-listing";
import DeletingAlert from "../deleting-alert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToWishlist, createAIPriceReport, updateListing } from "../../api";
import styles from "../../styles.module.css";
import { LightBulbIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";
import { listingData } from "../../../../shared/core/mock";

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
  const { i18n, t } = useTranslation();
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: updateListing,
    onSuccess: (data) => {
      console.log(data);
      setIsUpdating(false);
      queryClient.invalidateQueries({ queryKey: ["listing", listing.id] });
    },
    onError: (error: ServerError) => {
      console.log(error.response.data.error);
    },
  });

  const likeMutation = useMutation({
    mutationFn: addToWishlist,
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["listing", listing.id] });
    },
    onError: (error: ServerError) => {
      console.log(error.response.data.error);
    },
  });

  const aiMutation = useMutation({
    mutationFn: createAIPriceReport,
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["listing", listing.id] });
    },
    onError: (error: ServerError) => {
      console.log(error.response.data.error);
    },
  });

  const targetRef = useRef<HTMLDivElement | null>(null);

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

  const map = new Map<string, string>([
    ["low", "bg-gray-300"],
    ["medium", "bg-orange-400"],
    ["high", "bg-green-400"],
  ]);

  function askAI() {
    const formData = new FormData();
    formData.append("title", listing.title);
    formData.append("description", listing.description ?? "");
    formData.append("lang", i18n.language);
    listing.image_urls.forEach((imageURL) => {
      formData.append("image_urls[]", imageURL);
    });
    const id = listing.id;
    aiMutation.mutate({ id, formData });
    targetRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className={styles.listing_details}>
      {listing.user?.id === authData?.user.id && (
        <div className="flex gap-5 items-center">
          <Button
            className="flex-1 flex justify-center gap-1 items-center font-medium"
            variant="secondary"
            onClick={handleUpdate}
          >
            <ArrowPathIcon className="size-5" />
            <span>{t("listingDetails.buttons.update")}</span>
          </Button>
          <Button
            className="flex-1 flex justify-center gap-1 items-center font-medium"
            variant="danger"
            onClick={handleDelete}
          >
            <TrashIcon className="size-5" />
            <span>{t("listingDetails.buttons.delete")}</span>
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
          <div className="flex flex-col gap-3">
            <h1 className={styles.listing_title}>{listing.title}</h1>
            {listing.category && (
              <span className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full w-fit">
                {t(
                  `listingForm.category.categories.${listing.category.toLowerCase()}`
                )}
              </span>
            )}
          </div>

          <div className="flex flex-wrap justify-between gap-3 items-center">
            <div className="flex items-baseline gap-2">
              <p className="text-4xl text-highlight font-semibold">
                {listing.price}
              </p>
              <p className="text-xl text-muted-foreground font-medium">USD</p>
            </div>
            {isAuthenticated &&
              authData.user.id !== listingData.listing.user_id && (
                <button
                  onClick={handleAddToWishList}
                  className="flex items-center gap-2"
                >
                  <HeartIcon
                    fill={`${isInWishlist ? "red" : "none"}`}
                    className="size-7 text-destructive"
                  />
                  <span>{t("listingDetails.like")}</span>
                </button>
              )}
          </div>

          <div className="flex justify-between flex-col gap-5 items-center sm:items-start">
            {!listing.ai_price_report &&
              listing.user_id === authData?.user.id && (
                <Button
                  onClick={askAI}
                  type="button"
                  className="flex gap-2 items-center w-fit"
                  disabled={!!listing.ai_price_report || aiMutation.isPending}
                >
                  <SparklesIcon className="size-6 text-yellow-300" />
                  <span className="text-sm md:text-base">
                    {aiMutation.isPending
                      ? t("listingForm.buttons.aiSuggestion.loading")
                      : t("listingForm.buttons.aiSuggestion.name")}
                  </span>
                </Button>
              )}

            {listing.user?.id === authData?.user.id ? (
              <div className="flex items-center gap-2 ">
                <span
                  className={`text-sm font-medium ${
                    listing.is_closed ? "text-muted-foreground" : "text-accent"
                  }`}
                >
                  {t("listingDetails.status.available")}
                </span>

                <button
                  onClick={handleToggleStatus}
                  className={
                    listing.is_closed
                      ? styles.listing_status_switch_sold
                      : styles.listing_status_switch_available
                  }
                >
                  <span
                    className={`${styles.listing_switch_pointer} ${
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
                  {t("listingDetails.status.sold")}
                </span>
              </div>
            ) : (
              <div className="flex justify-between">
                <div
                  className={
                    listing.is_closed
                      ? styles.listing_status_sold
                      : styles.listing_status_available
                  }
                >
                  {listing.is_closed
                    ? t("listingDetails.status.sold")
                    : t("listingDetails.status.available")}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xl font-medium">
              {t("listingDetails.description")}
            </p>
            <p className="font-normal text-muted-foreground">
              {listing.description}
            </p>
          </div>

          <hr className="border border-border" />

          <Link
            to={`/users/${listing.user?.id}`}
            className="flex items-center w-fit gap-5"
          >
            <div className="w-15 h-15 relative aspect-square">
              {listing.user?.avatar_url ? (
                <img
                  className="w-full h-full rounded-full object-cover"
                  src={listing.user.avatar_url}
                  alt=""
                />
              ) : (
                <div className={styles.listing_user_avatar}>
                  {listing.user?.email[0].toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between">
              <p className="text-lg font-medium">{listing.user?.email}</p>
              <p className="text-base font-normal text-muted-foreground">
                {t("listingDetails.owner.memberSince")}{" "}
                {formatDate(listing.user?.created_at)}
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
                <span className="">
                  {t("listingDetails.buttons.contactTelegram")}
                </span>
              </Button>
            ) : (
              <Button
                variant="primary"
                className="flex items-center justify-center gap-2 flex-1"
                onClick={handleContact}
              >
                <EnvelopeIcon className="size-5 text-secondary" />
                <span className="">
                  {t("listingDetails.buttons.contactEmail")}
                </span>
              </Button>
            )}

            <Button
              variant="secondary"
              className="flex items-center justify-center gap-2 flex-1"
              onClick={handleShare}
            >
              <ShareIcon className="size-5 text-primary" />
              <span className="">{t("listingDetails.buttons.share")}</span>
            </Button>
          </div>

          <hr className="border border-border" />

          <div className="flex flex-col md:flex-row justify-between md:items-center gap-5">
            <div className="flex items-center w-fit gap-2">
              <AcademicCapIcon className="size-8 text-muted-foreground" />
              <div className="flex flex-col">
                <p className="font-normal text-muted-foreground">
                  {t("listingDetails.owner.university")}
                </p>
                <p className="font-medium">
                  {listing.user?.university === ""
                    ? t("unknown")
                    : listing.user?.university}
                </p>
              </div>
            </div>

            <div className="flex items-center w-fit gap-2">
              <CalendarDaysIcon className="size-8 text-muted-foreground" />
              <div className="flex flex-col">
                <p className="font-normal text-muted-foreground">
                  {t("listingDetails.posted")}
                </p>
                <p className="font-medium">
                  {formatDateTime(listing.created_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div ref={targetRef}>
        {aiMutation.isPending && (
          <Card className="flex-col overflow-hidden animate-pulse">
            <div className="flex lg:flex-row flex-col p-6 bg-muted justify-between gap-5 lg:items-center">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-muted rounded"></div>
                <div className="h-6 bg-muted rounded w-40"></div>
              </div>
              <div className="h-6 bg-muted rounded-full w-24"></div>
            </div>

            <div className="flex items-baseline gap-3 px-6 py-5">
              <div className="h-12 bg-muted rounded w-32"></div>
              <div className="h-8 bg-muted rounded w-12"></div>
            </div>

            <hr className="border border-border" />
            <div className="space-y-2 px-6 py-5">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </Card>
        )}
      </div>

      {listing.ai_price_report && (
        <Card className="flex-col overflow-hidden">
          <div className="flex lg:flex-row flex-col p-6 bg-muted justify-between gap-5 lg:items-center">
            <div className="flex items-center gap-2">
              <LightBulbIcon className="text-yellow-400 size-7" />
              <h2 className="text-xl text-card-foreground font-semibold capitalize">
                {t("aiReport.title")}
              </h2>
            </div>

            <p
              className={`${map.get(
                listing.ai_price_report.confidence_level
              )} shadow-sm px-3 py-0.5 text-sm w-fit font-semibold rounded-full text-black`}
            >
              {t(
                `aiReport.confidence.${listing.ai_price_report.confidence_level}`
              )}{" "}
              {t("aiReport.confidence.name")}
            </p>
          </div>

          <div className="flex items-baseline gap-2 px-6 py-5">
            <p className="text-4xl text-highlight font-semibold">
              {listing.ai_price_report.suggested_price_min} -{" "}
              {listing.ai_price_report.suggested_price_max}
            </p>
            <p className="text-xl text-muted-foreground font-medium">
              {listing.ai_price_report.currency}
            </p>
          </div>

          <hr className="border border-border" />
          <p className="text-base font-normal px-6 py-5 text-muted-foreground leading-relaxed">
            {listing.ai_price_report.reasoning}
          </p>
        </Card>
      )}
    </div>
  );
}
