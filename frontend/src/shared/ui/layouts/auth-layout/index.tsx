import { Outlet } from "react-router";
import ModeToggle from "../../mode-toggle";
import LangToggle from "../../lang-toggle";

export default function AuthLayout() {
  return (
    <>
      <div className="flex gap-2 p-10 fixed top-0 left-0">
        <LangToggle />
        <ModeToggle />
      </div>
      <main className="m-0 justify-center">
        <Outlet />
      </main>
    </>
  );
}
