import { api } from "../../shared/core/axios";
import type { SuccessResponse, User } from "../../shared/types";

export async function logout(): Promise<SuccessResponse> {
  const { data } = await api.post("/auth/logout");
  return data;
}

export async function updateUser(user: Partial<User>) {
  await api.patch("/user/me", user);
}

export async function uploadAvatar(image: FormData) {
  const { data } = await api.patch("/user/avatar", image, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}
