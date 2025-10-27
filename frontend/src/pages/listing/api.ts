import { api } from "../../shared/core/axios";
import type { Listing } from "../../shared/types";

export async function getListing(id: number): Promise<Listing> {
  const { data } = await api.get(`/public/listings/${id}`);
  return data;
}
