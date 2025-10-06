import { api } from "../../shared/core/axios";
import type { SuccessResponse, User } from "../../shared/types";

export async function logout(): Promise<SuccessResponse> {
  const { data } = await api.post("/auth/logout");
  return data;
}

export async function updateUser(user: Partial<User>) {
  await api.patch("/user/me", user);
}
