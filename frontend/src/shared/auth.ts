import { redirect } from "react-router";

export function getAuthState() {
  return {
    isAuthenticated: Boolean(localStorage.getItem("access_token")),
  };
}

export async function requireAuth() {
  const { isAuthenticated } = getAuthState();
  if (!isAuthenticated) {
    throw redirect("/login");
  }
}

export async function requireGuest() {
  const { isAuthenticated } = getAuthState();
  if (isAuthenticated) {
    throw redirect("/profile");
  }
}
