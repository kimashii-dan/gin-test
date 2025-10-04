import { useMutation } from "@tanstack/react-query";
import { logout } from "./api";
import { useNavigate, useRouteLoaderData, useRevalidator } from "react-router";
import { Button } from "../../shared/ui/button";
import type { AuthState } from "../../shared/types";

export default function Profile() {
  const navigate = useNavigate();
  const revalidator = useRevalidator();

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      console.log(data);
      localStorage.removeItem("access_token");
      navigate("/");
      revalidator.revalidate();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  function handleLogout() {
    mutation.mutate();
  }

  const { auth } = useRouteLoaderData("root") as { auth: AuthState };

  return (
    <div className="max-w-9/12 flex flex-col gap-5 w-full">
      <div className="flex flex-col gap-10 md:gap-0 md:flex-row w-full justify-between bg-card text-card-foreground p-10 rounded-xl">
        <div className="aspect-square w-30">
          <div className="rounded-full w-full h-full bg-accent text-5xl font-bold flex justify-center items-center">
            {auth.user?.email[0].toUpperCase()}
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <h2 className="text-primary">{auth.user?.email}</h2>
          <p className="text-secondary-foreground">ID: #{auth.user?.id}</p>
          <p className="">
            Joined at{" "}
            {new Date(auth.user?.createdAt ?? "").toLocaleDateString()}
          </p>
        </div>
        <div className="">
          <Button onClick={handleLogout} variant="danger">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
