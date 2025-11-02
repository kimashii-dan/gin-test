import { Card } from "../../shared/ui/card";
import styles from "./styles.module.css";

export default function ListingPageSkeleton() {
  return (
    <div className={styles.page_listing}>
      {/* Image Gallery Skeleton */}
      <div className={styles.image_gallery}>
        {/* Main image skeleton */}
        <div className={styles.image}>
          <div className="w-full h-full bg-muted animate-pulse rounded-xl" />

          {/* Arrow buttons skeleton */}
          <div className="absolute top-1/2 left-1">
            <div className="w-8 h-8 bg-muted animate-pulse rounded-full" />
          </div>
          <div className="absolute top-1/2 right-1">
            <div className="w-8 h-8 bg-muted animate-pulse rounded-full" />
          </div>
        </div>

        {/* Thumbnail navigation skeleton */}
        <div className="flex w-full gap-2">
          {[...Array(4)].map((_, index) => (
            <div key={index} className={styles.image_nav}>
              <div className="w-full h-full bg-muted animate-pulse rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* Listing Details Skeleton */}
      <div className={styles.listing_details}>
        {/* Action buttons skeleton (for owner) */}
        <div className="flex gap-5 items-center">
          <div className="flex-1 h-10 bg-muted animate-pulse rounded" />
          <div className="flex-1 h-10 bg-muted animate-pulse rounded" />
        </div>

        <Card className="p-8 flex-col">
          <div className="flex flex-col gap-8">
            {/* Title skeleton */}
            <div className="w-3/4 h-10 bg-muted animate-pulse rounded" />

            {/* Price skeleton */}
            <div className="w-32 h-8 bg-muted animate-pulse rounded" />

            {/* Status and like button skeleton */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-16 h-4 bg-muted animate-pulse rounded" />
                <div className="w-11 h-6 bg-muted animate-pulse rounded-full" />
                <div className="w-16 h-4 bg-muted animate-pulse rounded" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-muted animate-pulse rounded" />
                <div className="w-8 h-4 bg-muted animate-pulse rounded" />
              </div>
            </div>

            {/* Description skeleton */}
            <div className="flex flex-col gap-2">
              <div className="w-24 h-6 bg-muted animate-pulse rounded" />
              <div className="w-full h-4 bg-muted animate-pulse rounded" />
              <div className="w-4/5 h-4 bg-muted animate-pulse rounded" />
              <div className="w-3/5 h-4 bg-muted animate-pulse rounded" />
            </div>

            {/* Divider */}
            <hr className="border border-border" />

            {/* User info skeleton */}
            <div className="flex items-center w-fit gap-5">
              <div className="w-15 h-15 bg-muted animate-pulse rounded-full" />
              <div className="flex flex-col gap-2">
                <div className="w-32 h-5 bg-muted animate-pulse rounded" />
                <div className="w-40 h-4 bg-muted animate-pulse rounded" />
              </div>
            </div>

            {/* Contact buttons skeleton */}
            <div className="flex flex-col md:flex-row gap-5">
              <div className="flex-1 h-12 bg-muted animate-pulse rounded" />
              <div className="flex-1 h-12 bg-muted animate-pulse rounded" />
            </div>

            {/* Divider */}
            <hr className="border border-border" />

            {/* University and Posted info skeleton */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-muted animate-pulse rounded" />
                <div className="flex flex-col gap-1">
                  <div className="w-16 h-4 bg-muted animate-pulse rounded" />
                  <div className="w-24 h-5 bg-muted animate-pulse rounded" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-muted animate-pulse rounded" />
                <div className="flex flex-col gap-1">
                  <div className="w-12 h-4 bg-muted animate-pulse rounded" />
                  <div className="w-32 h-5 bg-muted animate-pulse rounded" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
