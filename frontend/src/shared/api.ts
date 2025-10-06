import { api } from "./core/axios";
import type { AuthResponse } from "./types";

export async function getUserData(): Promise<AuthResponse> {
  const { data } = await api.get("/user/me");
  console.log(data);
  return data;
}
