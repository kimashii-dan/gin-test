import { useState } from "react";
import type { Listing } from "../../../../shared/types";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/20/solid";
import styles from "../../styles.module.css";

export default function ImageGallery({ listing }: { listing: Listing }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  return (
    <div className={styles.image_gallery}>
      <div className={styles.image}>
        <img
          src={
            listing.image_urls &&
            Array.isArray(listing.image_urls) &&
            listing.image_urls.length > 0
              ? listing.image_urls[currentIndex]
              : "/images/hoodie.webp"
          }
          className="w-full h-full object-cover"
          alt={`${listing.title} image 1`}
        />
        <div className="absolute top-1/2 left-1">
          <button
            onClick={() =>
              setCurrentIndex((prev: number) => {
                if (currentIndex === 0) {
                  return listing.image_urls.length - 1;
                }

                return prev - 1;
              })
            }
          >
            <ArrowLeftIcon className={styles.arrow} />
          </button>
        </div>
        <div className="absolute top-1/2 right-1">
          <button
            onClick={() => {
              setCurrentIndex((prev: number) => {
                if (currentIndex === listing.image_urls.length - 1) {
                  return 0;
                }

                return prev + 1;
              });
            }}
          >
            <ArrowRightIcon className={styles.arrow} />
          </button>
        </div>
      </div>

      <div className="flex w-full gap-2">
        {listing.image_urls &&
          listing.image_urls.length > 1 &&
          listing.image_urls.map((url, index) => (
            <div
              key={index}
              className={styles.image_nav}
              onClick={() => setCurrentIndex(index)}
            >
              <img
                src={url}
                alt={`${listing.title} ${index}`}
                className={`w-full h-full object-cover ${
                  index === currentIndex ? "" : "brightness-50"
                } `}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
