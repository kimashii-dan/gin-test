import { api } from "../../shared/core/axios";
import type { ListingData } from "../../shared/types";

export async function getListings(): Promise<ListingData[]> {
  const { data } = await api.get("/public/listings");
  return data;
}
