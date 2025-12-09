import { Link } from "react-router";
import { Card } from "../../../../shared/ui/card";
import {
  AcademicCapIcon,
  EnvelopeIcon,
  InformationCircleIcon,
  LinkIcon,
  PencilIcon,
  PhoneIcon,
  PlusIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import type { ListingData, User } from "../../../../shared/types";
import TelegramLogo from "../../../../shared/ui/telegram-logo";
import { useTranslation } from "react-i18next";

type DetailsInfoProps = {
  user: User;
  listingData?: ListingData[];
  setIsEditing: (value: React.SetStateAction<boolean>) => void;
  inputRefs: React.RefObject<{
    name: HTMLInputElement | null;
    phone: HTMLInputElement | null;
    university: HTMLInputElement | null;
    telegram_link: HTMLInputElement | null;
    bio: HTMLTextAreaElement | null;
  }>;
};

export default function DetailsInfo({
  user,
  setIsEditing,
  inputRefs,
}: DetailsInfoProps) {
  function handleAddProperty(property: keyof typeof inputRefs.current) {
    setIsEditing(true);
    setTimeout(() => {
      inputRefs.current[property]?.focus();
    }, 0);
  }

  const { t } = useTranslation();

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-10">
        <Card className="flex-col gap-5 w-full p-5 md:p-10">
          <div className="flex gap-2 items-center w-fit">
            <InformationCircleIcon className="size-7 text-accent" />
            <h1 className="text-2xl font-semibold">{t("profile.info.name")}</h1>
          </div>
          <div className="flex flex-col gap-2 pl-5">
            <div className="flex gap-2 py-3 px-4 items-center w-fit">
              <EnvelopeIcon className="size-5" />
              <h2>{t("profile.info.email")}:</h2>
              <Link
                className="text-primary break-all"
                to={`mailto:${user?.email}`}
              >
                {user?.email ?? ""}
              </Link>
            </div>

            {user?.university !== "" ? (
              <div className="flex gap-2 py-3 px-4  items-center w-fit">
                <AcademicCapIcon className="size-5" />
                <h2>{t("profile.info.university")}:</h2>
                <p>{user?.university}</p>
              </div>
            ) : (
              <button
                onClick={() => handleAddProperty("university")}
                className="flex py-3 px-4 shadow-base font-medium rounded-md gap-2 items-center w-fit bg-accent text-accent-foreground"
              >
                <PlusIcon className="size-5" />
                <h2>{t("profile.fields.university")}</h2>
                <AcademicCapIcon className="size-5" />
              </button>
            )}
          </div>
        </Card>
        <Card className="flex-col gap-5 w-full p-5 md:p-10">
          <div className="flex gap-2 items-center w-fit">
            <LinkIcon className="size-7 text-primary" />
            <h1 className="text-2xl font-semibold">
              {t("profile.contacts.name")}
            </h1>
          </div>

          <div className="flex flex-col pl-5 gap-2">
            {user?.phone !== "" ? (
              <div className="flex gap-2 py-3 px-4  items-center w-fit">
                <PhoneIcon className="size-5" />
                <h2>{t("profile.contacts.phone")}:</h2>
                <Link to={`tel:${user?.phone}`}>{user?.phone}</Link>
              </div>
            ) : (
              <button
                onClick={() => handleAddProperty("phone")}
                className="flex py-3 px-4 shadow-base font-medium rounded-md gap-2 items-center w-fit bg-accent text-accent-foreground"
              >
                <PlusIcon className="size-5" />
                <h2>{t("profile.fields.phone")}</h2>
                <PhoneIcon className="size-5" />
              </button>
            )}

            {user?.telegram_link ? (
              <div className="flex items-center py-3 px-4 w-fit gap-1">
                <TelegramLogo width={25} height={25} />

                <h2 className="whitespace-nowrap">
                  {t("profile.contacts.telegram")}:
                </h2>
                <Link
                  className="text-primary break-all"
                  to={user?.telegram_link ?? ""}
                >
                  {user?.telegram_link}
                </Link>
              </div>
            ) : (
              <button
                onClick={() => handleAddProperty("telegram_link")}
                className="flex py-3 px-4 shadow-base font-medium  rounded-md gap-2 items-center w-fit bg-accent text-accent-foreground"
              >
                <PlusIcon className="size-5" />
                <h2>{t("profile.fields.telegram")}</h2>
                <TelegramLogo width={25} height={25} />
              </button>
            )}
          </div>
        </Card>
      </div>
      <Card className="flex flex-col gap-5 w-full p-5 md:p-10">
        <div className="flex gap-2 items-center w-fit">
          <UserIcon className="size-7 text-foreground" />
          <h1 className="text-2xl font-semibold">
            {t("profile.aboutMe.name")}
          </h1>
        </div>
        <div className="pl-5">
          {user?.bio !== "" ? (
            <>
              <p className="pl-5">{user?.bio}</p>
            </>
          ) : (
            <button
              onClick={() => handleAddProperty("bio")}
              className="flex py-3 px-4 shadow-base font-medium rounded-md gap-2 items-center w-fit bg-accent text-accent-foreground"
            >
              <PlusIcon className="size-5" />
              <h2>{t("profile.fields.bio")}</h2>
              <PencilIcon className="size-5" />
            </button>
          )}
        </div>
      </Card>
    </>
  );
}
