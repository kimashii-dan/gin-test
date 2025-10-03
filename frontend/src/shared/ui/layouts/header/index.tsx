import { Link } from "react-router";
import styles from "./style.module.css";
import { Button } from "../../button";
import { getAuthState } from "../../../auth";
export default function Header() {
  const isAuthenticated = getAuthState();

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

        {isAuthenticated ? (
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
