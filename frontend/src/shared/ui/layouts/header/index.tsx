import { NavLink, useRouteLoaderData } from "react-router";
import styles from "./styles.module.css";
import ModeToggle from "../../mode-toggle";
import type { AuthState } from "../../../types";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import Logo from "../../logo";
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline";
export default function Header() {
  const { auth } = useRouteLoaderData("root") as { auth: AuthState };

  return (
    <header className={styles.header}>
      <nav className={styles.header_nav}>
        <Logo />

        <div className="flex gap-5">
          <ModeToggle />
          {auth.isAuthenticated ? (
            <NavLink to="/profile">
              <UserCircleIcon className="size-10" />
            </NavLink>
          ) : (
            <NavLink to="/login" className="flex flex-row items-center gap-1">
              <ArrowLeftEndOnRectangleIcon className="size-6" />
              <span>Login</span>
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}
