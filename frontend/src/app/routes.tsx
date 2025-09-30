import { createBrowserRouter } from "react-router";
import Login from "../pages/login";
import Register from "../pages/register";
import AuthLayout from "../shared/ui/layouts/auth-layout";
import MainLayout from "../shared/ui/layouts/main-layout";
import Home from "../pages/home";
import NotFound from "../pages/not-found";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
]);
