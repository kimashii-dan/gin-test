import { NavLink, useSearchParams } from "react-router";
import styles from "./styles.module.css";
import ModeToggle from "../../mode-toggle";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import Logo from "../../logo";
import {
  ArrowLeftEndOnRectangleIcon,
  ShoppingCartIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../../core/auth";
import Search from "./ui/search";
import LangToggle from "../../lang-toggle";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

export default function Header() {
  const { data: authData } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const isAuthenticated = !!authData?.user;
  const [isAdmin, setIsAdmin] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const adminToken = localStorage.getItem("admin_token");
    setIsAdmin(!!adminToken);
  }, []);

  return (
    <header className={styles.header}>
      <nav className={styles.header_nav}>
        <div className="hidden md:flex flex-row justify-between gap-5 items-center w-full">
          <Logo />

          <Search
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />

          <div className="flex gap-5">
            <ModeToggle />
            <LangToggle />
            {isAdmin ? (
              <NavLink to="/admin" className="flex flex-row items-center gap-2">
                <ShieldCheckIcon className="size-6 text-highlight" />
                <span>Admin Panel</span>
              </NavLink>
            ) : isAuthenticated ? (
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
        </div>

        <div className="flex md:hidden w-full justify-center">
          <Search
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        </div>
      </nav>
    </header>
  );
}
