import { api } from "../../shared/core/axios";

type AdminCredentials = {
  username: string;
  password: string;
};

type TokenResponse = {
  accessToken: string;
};

export async function adminLogin(
  credentials: AdminCredentials
): Promise<TokenResponse> {
  const { data } = await api.post("/admin/auth/login", credentials);
  return data;
}
