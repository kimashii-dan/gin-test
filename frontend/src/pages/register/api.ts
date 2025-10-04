import { api } from "../../shared/core/axios";
import type { Credentials, SuccessResponse } from "../../shared/types";

export async function register(
  credentials: Credentials
): Promise<SuccessResponse> {
  const { data } = await api.post("/auth/register", credentials);
  return data;
}
