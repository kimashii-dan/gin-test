import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { logout } from "./api";

export default function Header() {
  const isAuthenticated = Boolean(localStorage.getItem("access_token"));

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      console.log(data);
      localStorage.removeItem("access_token");
      navigate(0);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  function handleLogout() {
    mutation.mutate();
  }
  return (
    <div className="p-5 absolute top-0 w-full flex flex-row justify-between">
      <div className="flex flex-row items-center gap-3">
        <img src="/images/gin-logo.webp" alt="gin-logo" className="w-15" />
        <p className="text-5xl">+</p>
        <img src="/images/react-logo.webp" alt="react-logo" className="w-15" />
      </div>
      {isAuthenticated ? (
        <button onClick={handleLogout} className="btn btn-error">
          Logout
        </button>
      ) : (
        <Link className="btn btn-secondary" to="/login">
          Login
        </Link>
      )}
    </div>
  );
}
