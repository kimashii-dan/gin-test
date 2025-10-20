import { useForm } from "react-hook-form";
import { Button } from "../../../../shared/ui/button";
import { Card } from "../../../../shared/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "../../../../shared/types";
import { profileSchema } from "../../../../shared/core/schemas";
import type z from "zod";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { updateUser } from "../../api";

type ProfileEditingProps = {
  user: User;
  setIsEditing: (value: React.SetStateAction<boolean>) => void;
  inputRefs: React.RefObject<{
    name: HTMLInputElement | null;
    phone: HTMLInputElement | null;
    university: HTMLInputElement | null;
    telegram_link: HTMLInputElement | null;
    bio: HTMLTextAreaElement | null;
  }>;
  queryClient: QueryClient;
};

export default function ProfileEditing({
  user,
  setIsEditing,
  inputRefs,
  queryClient,
}: ProfileEditingProps) {
  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      form.reset();
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const form = useForm({
    resolver: zodResolver(profileSchema),
    values: user
      ? {
          email: user.email,
          name: user.name,
          university: user.university,
          phone: user.phone,
          telegram_link: user.telegram_link,
          bio: user.bio,
        }
      : {
          email: "",
          name: "",
          university: "",
          phone: "",
          telegram_link: "https://t.me/",
          bio: "",
        },
  });

  function handleUpdate(userData: z.infer<typeof profileSchema>) {
    if (!user) {
      console.log("User is not authenticated");
      return;
    }

    const dataToUpdate: Partial<User> = {};

    for (const [key, value] of Object.entries(userData)) {
      const typedKey = key as keyof User;
      if (value !== user[typedKey]) {
        dataToUpdate[typedKey] = value;
      }
    }

    if (Object.keys(dataToUpdate).length === 0) {
      console.log("No changes detected.");
      return;
    }

    console.log("Updating:", dataToUpdate);
    updateUserMutation.mutate(dataToUpdate);
  }

  function handleCancelEdit() {
    form.reset();
    setIsEditing(false);
  }

  return (
    <form onSubmit={form.handleSubmit(handleUpdate)}>
      <Card className="flex-col gap-5">
        <label className="flex flex-col items-start gap-2 w-full">
          <span className="">Email</span>
          <input
            className="w-full"
            placeholder="Enter your email"
            autoComplete="email"
            {...form.register("email")}
          />
        </label>
        <label className="flex flex-col items-start gap-2 w-full">
          <span className="">Name</span>
          <input
            className="w-full"
            placeholder="Enter your name"
            autoComplete="name"
            {...form.register("name")}
            ref={(e) => {
              form.register("name").ref(e);
              inputRefs.current.name = e;
            }}
          />
        </label>
        <label className="flex flex-col items-start gap-2 w-full">
          <span className="">University</span>
          <input
            className="w-full"
            placeholder="Add your university"
            autoComplete="off"
            {...form.register("university")}
            ref={(e) => {
              form.register("university").ref(e);
              inputRefs.current.university = e;
            }}
          />
        </label>
        <label className="flex flex-col items-start gap-2 w-full">
          <span className="">Phone</span>
          <input
            type="tel"
            className="w-full"
            placeholder="Add a phone"
            autoComplete="tel"
            {...form.register("phone")}
            ref={(e) => {
              form.register("phone").ref(e);
              inputRefs.current.phone = e;
            }}
          />
        </label>
        <label className="flex flex-col items-start gap-2 w-full">
          <span className="">Telegram Link</span>
          <input
            type="url"
            className="w-full"
            placeholder="Add a telegram"
            autoComplete="off"
            {...form.register("telegram_link")}
            ref={(e) => {
              form.register("telegram_link").ref(e);
              inputRefs.current.telegram_link = e;
            }}
          />
        </label>
        <label className="flex flex-col items-start gap-2 w-full">
          <span className="">Bio</span>
          <textarea
            className="w-full h-20"
            placeholder="Add a bio"
            autoComplete="off"
            {...form.register("bio")}
            ref={(e) => {
              form.register("bio").ref(e);
              inputRefs.current.bio = e;
            }}
          />
        </label>
        <div className="flex gap-2">
          <Button
            type="submit"
            variant="primary"
            disabled={updateUserMutation.isPending}
          >
            Save
          </Button>
          <Button type="button" variant="secondary" onClick={handleCancelEdit}>
            Cancel
          </Button>
        </div>
      </Card>
    </form>
  );
}
