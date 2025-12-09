import { NavLink } from "react-router";

export default function Logo() {
  return (
    <NavLink to="/" className="flex flex-row items-center gap-3 w-fit">
      <img
        src="/images/graduation-hat.png"
        alt="gin-logo"
        className="md:w-15 w-8"
      />
    </NavLink>
  );
}
