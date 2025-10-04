import { Link, useRouteLoaderData } from "react-router";
import styles from "./styles.module.css";
import { Button } from "../../button";
import ModeToggle from "../../mode-toggle";
import type { AuthState } from "../../../types";
export default function Header() {
  const { auth } = useRouteLoaderData("root") as { auth: AuthState };

  return (
    <header className={styles.header}>
      <nav className={styles.header_nav}>
        <Link to="/" className={styles.header_logo}>
          <img
            src="/images/gin-logo.webp"
            alt="gin-logo"
            className={styles.header_logo_img}
          />
          <p className={styles.header_plus}>+</p>
          <img
            src="/images/react-logo.webp"
            alt="react-logo"
            className={styles.header_logo_img}
          />
        </Link>
        <ModeToggle />

        {auth.isAuthenticated ? (
          <Button variant="secondary">
            <Link to="/profile">Profile</Link>
          </Button>
        ) : (
          <Button variant="secondary">
            <Link to="/login">Login</Link>
          </Button>
        )}
      </nav>
    </header>
  );
}
