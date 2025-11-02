import {
  ArrowLeftStartOnRectangleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { Card } from "../../../../shared/ui/card";
import type { User } from "../../../../shared/types";
import { Button } from "../../../../shared/ui/button";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { logout } from "../../api";
import { useNavigate } from "react-router";
import AvatarUploader from "../avatar-uploader";

type MainInfoProps = {
  user: User;
  setIsEditing: (value: React.SetStateAction<boolean>) => void;
  queryClient: QueryClient;
};

export default function MainInfo({
  user,
  setIsEditing,
  queryClient,
}: MainInfoProps) {
  const navigate = useNavigate();

  const logOutMutation = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      console.log(data);
      localStorage.removeItem("access_token");
      queryClient.clear();
      navigate("/");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  function handleLogout() {
    logOutMutation.mutate();
  }

  return (
    <Card className="items-center flex-wrap justify-center md:justify-between gap-8 relative p-5 md:p-10">
      <div className="w-40 h-40 relative">
        {user.avatar_url ? (
          <img
            className="w-full h-full rounded-full object-cover"
            src={user.avatar_url}
            alt=""
          />
        ) : (
          <div className="rounded-full w-full h-full bg-background text-foreground text-5xl font-bold flex justify-center items-center">
            <>{user.email[0].toUpperCase()}</>
          </div>
        )}

        <AvatarUploader />
      </div>
      <div className="flex flex-col justify-center gap-2">
        <p className="text-2xl font-semibold text-center">{user?.name}</p>
        <p className="text-muted-foreground">
          Joined: {new Date(user.created_at ?? "").toLocaleDateString()}
        </p>
      </div>
      <div className="flex flex-row md:flex-col gap-5 justify-center">
        <Button
          className="flex gap-2 items-center justify-center font-medium"
          variant="secondary"
          onClick={() => setIsEditing(true)}
        >
          <PencilSquareIcon className="size-6" />
          <span>Edit</span>
        </Button>
        <Button
          className="flex gap-2 items-center justify-center font-medium"
          onClick={handleLogout}
          variant="danger"
        >
          <ArrowLeftStartOnRectangleIcon className="size-6" />
          <span>Logout</span>
        </Button>
      </div>
    </Card>
  );
}
