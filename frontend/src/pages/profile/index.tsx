import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../shared/core/auth";

import MainInfo from "./ui/main-info";
import DetailsInfo from "./ui/details-info";
import ProfileEditing from "./ui/profile-editing";

export default function Profile() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const { data: authData, isLoading, isError } = useAuth();
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
    return (
      <div className="max-w-11/12 md:max-w-9/12 flex flex-col gap-10 w-full">
        <div className="animate-pulse">
          <div className="h-12 bg-card rounded mb-4"></div>
          <div className="h-40 bg-card rounded"></div>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="max-w-11/12 md:max-w-9/12 flex flex-col gap-10 w-full">
        <h1 className="text-5xl font-semibold text-red-500">
          Error loading profile
        </h1>
      </div>
    );
  }

  return (
    <div className="max-w-11/12 md:max-w-9/12 flex flex-col gap-10 w-full">
      <h1 className="text-5xl font-semibold">Account</h1>
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
          <h1 className="text-3xl">Complete Profile</h1>
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
