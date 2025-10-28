import { useState } from "react";
import type { Listing } from "../../../../shared/types";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/20/solid";

export default function ImageGallery({ listing }: { listing: Listing }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  return (
    <div className="base:w-[45%] w-full flex flex-col gap-5 h-fit base:sticky base:top-30">
      <div className="relative w-full aspect-square overflow-hidden rounded-xl">
        <img
          src={
            listing.image_urls && listing.image_urls.length > 0
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
            <ArrowLeftIcon className="size-8 text-foreground bg-black/60 rounded-full p-1" />
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
            <ArrowRightIcon className="size-8 text-foreground bg-black/60 rounded-full p-1" />
          </button>
        </div>
      </div>

      <div className="flex w-full md:gap-3 gap-2">
        {listing.image_urls &&
          listing.image_urls.length > 1 &&
          listing.image_urls.map((url, index) => (
            <div
              key={index}
              className={`relative flex-1 aspect-square overflow-hidden rounded-lg cursor-pointer ${
                index === currentIndex ? "" : ""
              }`}
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
