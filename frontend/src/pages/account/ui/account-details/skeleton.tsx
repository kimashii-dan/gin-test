import { Card } from "../../../../shared/ui/card";
import styles from "../../styles.module.css";

export default function AccountDetailsSkeleton() {
  return (
    <div className="flex flex-col justify-center gap-5 lg:flex-row">
      {/* User Info Card Skeleton */}
      <Card className="items-center flex-wrap lg:flex-col justify-center lg:w-fit w-full gap-8 relative p-5 lg:p-10">
        {/* Avatar skeleton */}
        <div className="w-30 h-30 bg-muted animate-pulse rounded-full" />

        {/* User name and member since skeleton */}
        <div className="flex flex-col justify-center gap-2 items-center">
          <div className="w-32 h-7 bg-muted animate-pulse rounded" />
          <div className="w-40 h-5 bg-muted animate-pulse rounded" />
        </div>

        {/* Contact buttons skeleton */}
        <div className="flex flex-row md:flex-col gap-5 justify-center">
          <div className="h-10 w-32 md:w-52 bg-muted animate-pulse rounded" />
          <div className="h-10 w-32 md:w-52 bg-muted animate-pulse rounded" />
        </div>
      </Card>

      {/* User Details Section Skeleton */}
      <div className="flex flex-col flex-1 gap-5">
        {/* User details grid skeleton */}
        <div className={styles.user_details}>
          {[...Array(4)].map((_, index) => (
            <Card key={index} className={styles.user_detail}>
              {/* Icon and title skeleton */}
              <div className="flex gap-2 items-center">
                <div className="w-5 h-5 bg-muted animate-pulse rounded" />
                <div className="w-16 h-5 bg-muted animate-pulse rounded" />
              </div>
              {/* Value skeleton */}
              <div className="w-24 h-4 bg-muted animate-pulse rounded" />
            </Card>
          ))}
        </div>

        {/* Bio card skeleton */}
        <Card className="p-8 flex-col gap-5">
          <div className="flex flex-col gap-2 items-start justify-center">
            {/* Bio title with icon skeleton */}
            <div className="flex gap-2 items-center">
              <div className="w-5 h-5 bg-muted animate-pulse rounded" />
              <div className="w-8 h-5 bg-muted animate-pulse rounded" />
            </div>
            {/* Bio content skeleton */}
            <div className="w-full h-4 bg-muted animate-pulse rounded" />
            <div className="w-3/4 h-4 bg-muted animate-pulse rounded" />
            <div className="w-1/2 h-4 bg-muted animate-pulse rounded" />
          </div>
        </Card>
      </div>
    </div>
  );
}
