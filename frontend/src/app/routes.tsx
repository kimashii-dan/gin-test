import { createBrowserRouter } from "react-router";
import MainLayout from "../shared/ui/layouts/main-layout";
import Home from "../pages/home";
import Login from "../pages/login";
import NotFound from "../pages/not-found";
import Profile from "../pages/profile";
import Register from "../pages/register";
import AuthLayout from "../shared/ui/layouts/auth-layout";
import { requireAuth, requireGuest } from "../shared/auth";

export const router = createBrowserRouter([
  {
    Component: MainLayout,
    path: "/",
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
]);
