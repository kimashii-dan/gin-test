import { Card } from "../../../../shared/ui/card";
import styles from "../../styles.module.css";

export default function ListingCardSkeleton() {
  return (
    <Card className="max-w-[300px] w-full mx-auto flex-col gap-5 p-5 hover:-translate-y-1">
      {/* Image skeleton */}
      <div className={styles.card_img}>
        <div className="w-full h-full bg-muted animate-pulse rounded-lg" />

        {/* Status badge skeleton */}
        <div className="absolute top-2 left-2 w-16 h-6 bg-muted animate-pulse rounded-full" />

        {/* Posted time skeleton */}
        <div className="absolute bottom-2 right-2 w-20 h-5 bg-muted animate-pulse rounded-full" />
      </div>

      <div className="w-full flex flex-col gap-5">
        <div className="">
          {/* Title skeleton */}
          <div className="w-3/4 h-6 bg-muted animate-pulse rounded mb-2" />

          {/* Description skeleton */}
          <div className="w-full h-4 bg-muted animate-pulse rounded" />
        </div>

        <div className="w-full flex justify-between">
          {/* Price skeleton */}
          <div className="w-20 h-8 bg-muted animate-pulse rounded" />

          {/* Like button skeleton */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-muted animate-pulse rounded" />
            <div className="w-8 h-4 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    </Card>
  );
}
