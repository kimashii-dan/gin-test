import { NavLink } from "react-router";
import styles from "./styles.module.css";
import ModeToggle from "../../mode-toggle";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import Logo from "../../logo";
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../../core/auth";

export default function Header() {
  const { data: authData } = useAuth();
  const isAuthenticated = !!authData?.user;

  return (
    <header className={styles.header}>
      <nav className={styles.header_nav}>
        <Logo />

        <div className="flex gap-5">
          <ModeToggle />
          {isAuthenticated ? (
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
