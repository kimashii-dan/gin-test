import { api } from "../../shared/lib/axios";
import type { AuthResponse } from "../../shared/types";

export async function getUserData(): Promise<AuthResponse> {
  const { data } = await api.get("/validate");
  return data;
}
