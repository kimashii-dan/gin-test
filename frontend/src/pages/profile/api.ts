import { api } from "../../shared/lib/axios";
import type { SuccessResponse } from "../../shared/types";

export async function logout(): Promise<SuccessResponse> {
  const { data } = await api.post("/auth/logout");
  return data;
}
