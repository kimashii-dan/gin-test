import { NavLink, useSearchParams } from "react-router";
import styles from "./styles.module.css";
import ModeToggle from "../../mode-toggle";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import Logo from "../../logo";
import {
  ArrowLeftEndOnRectangleIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../../core/auth";
import Search from "./ui/search";
import LangToggle from "../../lang-toggle";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { data: authData } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const isAuthenticated = !!authData?.user;
  const { t } = useTranslation();

  return (
    <header className={styles.header}>
      <nav className={styles.header_nav}>
        <Logo />

        <Search searchParams={searchParams} setSearchParams={setSearchParams} />

        <div className="flex gap-5">
          <ModeToggle />
          <LangToggle />
          {isAuthenticated ? (
            <>
              <NavLink
                to="/wishlist"
                className="flex flex-row items-center gap-2"
              >
                <ShoppingCartIcon className="size-8 text-accent" />
              </NavLink>
              <NavLink to="/profile">
                <UserCircleIcon className="size-10" />
              </NavLink>
            </>
          ) : (
            <NavLink to="/login" className="flex flex-row items-center gap-1">
              <ArrowLeftEndOnRectangleIcon className="size-6" />
              <span>{t("auth.login.title")}</span>
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}
