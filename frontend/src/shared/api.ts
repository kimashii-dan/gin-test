import { api } from "./core/axios";
import type {
  AuthResponse,
  CheckRatingResponse,
  CreateRatingDTO,
  Rating,
  RatingResponse,
  UpdateRatingDTO,
} from "./types";

export async function getUserData(): Promise<AuthResponse> {
  const { data } = await api.get("/user");
  return data;
}

// Rating API functions
export async function createRating(
  ratingData: CreateRatingDTO
): Promise<{ success: boolean; rating: Rating }> {
  const { data } = await api.post("/user/ratings", ratingData);
  return data;
}

export async function getUserRatings(userId: number): Promise<RatingResponse> {
  const { data } = await api.get(`/public/ratings/user/${userId}`);
  return data;
}

export async function getMyRatingsGiven(): Promise<Rating[]> {
  const { data } = await api.get("/user/ratings/given");
  return data;
}

export async function updateRating(
  ratingId: number,
  ratingData: UpdateRatingDTO
): Promise<{ success: boolean; rating: Rating }> {
  const { data } = await api.patch(`/user/ratings/${ratingId}`, ratingData);
  return data;
}

export async function deleteRating(
  ratingId: number
): Promise<{ success: boolean }> {
  const { data } = await api.delete(`/user/ratings/${ratingId}`);
  return data;
}

export async function checkUserRating(
  sellerId: number,
  listingId?: number
): Promise<CheckRatingResponse> {
  const params = listingId ? `?listing_id=${listingId}` : "";
  const { data } = await api.get(`/public/ratings/check/${sellerId}${params}`);
  return data;
}
