import { redirect } from "react-router";

export function requireAdminAuth() {
  const token = localStorage.getItem("admin_token");
  if (!token) {
    throw redirect("/admin-login");
  }
}

export function requireAdminGuest() {
  const token = localStorage.getItem("admin_token");
  if (token) {
    throw redirect("/admin");
  }
}
