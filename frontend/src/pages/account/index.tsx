import { useQuery } from "@tanstack/react-query";
import { getUser } from "./api";
import { useNavigate, useParams } from "react-router";
import { Card } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { formatDate } from "../../shared/helpers/formatDate";
import TelegramLogo from "../../shared/ui/telegram-logo";
import {
  AcademicCapIcon,
  EnvelopeIcon,
  PaperAirplaneIcon,
  PhoneIcon,
  StarIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import type { Listing } from "../../shared/types";
import ListingComponent from "../home/ui/listing";

export default function AccountPage() {
  const { id } = useParams();
  const { data: user } = useQuery({
    queryKey: ["listings"],
    queryFn: () => getUser(Number(id)),
  });

  const navigate = useNavigate();

  function handleContact() {
    if (!user) {
      return;
    }

    if (user.telegram_link) {
      navigate(user.telegram_link);
    } else {
      const mailto = `mailto:${user?.email}`;
      window.location.href = mailto;
    }
  }

  return (
    <div className="max-w-11/12 md:max-w-10/12 flex flex-col gap-10 w-full py-5">
      <h1 className="text-5xl font-normal font-nice italic">Profile</h1>
      <div className="flex flex-col justify-center gap-5 lg:flex-row">
        <Card className="items-center flex-wrap lg:flex-col justify-center lg:w-fit w-full gap-8 relative p-5 lg:p-10">
          <div className="w-30 h-30 relative">
            {user?.avatar_url ? (
              <img
                className="w-full h-full rounded-full object-cover shadow-sm"
                src={user.avatar_url}
                alt=""
              />
            ) : (
              <div className="shadow-sm rounded-full w-full h-full bg-background text-foreground text-5xl font-bold flex justify-center items-center">
                <>{user?.email?.[0].toUpperCase()}</>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center gap-2">
            <p className="text-2xl font-semibold text-center">{user?.name}</p>
            <p className="text-muted-foreground">
              Member since {formatDate(user?.created_at)}
            </p>
          </div>
          <div className="flex flex-row md:flex-col gap-5 justify-center">
            {user?.telegram_link ? (
              <Button
                variant="secondary"
                className="flex items-center justify-center gap-2"
                onClick={handleContact}
              >
                <TelegramLogo width={30} height={30} />
                <p className="font-semibold text-base">Contact via Telegram</p>
              </Button>
            ) : (
              <Button
                variant="secondary"
                className="flex items-center justify-center gap-2"
                onClick={handleContact}
              >
                <EnvelopeIcon className="size-5" />
                <p className="font-medium text-base">Contact via Email</p>
              </Button>
            )}
            <Button
              className="flex gap-2 items-center justify-center font-medium"
              onClick={() => console.log("bro")}
              variant="secondary"
            >
              <StarIcon className="size-5 text-yellow-500" />
              <p className="font-medium text-base">Rate {user?.name}</p>
            </Button>
          </div>
        </Card>
        <div className="flex flex-col flex-1 gap-5 break-all">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1">
            <Card className="p-8 h-full flex flex-col gap-5 justify-center">
              <div className="flex flex-col gap-2 items-start">
                <h3 className="font-medium text-lg flex gap-2 items-center">
                  <EnvelopeIcon className="size-5" />
                  <span>Email</span>
                </h3>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </Card>

            <Card className="p-8 h-full flex flex-col gap-5 justify-center">
              <div className="flex flex-col gap-2 items-start">
                <h3 className="font-medium text-lg flex gap-2 items-center">
                  <PhoneIcon className="size-5" />
                  <span>Phone</span>
                </h3>
                <p className="text-muted-foreground">
                  {user?.phone || "Unknown"}
                </p>
              </div>
            </Card>

            <Card className="p-8 h-full flex flex-col gap-5 justify-center">
              <div className="flex flex-col gap-2 items-start">
                <h3 className="font-medium text-lg flex gap-2 items-center">
                  <AcademicCapIcon className="size-5" />
                  <span>University</span>
                </h3>
                <p className="text-muted-foreground">
                  {user?.university || "Unknown"}
                </p>
              </div>
            </Card>

            <Card className="p-8 h-full flex flex-col gap-5 justify-center">
              <div className="flex flex-col gap-2 items-start">
                <h3 className="font-medium text-lg flex gap-2 items-center">
                  <PaperAirplaneIcon className="size-5 -rotate-40" />
                  <span>Telegram</span>
                </h3>
                <p className="text-muted-foreground">
                  {user?.telegram_link || "Unknown"}
                </p>
              </div>
            </Card>
          </div>

          <Card className="p-8 flex-col gap-5">
            <div className="flex flex-col gap-2 items-start justify-center">
              <h3 className="font-medium text-lg flex gap-2 items-center">
                <UserIcon className="size-5" />
                <span>Bio</span>
              </h3>
              <p className="text-muted-foreground">{user?.bio || "Unknown"}</p>
            </div>
          </Card>
        </div>
      </div>
      <h2 className="font-nice text-4xl italic">Listings</h2>

      <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-5 items-center justify-between">
        {user?.listing &&
          Array.isArray(user?.listing) &&
          user.listing.map((listing: Listing) => (
            <ListingComponent key={listing.id} listing={listing} />
          ))}
      </div>
    </div>
  );
}
