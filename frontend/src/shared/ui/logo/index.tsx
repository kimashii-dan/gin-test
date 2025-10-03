import { Link } from "react-router";

export default function Logo() {
  return (
    <Link to="/" className="flex flex-row items-center gap-3">
      <img src="/images/gin-logo.webp" alt="gin-logo" className="w-15" />
      <p className="text-5xl">+</p>
      <img src="/images/react-logo.webp" alt="react-logo" className="w-15" />
    </Link>
  );
}
