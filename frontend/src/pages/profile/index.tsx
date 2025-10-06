import { useMutation } from "@tanstack/react-query";
import { logout, updateUser } from "./api";
import {
  useNavigate,
  useRouteLoaderData,
  useRevalidator,
  Link,
} from "react-router";
import { Button } from "../../shared/ui/button";
import type { AuthState, User } from "../../shared/types";
import { Card } from "../../shared/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "../../shared/core/schemas";
import { useForm } from "react-hook-form";
import type z from "zod";
import { useRef, useState } from "react";
import {
  AcademicCapIcon,
  ArrowLeftStartOnRectangleIcon,
  EnvelopeIcon,
  InformationCircleIcon,
  LinkIcon,
  PencilIcon,
  PencilSquareIcon,
  PhoneIcon,
  PlusIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import TelegramLogo from "../../shared/ui/telegram-logo";

export default function Profile() {
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const [isEditing, setIsEditing] = useState(false);

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

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: auth.user?.email ?? "",
      name: auth.user?.name ?? "",
      university: auth.user?.university ?? "",
      phone: auth.user?.phone ?? "",
      telegram_link: auth.user?.telegram_link ?? "",
      bio: auth.user?.bio ?? "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      form.reset();
      setIsEditing(false);
      revalidator.revalidate();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  function handleUpdate(userData: z.infer<typeof profileSchema>) {
    if (!auth.user) {
      console.log("User is not authenticated");
      return;
    }

    console.log(userData);
    const dataToUpdate: Partial<User> = {};

    for (const [key, value] of Object.entries(userData)) {
      const typedKey = key as keyof User;
      if (value !== auth.user[typedKey]) {
        dataToUpdate[typedKey] = value;
      }
    }

    if (Object.keys(dataToUpdate).length === 0) {
      console.log("No changes detected.");
      return;
    }

    console.log("Updating:", dataToUpdate);
    updateMutation.mutate(dataToUpdate);
  }

  function handleCancelEdit() {
    form.reset();
    setIsEditing(false);
  }

  const inputRefs = {
    name: useRef<HTMLInputElement | null>(null),
    phone: useRef<HTMLInputElement | null>(null),
    university: useRef<HTMLInputElement | null>(null),
    telegram_link: useRef<HTMLInputElement | null>(null),
    bio: useRef<HTMLTextAreaElement | null>(null),
  };

  function handleAddProperty(property: keyof typeof inputRefs) {
    setIsEditing(true);
    setTimeout(() => {
      inputRefs[property].current?.focus();
    }, 0);
  }

  return (
    <div className="max-w-11/12 md:max-w-9/12 flex flex-col gap-10 w-full">
      <h1 className="text-5xl font-semibold">Account</h1>
      <Card className="flex-col md:flex-row items-center">
        <div className="aspect-square w-30">
          <div className="rounded-full w-full h-full bg-background text-foreground text-5xl font-bold flex justify-center items-center">
            {auth.user?.email[0].toUpperCase()}
          </div>
        </div>
        <div className="flex flex-col justify-center gap-2">
          <p className="text-2xl font-semibold text-center">
            {auth.user?.name}
          </p>
          <p className="">
            Joined: {new Date(auth.user?.created_at ?? "").toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-row md:flex-col gap-5 justify-center">
          <Button
            className="flex gap-2 items-center justify-center"
            variant="secondary"
            onClick={() => setIsEditing(true)}
          >
            <PencilSquareIcon className="size-6" />
            <span>Edit</span>
          </Button>
          <Button
            className="flex gap-2 items-center justify-center"
            onClick={handleLogout}
            variant="danger"
          >
            <ArrowLeftStartOnRectangleIcon className="size-6" />
            <span>Logout</span>
          </Button>
        </div>
      </Card>

      {isEditing ? (
        <>
          <div className="w-full h-[2px] bg-border"></div>

          <h1 className="text-3xl">Complete Profile</h1>
          <form onSubmit={form.handleSubmit(handleUpdate)}>
            <Card className="flex-col">
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
                    inputRefs.name.current = e;
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
                    inputRefs.university.current = e;
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
                    inputRefs.phone.current = e;
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
                    inputRefs.telegram_link.current = e;
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
                    inputRefs.bio.current = e;
                  }}
                />
              </label>
              <div className="flex gap-2">
                <Button variant="primary" disabled={mutation.isPending}>
                  Save
                </Button>
                <Button variant="secondary" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </div>
            </Card>
          </form>
        </>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row gap-10">
            <Card className="flex-col">
              <div className="flex gap-2 items-center w-fit">
                <InformationCircleIcon className="size-7 text-accent" />
                <h1 className="text-2xl font-semibold">Info</h1>
              </div>
              <div className="flex flex-col gap-5 pl-5">
                <div className="flex gap-2 py-3 px-4 items-center w-fit">
                  <EnvelopeIcon className="size-5" />
                  <h2>Email: </h2>
                  <Link
                    className="text-primary break-all"
                    to={`mailto:${auth.user?.email}`}
                  >
                    {auth.user?.email ?? ""}
                  </Link>
                </div>

                {auth.user?.university !== "" ? (
                  <div className="flex gap-2 py-3 px-4  items-center w-fit">
                    <AcademicCapIcon className="size-5" />
                    <h2>University:</h2>
                    <p>{auth.user?.university}</p>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddProperty("university")}
                    className="flex py-3 px-4 rounded-md gap-2 items-center w-fit bg-accent text-accent-foreground"
                  >
                    <PlusIcon className="size-5" />
                    <h2>Add University</h2>
                    <AcademicCapIcon className="size-5" />
                  </button>
                )}
              </div>
            </Card>
            <Card className="flex-col">
              <div className="flex gap-2 items-center w-fit">
                <LinkIcon className="size-7 text-primary" />
                <h1 className="text-2xl font-semibold">Contacts</h1>
              </div>

              <div className="flex flex-col pl-5 gap-5">
                {auth.user?.phone !== "" ? (
                  <div className="flex gap-2 py-3 px-4  items-center w-fit">
                    <PhoneIcon className="size-5" />
                    <h2>Phone:</h2>
                    <Link to={`tel:${auth.user?.phone}`}>
                      {auth.user?.phone}
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddProperty("phone")}
                    className="flex py-3 px-4 rounded-md gap-2 items-center w-fit bg-accent text-accent-foreground"
                  >
                    <PlusIcon className="size-5" />
                    <h2>Add Phone</h2>
                    <PhoneIcon className="size-5" />
                  </button>
                )}

                {auth.user?.telegram_link ? (
                  <div className="flex items-center py-3 px-4 w-fit gap-1">
                    <TelegramLogo width={25} height={25} />

                    <h2 className="whitespace-nowrap">Telegram: </h2>
                    <Link
                      className="text-primary break-all"
                      to={auth.user?.telegram_link ?? ""}
                    >
                      {auth.user?.telegram_link}
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddProperty("telegram_link")}
                    className="flex py-3 px-4 rounded-md gap-2 items-center w-fit bg-accent text-accent-foreground"
                  >
                    <PlusIcon className="size-5" />
                    <h2>Add Telegram</h2>
                    <TelegramLogo width={25} height={25} />
                  </button>
                )}
              </div>
            </Card>
          </div>
          <Card className="flex flex-col">
            <div className="flex gap-2 items-center w-fit">
              <UserIcon className="size-7 text-foreground" />
              <h1 className="text-2xl font-semibold">About me</h1>
            </div>
            {auth.user?.bio !== "" ? (
              <>
                <p className="pl-5">{auth.user?.bio}</p>
              </>
            ) : (
              <button
                onClick={() => handleAddProperty("bio")}
                className="flex py-3 px-4 rounded-md gap-2 items-center w-fit bg-accent text-accent-foreground"
              >
                <PlusIcon className="size-5" />
                <h2>Add Bio</h2>
                <PencilIcon className="size-5" />
              </button>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
