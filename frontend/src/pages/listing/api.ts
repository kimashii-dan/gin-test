import { api } from "../../shared/core/axios";
import type { Listing } from "../../shared/types";

export async function getListing(id: number): Promise<Listing> {
  const { data } = await api.get(`/public/listings/${id}`);
  return data;
}

type UpdateRequest = {
  id: number;
  formData: FormData;
};

export async function updateListing(request: UpdateRequest) {
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
