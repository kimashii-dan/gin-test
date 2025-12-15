import { createBrowserRouter } from "react-router";
import RootLayout from "../shared/ui/layouts/root-layout";
import Login from "../pages/login";
import NotFound from "../pages/not-found";
import Profile from "../pages/profile";
import Register from "../pages/register";
import { requireAuth, requireGuest } from "../shared/core/auth";
import { requireAdminAuth, requireAdminGuest } from "../shared/core/admin-auth";
import AuthLayout from "../shared/ui/layouts/auth-layout";
import MainLayout from "../shared/ui/layouts/main-layout";
import ListingPage from "../pages/listing";
import Home from "../pages/home";
import AccountPage from "../pages/account";
import WishlistPage from "../pages/wishlist";
import SearchPage from "../pages/search";
import AdminLogin from "../pages/admin-login";
import AdminPanel from "../pages/admin";
import DashboardPage from "../pages/dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    id: "root",
    Component: RootLayout,
    children: [
      {
        Component: MainLayout,
        children: [
          {
            index: true,
            Component: Home,
          },
          {
            path: "/listings/:id",
            Component: ListingPage,
          },
          {
            path: "/search",
            Component: SearchPage,
          },
          {
            path: "/users/:id",
            Component: AccountPage,
          },
          {
            path: "/profile",
            middleware: [requireAuth],
            Component: Profile,
          },
          {
            path: "/dashboard",
            middleware: [requireAuth],
            Component: DashboardPage,
          },
          {
            path: "/wishlist",
            middleware: [requireAuth],
            Component: WishlistPage,
          },
          {
            path: "/admin",
            middleware: [requireAdminAuth],
            Component: AdminPanel,
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
      {
        Component: AuthLayout,
        middleware: [requireAdminGuest],
        children: [{ path: "/admin-login", Component: AdminLogin }],
      },
    ],
  },
]);
