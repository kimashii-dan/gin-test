import {
  AcademicCapIcon,
  EnvelopeIcon,
  PaperAirplaneIcon,
  PhoneIcon,
  StarIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { formatDate } from "../../../../shared/helpers/formatDate";
import type { User } from "../../../../shared/types";
import { Card } from "../../../../shared/ui/card";
import TelegramLogo from "../../../../shared/ui/telegram-logo";
import styles from "../../styles.module.css";
import { Button } from "../../../../shared/ui/button";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import RatingStars from "../../../../shared/ui/rating-stars";

export default function AccountDetails({ user }: { user: User }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  function handleContact() {
    if (!user) {
      return;
    }

    if (user.telegram_link) {
      navigate(user.telegram_link);
    } else {
      const mailto = `mailto:${user.email}`;
      window.location.href = mailto;
    }
  }

  const userDetails = [
    {
      title: t("profile.info.email"),
      icon: <EnvelopeIcon className="size-5" />,
      value: user?.email,
    },
    {
      title: t("profile.contacts.phone"),
      icon: <PhoneIcon className="size-5" />,
      value: user?.phone || t("unknown"),
    },
    {
      title: t("profile.info.university"),
      icon: <AcademicCapIcon className="size-5" />,
      value: user?.university || t("unknown"),
    },
    {
      title: t("profile.contacts.telegram"),
      icon: <PaperAirplaneIcon className="size-5 -rotate-40" />,
      value: user?.telegram_link || t("unknown"),
    },
  ];

  return (
    <div className="flex flex-col justify-center gap-5 lg:flex-row">
      <Card className={styles.user_info}>
        <div className="w-30 h-30 relative">
          {user.avatar_url ? (
            <img
              className="w-full h-full rounded-full object-cover shadow-sm"
              src={user.avatar_url}
              alt=""
            />
          ) : (
            <div className={styles.user_avatar}>
              <>{user.email?.[0].toUpperCase()}</>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center gap-2">
          <p className="text-2xl font-semibold text-center">{user?.name}</p>
          <p className="text-muted-foreground">
            {t("listingDetails.owner.memberSince")}{" "}
            {formatDate(user?.created_at)}
          </p>
          {user.rating_count > 0 && (
            <div className="flex justify-center mt-2">
              <RatingStars
                rating={user.average_rating}
                size="medium"
                showCount
                count={user.rating_count}
              />
            </div>
          )}
        </div>

        <div className="flex flex-row md:flex-col gap-5 justify-center">
          {user.telegram_link ? (
            <Button
              variant="secondary"
              className="flex items-center justify-center gap-2"
              onClick={handleContact}
            >
              <TelegramLogo width={30} height={30} />
              <span className="font-medium text-base">
                {t("listingDetails.buttons.contactTelegram")}
              </span>
            </Button>
          ) : (
            <Button
              variant="secondary"
              className="flex items-center justify-center gap-2"
              onClick={handleContact}
            >
              <EnvelopeIcon className="size-5" />
              <span className="font-medium text-base">
                {t("listingDetails.buttons.contactEmail")}
              </span>
            </Button>
          )}

          <Button
            className="flex gap-2 items-center justify-center font-medium"
            onClick={() => console.log("bro")}
            variant="secondary"
          >
            <StarIcon className="size-6  text-yellow-500" />
            <span className="font-medium text-base">
              {t("listingDetails.buttons.rate")} {user?.name}
            </span>
          </Button>
        </div>
      </Card>

      <div className="flex flex-col flex-1 gap-5 break-all">
        <div className={styles.user_details}>
          {userDetails.map((detail) => (
            <Card key={detail.title} className={styles.user_detail}>
              <h3 className="font-medium text-lg flex gap-2 items-center">
                {detail.icon}
                <span>{detail.title}</span>
              </h3>
              <p className="text-muted-foreground">{detail.value}</p>
            </Card>
          ))}
        </div>

        <Card className="p-8 flex-col gap-5">
          <div className="flex flex-col gap-2 items-start justify-center">
            <h3 className="font-medium text-lg flex gap-2 items-center">
              <UserIcon className="size-5" />
              <span>{t("profile.aboutMe.name")}</span>
            </h3>
            <p className="text-muted-foreground">{user.bio || t("unknown")}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
