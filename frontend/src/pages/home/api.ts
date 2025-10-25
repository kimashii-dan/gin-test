import { api } from "../../shared/core/axios";
import type { Listing } from "../../shared/types";

export async function getListings(): Promise<Listing[]> {
  const { data } = await api.get("/public/listings");
  return data;
}

export async function createListing(formData: FormData) {
  const { data } = await api.post("/user/listings", formData);
  return data;
}
