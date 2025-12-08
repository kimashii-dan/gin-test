import { useForm } from "react-hook-form";
import type z from "zod";
import { loginSchema } from "../../shared/core/schemas";
import { Link, useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "./api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../shared/ui/button";
import type { ServerError } from "../../shared/types";
import { Card } from "../../shared/ui/card";
import { useTranslation } from "react-i18next";

export default function Login() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { t } = useTranslation();

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.accessToken);

      queryClient.invalidateQueries({ queryKey: ["auth"] });
      navigate("/", { replace: true });
      form.reset();
    },
    onError: (error: ServerError) => {
      console.log(error.response.data.error);
    },
  });

  async function onSubmit(formData: z.infer<typeof loginSchema>) {
    const { email, password } = formData;
    mutation.mutate({ email, password });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card className="w-80 md:w-100 flex-col gap-5 p-6">
        <legend>
          <h1 className="text-4xl font-normal italic font-nice mb-2">
            {t("auth.login.title")}
          </h1>
          <p className="text-muted-foreground">{t("auth.login.description")}</p>
        </legend>

        <label className="flex flex-col items-start gap-2 w-full">
          <span className="">{t("auth.login.email.label")}</span>
          <input
            type="email"
            className="w-full"
            placeholder={t("auth.login.email.placeholder")}
            {...form.register("email")}
            autoComplete="email"
          />
        </label>

        {form.formState.errors.email && (
          <p className="text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}

        <label className="flex flex-col items-start gap-2 w-full">
          <span className="">{t("auth.login.password.label")}</span>
          <input
            type="password"
            className="w-full"
            placeholder={t("auth.login.password.placeholder")}
            {...form.register("password")}
            autoComplete="current-password"
          />
        </label>

        {form.formState.errors.password && (
          <p className="text-destructive">
            {form.formState.errors.password.message}
          </p>
        )}

        {/* Error from server */}
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
          {t("auth.login.title")}
        </Button>
        <div className="flex gap-2">
          <p>{t("auth.login.noAccount")}</p>
          <Link to="/register" className="text-accent">
            {t("auth.register.title")}
          </Link>
        </div>
      </Card>
    </form>
  );
}
