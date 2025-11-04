import { api } from "../../shared/core/axios";
import type { ListingData, PriceSuggestionResponse } from "../../shared/types";

export async function getListing(id: number): Promise<ListingData> {
  const { data } = await api.get(`/public/listings/${id}`);
  return data;
}

type Request = {
  id: number;
  formData: FormData;
};

export async function updateListing(request: Request) {
  const { data } = await api.patch(
    `/user/listings/${request.id}`,
    request.formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
}

export async function deleteListing(id: number) {
  const { data } = await api.delete(`/user/listings/${id}`);
  return data;
}

export async function addToWishlist(id: number) {
  const { data } = await api.post(`/user/listings/wishlist/${id}`);
  return data;
}

export async function createAIPriceReport(
  request: Request
): Promise<PriceSuggestionResponse> {
  const { data } = await api.post(
    `/user/listings/report/${request.id}`,
    request.formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
}
