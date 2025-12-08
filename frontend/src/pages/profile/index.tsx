import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../shared/core/auth";

import MainInfo from "./ui/main-info";
import DetailsInfo from "./ui/details-info";
import ProfileEditing from "./ui/profile-editing";
import ProfileSkeleton from "./skeleton";
import ErrorScreen from "../../shared/ui/error-screen";
import { useTranslation } from "react-i18next";

export default function Profile() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const { data: authData, isLoading, isError } = useAuth();
  const { t } = useTranslation();
  const user = authData?.user;

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

      {!isEditing ? (
        <DetailsInfo
          user={user}
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
    </div>
  );
}
