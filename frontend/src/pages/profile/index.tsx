import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../shared/core/auth";

import MainInfo from "./ui/main-info";
import DetailsInfo from "./ui/details-info";
import ProfileEditing from "./ui/profile-editing";
import ProfileSkeleton from "./skeleton";
import ErrorScreen from "../../shared/ui/error-screen";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import CreateListingForm from "../search/ui/create-listing-form";
import { Button } from "../../shared/ui/button";
import EmptyData from "../../shared/ui/empty-data";
import type { ListingData } from "../../shared/types";
import ListingCard from "../../shared/ui/listing-card";
import LangToggle from "../../shared/ui/lang-toggle";
import ModeToggle from "../../shared/ui/mode-toggle";
import { Card } from "../../shared/ui/card";

export default function Profile() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const { data: authData, isLoading, isError } = useAuth();
  const { t } = useTranslation();
  const user = authData?.user;
  const listings = authData?.listings;

  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollToBottom) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  }, [location.state]);

  const inputRefs = useRef<{
    name: HTMLInputElement | null;
    phone: HTMLInputElement | null;
    university: HTMLInputElement | null;
    telegram_link: HTMLInputElement | null;
    bio: HTMLTextAreaElement | null;
  }>({
    name: null,
    phone: null,
    university: null,
    telegram_link: null,
    bio: null,
  });

  const [isCreating, setIsCreating] = useState(false);

  const handleCreateListing = () => {
    setIsCreating(true);
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError || !user) {
    return <ErrorScreen text={t("errors.profile.loading")} />;
  }

  return (
    <div className="max-w-11/12 md:max-w-10/12 flex flex-col gap-10 w-full py-5">
      <h1 className="page-title">{t("profile.title")}</h1>
      <MainInfo
        setIsEditing={setIsEditing}
        queryClient={queryClient}
        user={user}
      />

      <div className="block md:hidden">
        <Card className="p-5 justify-between">
          <div className="flex gap-3 items-center">
            <span>Язык: </span>
            <LangToggle />
          </div>
          <div className="flex gap-3 items-center">
            <span>Тема: </span>
            <ModeToggle />
          </div>
        </Card>
      </div>

      {!isEditing ? (
        <DetailsInfo
          user={user}
          listingData={listings}
          inputRefs={inputRefs}
          setIsEditing={setIsEditing}
        />
      ) : (
        <>
          <h1 className="text-3xl">{t("profile.completeTitle")}</h1>
          <ProfileEditing
            user={user}
            setIsEditing={setIsEditing}
            inputRefs={inputRefs}
            queryClient={queryClient}
          />
        </>
      )}

      {isCreating && <CreateListingForm setIsCreating={setIsCreating} />}

      <Button
        variant="primary"
        className="w-fit h-fit"
        onClick={handleCreateListing}
      >
        {t("buttons.createListing")}
      </Button>

      {listings && (
        <h2 className="font-nice text-4xl italic">{t("listings")}</h2>
      )}

      {listings && listings.length === 0 && (
        <EmptyData text={t("errors.account.listings.absence")} />
      )}
      <div className="cards" id="listings">
        {Array.isArray(listings) &&
          listings.map((listingData: ListingData) => (
            <ListingCard
              key={listingData.listing.id}
              listing={listingData.listing}
              isInWishlist={listingData.is_in_wishlist}
              queryKey={"currentUser"}
            />
          ))}
      </div>
    </div>
  );
}
