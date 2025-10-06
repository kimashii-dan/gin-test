import { NavLink } from "react-router";

export default function Logo() {
  return (
    <NavLink to="/" className="flex flex-row items-center gap-3">
      <img src="/images/gin-logo.webp" alt="gin-logo" className="w-10" />
      <p className="text-3xl">+</p>
      <img src="/images/react-logo.webp" alt="react-logo" className="w-10" />
    </NavLink>
  );
}
