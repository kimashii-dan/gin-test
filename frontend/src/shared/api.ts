import { api } from "./core/axios";
import type { AuthResponse } from "./types";

export async function getUserData(): Promise<AuthResponse> {
  const { data } = await api.get("/user");
  return data;
}
