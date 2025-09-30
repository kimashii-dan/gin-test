import { Outlet } from "react-router";
import Header from "./header";

export default function MainLayout() {
  return (
    <main>
      <Header />
      <Outlet />
    </main>
  );
}
