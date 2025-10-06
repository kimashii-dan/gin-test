import { useForm } from "react-hook-form";
import type z from "zod";
import { loginSchema } from "../../shared/core/schemas";
import { Link, useNavigate, useRevalidator } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { login } from "./api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../shared/ui/button";

export default function Login() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.accessToken);
      navigate("/", { replace: true });
      form.reset();
      revalidator.revalidate();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  async function onSubmit(formData: z.infer<typeof loginSchema>) {
    const { email, password } = formData;
    mutation.mutate({ email, password });
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="w-80 md:w-96 flex flex-col gap-5 p-6 bg-card text-card-foreground rounded-lg border-border border-1"
    >
      <legend>
        <h1 className="text-xl font-bold mb-2">Login</h1>
        <p className="text-muted-foreground">
          Welcome back! Please sign in to continue.
        </p>
      </legend>

      <label className="flex flex-col items-start gap-2 w-full">
        <span className="">Email</span>
        <input
          type="email"
          className="w-full"
          placeholder="Enter your email"
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
        <span className="">Password</span>
        <input
          type="password"
          className="w-full"
          placeholder="Enter your password"
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
          {(mutation.error as any)?.response?.data?.message ||
            (mutation.error as Error).message}
        </div>
      )}

      <Button
        className="w-full"
        variant="primary"
        disabled={mutation.isPending}
      >
        Login
      </Button>
      <div className="flex gap-2">
        <p>Don't have an account yet?</p>
        <Link to="/register" className="text-accent">
          Register
        </Link>
      </div>
    </form>
  );
}
