import { useMutation, useQuery } from "@tanstack/react-query";
import { logout } from "./api";
import { useNavigate } from "react-router";
import { getUserData } from "../../shared/api";
import { Button } from "../../shared/ui/button";

export default function Profile() {
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

  const { data } = useQuery({
    queryKey: ["userData"],
    queryFn: () => getUserData(),
    retry: false,
  });

  return (
    <div className="max-w-9/12 flex flex-col gap-5 w-full">
      <div className="flex flex-col gap-10 md:gap-0 md:flex-row w-full justify-between">
        <div className="aspect-square w-30">
          <div className="rounded-full w-full h-full bg-amber-950  text-5xl font-bold flex justify-center items-center">
            {data?.user.email[0].toUpperCase()}
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <h2 className=" flex-1">{data?.user.email}</h2>
          <p className="text-accent flex-1">ID: #{data?.user.id}</p>
          <p className="text-secondary flex-1">
            Joined at{" "}
            {new Date(data?.user.createdAt ?? "").toLocaleDateString()}
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
