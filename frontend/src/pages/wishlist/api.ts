import { api } from "../../shared/core/axios";
import type { Listing } from "../../shared/types";

export async function getWishlist(): Promise<Listing[]> {
  const { data } = await api.get(`/user/listings/wishlist`);
  return data;
}
