import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <main className="m-0 justify-center">
      <Outlet />
    </main>
  );
}
