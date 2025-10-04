import { api } from "../../shared/core/axios";
import type { Credentials, TokenResponse } from "../../shared/types";

export async function login(credentials: Credentials): Promise<TokenResponse> {
  const { data } = await api.post("/auth/login", credentials);
  return data;
}
