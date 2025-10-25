import { useForm } from "react-hook-form";
import type z from "zod";
import { registerSchema } from "../../shared/core/schemas";
import { Link, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { register } from "./api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../shared/ui/button";
import type { ServerError } from "../../shared/types";
import { Card } from "../../shared/ui/card";

export default function Register() {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      console.log(data);
      form.reset();
      navigate("/login");
    },
    onError: (error: ServerError) => {
      console.log(error);
    },
  });

  async function onSubmit(formData: z.infer<typeof registerSchema>) {
    const { email, password } = formData;
    mutation.mutate({ email, password });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card className="w-80 md:w-100 flex-col gap-5 p-6">
        <legend>
          <h1 className="text-4xl font-normal font-nice italic mb-2">
            Register
          </h1>
          <p className="text-muted-foreground">
            Create your account to get started.
          </p>
        </legend>

        <label className="flex flex-col items-start gap-2 w-full">
          <span className="">Email</span>
          <input
            type="email"
            className="w-full"
            placeholder="Enter your password"
            autoComplete="email"
            {...form.register("email")}
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
            autoComplete="new-password"
            {...form.register("password")}
          />
        </label>

        {form.formState.errors.password && (
          <p className="text-destructive">
            {form.formState.errors.password.message}
          </p>
        )}

        <label className="flex flex-col items-start gap-2 w-full">
          <span className="">Confirm Password</span>
          <input
            type="password"
            className="w-full"
            autoComplete="off"
            placeholder="Enter your password again"
            {...form.register("confirmPassword")}
          />
        </label>

        {form.formState.errors.confirmPassword && (
          <p className="text-destructive">
            {form.formState.errors.confirmPassword.message}
          </p>
        )}

        {mutation.isError && (
          <div className="text-destructive">
            {mutation.error.response.data.error}
          </div>
        )}
        <Button
          className="w-full"
          variant="primary"
          disabled={mutation.isPending}
        >
          Register
        </Button>

        <div className="flex gap-2">
          <p>Already have an account?</p>
          <Link to="/login" className="text-accent">
            Login
          </Link>
        </div>
      </Card>
    </form>
  );
}
