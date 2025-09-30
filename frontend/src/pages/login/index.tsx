import { useForm } from "react-hook-form";
import type z from "zod";
import { loginSchema } from "../../shared/lib/schemas";
import { Link, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { login } from "./api";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Login() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log(data);
      localStorage.setItem("access_token", data.accessToken);
      navigate("/");
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
    <main>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5 bg-base-100 border-base-300 rounded-box border p-10 shadow-md md:min-w-lg "
      >
        <fieldset className="fieldset flex flex-col gap-5">
          <legend className="fieldset-legend text-lg font-bold">Login</legend>

          <label className="label flex-col items-start">
            <span className="label-text">Email</span>
            <input
              type="email"
              className={`input input-lg w-full ${
                form.formState.errors.email ? "input-error" : ""
              }`}
              placeholder="Email"
              {...form.register("email")}
            />
          </label>

          {form.formState.errors.email && (
            <p className="text-error">{form.formState.errors.email.message}</p>
          )}

          <label className="label flex-col items-start">
            <span className="label-text">Password</span>
            <input
              type="password"
              className={`input input-lg w-full ${
                form.formState.errors.password ? "input-error" : ""
              }`}
              placeholder="Password"
              {...form.register("password")}
            />
          </label>

          {form.formState.errors.password && (
            <p className="text-error">
              {form.formState.errors.password.message}
            </p>
          )}
        </fieldset>

        {/* Error from server */}
        {mutation.isError && (
          <div className="text-error">
            {(mutation.error as any)?.response?.data?.message ||
              (mutation.error as Error).message}
          </div>
        )}

        <button
          type="submit"
          className={`btn btn-primary w-full ${
            mutation.isPending ? "loading" : ""
          }`}
          disabled={mutation.isPending}
        >
          Login
        </button>
        <div className="flex gap-2">
          <p>Don't have an account yet?</p>
          <Link to="/register" className="text-blue-300">
            Register
          </Link>
        </div>
      </form>
    </main>
  );
}
