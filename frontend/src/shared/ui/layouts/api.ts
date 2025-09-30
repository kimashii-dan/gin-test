import { api } from "../../lib/axios";
import type { SuccessResponse } from "../../types";

export async function logout(): Promise<SuccessResponse> {
  const { data } = await api.post("/auth/logout");
  return data;
}
