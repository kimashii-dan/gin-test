import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { adminLogin } from "./api";
import { Button } from "../../shared/ui/button";
import type { ServerError } from "../../shared/types";
import { Card } from "../../shared/ui/card";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

type AdminLoginForm = {
  username: string;
  password: string;
};

export default function AdminLogin() {
  const { t } = useTranslation();
  const form = useForm<AdminLoginForm>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: adminLogin,
    onSuccess: (data) => {
      localStorage.setItem("admin_token", data.accessToken);
      navigate("/admin", { replace: true });
      form.reset();
    },
    onError: (error: ServerError) => {
      console.log(error.response.data.error);
    },
  });

  async function onSubmit(formData: AdminLoginForm) {
    const { username, password } = formData;
    mutation.mutate({ username, password });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card className="w-80 md:w-100 flex-col gap-5 p-6">
        <legend className="flex flex-col items-center gap-3">
          <ShieldCheckIcon className="size-12 text-highlight" />
          <h1 className="text-4xl font-normal italic font-nice mb-2">
            {t("admin.login.title")}
          </h1>
          <p className="text-muted-foreground text-center">
            {t("admin.login.description")}
          </p>
        </legend>

        <label className="flex flex-col items-start gap-2 w-full">
          <span>{t("admin.login.username.label")}</span>
          <input
            type="text"
            className="w-full"
            placeholder={t("admin.login.username.placeholder")}
            {...form.register("username", { required: true })}
            autoComplete="username"
          />
        </label>

        {form.formState.errors.username && (
          <p className="text-destructive">
            {t("admin.login.username.required")}
          </p>
        )}

        <label className="flex flex-col items-start gap-2 w-full">
          <span>{t("admin.login.password.label")}</span>
          <input
            type="password"
            className="w-full"
            placeholder={t("admin.login.password.placeholder")}
            {...form.register("password", { required: true })}
            autoComplete="current-password"
          />
        </label>

        {form.formState.errors.password && (
          <p className="text-destructive">
            {t("admin.login.password.required")}
          </p>
        )}

        {mutation.isError && (
          <div className="text-destructive">
            {mutation.error.response.data.error}
          </div>
        )}

        <Button
          className="w-full font-medium"
          variant="primary"
          disabled={mutation.isPending}
        >
          {mutation.isPending
            ? t("admin.login.button.loading")
            : t("admin.login.button.login")}
        </Button>

        <Link
          to="/"
          className="text-center text-sm text-muted-foreground hover:text-foreground"
        >
          {t("admin.login.backToHome")}
        </Link>
      </Card>
    </form>
  );
}
