import { api } from "../../shared/core/axios";
import type { ListingData, PriceSuggestionResponse } from "../../shared/types";

export type SearchParams = {
  page: number;
  query?: string;
  category?: string;
};

export async function searchListings(
  searchParams: URLSearchParams
): Promise<ListingData[]> {
  const { data } = await api.get("/public/listings/search", {
    params: searchParams,
  });
  return data;
}

export async function createListing(formData: FormData) {
  const { data } = await api.post("/user/listings", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

export async function getAIPRiceReport(
  formData: FormData
): Promise<PriceSuggestionResponse> {
  const { data } = await api.post("/ai/suggest-price", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}
