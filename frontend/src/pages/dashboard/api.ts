import { api } from "../../shared/core/axios";
import type { ListingData, Rating } from "../../shared/types";

export interface DashboardStats {
  total_listings: number;
  active_listings: number;
  closed_listings: number;
  total_wishlists: number;
  average_price: number;
}

export interface DashboardData {
  stats: DashboardStats;
  listings: ListingData[];
  ratings: {
    ratings: Rating[];
    average_rating: number;
    rating_count: number;
  };
}

export const getDashboardStats = async (): Promise<DashboardData> => {
  const response = await api.get("/user/dashboard");
  return response.data;
};
