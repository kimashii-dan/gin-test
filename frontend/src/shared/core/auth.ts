import { redirect } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getUserData } from "../api";

export function useAuth() {
  return useQuery({
    queryKey: ["auth", "user"],
    queryFn: getUserData,
    enabled: !!localStorage.getItem("access_token"),
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });
}

function hasValidToken(): boolean {
  const token = localStorage.getItem("access_token");
  if (!token) return false;
  return true;
}

export async function requireAuth() {
  if (!hasValidToken()) {
    throw redirect("/login");
  }
}

export async function requireGuest() {
  if (hasValidToken()) {
    throw redirect("/profile");
  }
}
