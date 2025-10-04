import { createBrowserRouter } from "react-router";
import Home from "../pages/home";
import Login from "../pages/login";
import NotFound from "../pages/not-found";
import Profile from "../pages/profile";
import Register from "../pages/register";
import RootLayout from "../shared/ui/layouts/root-layout";
import MainLayout from "../shared/ui/layouts/main-layout";
import AuthLayout from "../shared/ui/layouts/auth-layout";
import {
  authLoader,
  checkAndPassAuth,
  requireAuth,
  requireGuest,
} from "../shared/auth";

export const router = createBrowserRouter([
  {
    path: "/",
    id: "root",
    Component: RootLayout,
    middleware: [checkAndPassAuth],
    loader: authLoader,
    children: [
      {
        Component: MainLayout,
        children: [
          {
            index: true,
            Component: Home,
          },
          {
            path: "/profile",
            middleware: [requireAuth],
            Component: Profile,
          },
          {
            path: "*",
            Component: NotFound,
          },
        ],
      },
      {
        Component: AuthLayout,
        middleware: [requireGuest],
        children: [
          { path: "/login", Component: Login },
          { path: "/register", Component: Register },
        ],
      },
    ],
  },
]);
