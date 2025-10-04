import { redirect } from "react-router";
import { createContext } from "react-router";
import type { AuthState } from "../types";
import { getUserData } from "../api";

export const authContext = createContext<AuthState>();

export async function checkAndPassAuth({ context }: any) {
  const token = localStorage.getItem("access_token");

  if (!token) {
    const authState: AuthState = { isAuthenticated: false };
    context.set(authContext, authState);
    return;
  }

  try {
    const { user } = await getUserData();
    const authState: AuthState = {
      isAuthenticated: true,
      user: user,
    };
    context.set(authContext, authState);
  } catch (error) {
    const authState: AuthState = { isAuthenticated: false };
    context.set(authContext, authState);
  }
}

export async function requireAuth({ context }: any) {
  const authState = context.get(authContext);
  if (!authState?.isAuthenticated) {
    throw redirect("/");
  }
}

export async function requireGuest({ context }: any) {
  const authState = context.get(authContext);
  if (authState?.isAuthenticated) {
    throw redirect("/profile");
  }
}

export async function authLoader({ context }: any) {
  const auth = context.get(authContext);
  return { auth };
}
