import { NavLink } from "react-router";

export default function Logo() {
  return (
    <NavLink to="/" className="flex flex-row items-center gap-3 w-fit">
      <img src="/images/gin-logo.webp" alt="gin-logo" className="w-15" />
    </NavLink>
  );
}
