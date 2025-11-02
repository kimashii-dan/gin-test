import { Card } from "../../shared/ui/card";

export default function ProfileSkeleton() {
  return (
    <div className="max-w-11/12 md:max-w-10/12 flex flex-col gap-10 w-full py-5">
      {/* Page title skeleton */}
      <h1 className="page-title">Profile</h1>
      {/* Main Info Card Skeleton */}
      <Card className="items-center flex-wrap justify-center md:justify-between gap-8 relative p-5 md:p-10">
        {/* Avatar skeleton */}
        <div className="w-40 h-40 bg-muted animate-pulse rounded-full" />

        {/* User name and joined date skeleton */}
        <div className="flex flex-col justify-center gap-2 items-center">
          <div className="w-32 h-7 bg-muted animate-pulse rounded" />
          <div className="w-28 h-5 bg-muted animate-pulse rounded" />
        </div>

        {/* Action buttons skeleton */}
        <div className="flex flex-row md:flex-col gap-5 justify-center">
          <div className="w-20 h-12 bg-muted animate-pulse rounded" />
          <div className="w-24 h-12 bg-muted animate-pulse rounded" />
        </div>
      </Card>

      {/* Details Section Skeleton */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Info Card Skeleton */}
        <Card className="flex-col gap-5 w-full p-5 md:p-10">
          {/* Section header skeleton */}
          <div className="flex gap-2 items-center w-fit">
            <div className="w-7 h-7 bg-muted animate-pulse rounded" />
            <div className="w-12 h-7 bg-muted animate-pulse rounded" />
          </div>

          {/* Info items skeleton */}
          <div className="flex flex-col gap-2 pl-5">
            {/* Email item skeleton */}
            <div className="flex gap-2 py-3 px-4 items-center w-fit">
              <div className="w-5 h-5 bg-muted animate-pulse rounded" />
              <div className="w-12 h-5 bg-muted animate-pulse rounded" />
              <div className="w-40 h-5 bg-muted animate-pulse rounded" />
            </div>

            {/* University item skeleton */}
            <div className="flex gap-2 py-3 px-4 items-center w-fit">
              <div className="w-5 h-5 bg-muted animate-pulse rounded" />
              <div className="w-20 h-5 bg-muted animate-pulse rounded" />
              <div className="w-32 h-5 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </Card>

        {/* Contacts Card Skeleton */}
        <Card className="flex-col gap-5 w-full p-5 md:p-10">
          {/* Section header skeleton */}
          <div className="flex gap-2 items-center w-fit">
            <div className="w-7 h-7 bg-muted animate-pulse rounded" />
            <div className="w-20 h-7 bg-muted animate-pulse rounded" />
          </div>

          {/* Contact items skeleton */}
          <div className="flex flex-col pl-5 gap-2">
            {/* Phone item skeleton */}
            <div className="flex gap-2 py-3 px-4 items-center w-fit">
              <div className="w-5 h-5 bg-muted animate-pulse rounded" />
              <div className="w-12 h-5 bg-muted animate-pulse rounded" />
              <div className="w-28 h-5 bg-muted animate-pulse rounded" />
            </div>

            {/* Telegram item skeleton */}
            <div className="flex gap-2 py-3 px-4 items-center w-fit">
              <div className="w-6 h-6 bg-muted animate-pulse rounded" />
              <div className="w-18 h-5 bg-muted animate-pulse rounded" />
              <div className="w-36 h-5 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </Card>
      </div>

      {/* Bio Card Skeleton */}
      <Card className="flex flex-col gap-5 w-full p-5 md:p-10">
        {/* Section header skeleton */}
        <div className="flex gap-2 items-center w-fit">
          <div className="w-7 h-7 bg-muted animate-pulse rounded" />
          <div className="w-24 h-7 bg-muted animate-pulse rounded" />
        </div>

        {/* Bio content skeleton */}
        <div className="pl-5">
          <div className="pl-5 flex flex-col gap-2">
            <div className="w-full h-4 bg-muted animate-pulse rounded" />
            <div className="w-4/5 h-4 bg-muted animate-pulse rounded" />
            <div className="w-3/5 h-4 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </Card>
    </div>
  );
}
