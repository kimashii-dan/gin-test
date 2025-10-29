import { api } from "../../shared/core/axios";
import type { User } from "../../shared/types";

export async function getUser(id: number): Promise<User> {
  const { data } = await api.get(`/public/users/${id}`);
  return data;
}
