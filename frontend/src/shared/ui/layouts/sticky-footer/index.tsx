import { NavLink } from "react-router";
import { useAuth } from "../../../core/auth";

import Logo from "../../logo";

import {
  ArrowLeftEndOnRectangleIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { UserCircleIcon } from "@heroicons/react/24/solid";

export default function StickyFooter() {
  const { data: authData } = useAuth();
  const { t } = useTranslation();
  const isAuthenticated = !!authData?.user;
  return (
    <div className="md:hidden sticky bg-background border-border border-t-1 bottom-0 w-full z-10 flex items-center justify-center">
      <div className="flex flex-row justify-between gap-5 items-center w-11/12 md:w-10/12 px-6 py-4">
        <Logo />

        <div className="flex gap-5">
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
      </div>
    </div>
  );
}
