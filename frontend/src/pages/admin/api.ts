import { api } from "../../shared/core/axios";

export type AdminUser = {
  id: number;
  email: string;
  name: string;
  university: string;
  listings_count: number;
  average_rating: number;
  rating_count: number;
};

export type AdminListing = {
  id: number;
  title: string;
  price: number;
  category: string;
  is_closed: boolean;
  user_id: number;
  user_email: string;
  user_name: string;
  images_count: number;
};

export async function getAllUsers(): Promise<AdminUser[]> {
  const token = localStorage.getItem("admin_token");
  const { data } = await api.get("/admin/users", {
    headers: {
      Authorization: token,
    },
  });
  return data;
}

export async function getAllListings(): Promise<AdminListing[]> {
  const token = localStorage.getItem("admin_token");
  const { data } = await api.get("/admin/listings", {
    headers: {
      Authorization: token,
    },
  });
  return data;
}

export async function deleteUser(userId: number) {
  const token = localStorage.getItem("admin_token");
  const { data } = await api.delete(`/admin/users/${userId}`, {
    headers: {
      Authorization: token,
    },
  });
  return data;
}

export async function deleteListing(listingId: number) {
  const token = localStorage.getItem("admin_token");
  const { data } = await api.delete(`/admin/listings/${listingId}`, {
    headers: {
      Authorization: token,
    },
  });
  return data;
}
