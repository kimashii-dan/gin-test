import { Navigate, Outlet } from "react-router";

export default function AuthLayout() {
  const isAuthenticated = Boolean(localStorage.getItem("access_token"));

  if (isAuthenticated) return <Navigate to="/" />;
  return (
    <main>
      <Outlet />
    </main>
  );
}
