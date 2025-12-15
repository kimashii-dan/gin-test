import { useQuery } from "@tanstack/react-query";
import { useSearchParams, Link } from "react-router";
import { searchListings } from "./api";
import type { ListingData } from "../../shared/types";
import { useTranslation } from "react-i18next";
import ErrorScreen from "../../shared/ui/error-screen";
import { useAuth } from "../../shared/core/auth";
import { useState } from "react";
import { Button } from "../../shared/ui/button";
import styles from "./styles.module.css";
import CreateListingForm from "./ui/create-listing-form";
import ListingCardSkeleton from "../../shared/ui/listing-card/skeleton";
import ListingCard from "../../shared/ui/listing-card";
import EmptyData from "../../shared/ui/empty-data";
import Pagination from "../../shared/ui/pagination";
import { categories } from "../../shared/enums";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const query = searchParams.get("query");
  const category = searchParams.get("category");

  const {
    data: searchData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [`listings ${category} ${page} ${query}`],
    queryFn: () => searchListings(searchParams),
  });

  const { data: authData } = useAuth();
  const isAuthenticated = !!authData?.user;
  const { t } = useTranslation();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateListing = () => {
    setIsCreating(true);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    setSearchParams(params);
  };

  if (isError) {
    return <ErrorScreen text={t("errors.home.loading")} />;
  }

  const listingsData = searchData?.listings || [];
  const total = searchData?.total || 0;

  return (
    <section className="page-layout">
      <div className={styles.category_nav}>
        {categories.map((cat) => (
          <Link
            key={cat}
            to={`/search?page=1&category=${cat.toLowerCase()}`}
            className={
              category === cat.toLowerCase()
                ? styles.category_button_active
                : styles.category_button
            }
          >
            {t(`listingForm.category.categories.${cat.toLowerCase()}`)}
          </Link>
        ))}
      </div>

      <div className={styles.listing_controls}>
        {isCreating && <CreateListingForm setIsCreating={setIsCreating} />}

        <div className="flex w-full justify-between gap-3">
          {query ? (
            <h1 className="md:text-3xl">
              {t("search.result.found")} {total} {t("search.result.results")} "
              {query}"
            </h1>
          ) : (
            <h1 className="page-title">
              {t(`listingForm.category.categories.${category}`)}
            </h1>
          )}
          {isAuthenticated && (
            <Button
              variant="primary"
              className="w-fit h-fit"
              onClick={handleCreateListing}
            >
              {t("buttons.createListing")}
            </Button>
          )}
        </div>
      </div>

      {listingsData && listingsData.length === 0 && (
        <EmptyData text={t("errors.account.listings.absence")} />
      )}
      <div className="cards">
        {isLoading ? (
          <>
            <ListingCardSkeleton />
            <ListingCardSkeleton />
            <ListingCardSkeleton />
            <ListingCardSkeleton />
          </>
        ) : (
          listingsData &&
          listingsData.length > 0 &&
          listingsData.map((listingData: ListingData) => (
            <ListingCard
              key={listingData.listing.id}
              listing={listingData.listing}
              isInWishlist={listingData.is_in_wishlist}
            />
          ))
        )}
      </div>

      {!isLoading && (
        <Pagination
          currentPage={page}
          totalItems={total}
          itemsPerPage={10}
          onPageChange={handlePageChange}
        />
      )}
    </section>
  );
}
