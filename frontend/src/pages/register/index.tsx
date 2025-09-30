import { useForm } from "react-hook-form";
import type z from "zod";
import { registerSchema } from "../../shared/lib/schemas";
import { Link, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { register } from "./api";
import { zodResolver } from "@hookform/resolvers/zod";

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
      navigate("/login");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  async function onSubmit(formData: z.infer<typeof registerSchema>) {
    const { email, password } = formData;
    mutation.mutate({ email, password });
  }

  return (
    <main>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5 bg-base-100 border-base-300 rounded-box border p-10 shadow-md md:min-w-lg"
      >
        <fieldset className="fieldset flex flex-col gap-5">
          <legend className="fieldset-legend text-lg font-bold">
            Register
          </legend>

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

          <label className="label flex-col items-start">
            <span className="label-text">Confirm Password</span>
            <input
              type="password"
              className={`input input-lg w-full ${
                form.formState.errors.confirmPassword ? "input-error" : ""
              }`}
              placeholder="Confirm Password"
              {...form.register("confirmPassword")}
            />
          </label>

          {form.formState.errors.confirmPassword && (
            <p className="text-error">
              {form.formState.errors.confirmPassword.message}
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
          Register
        </button>

        <div className="flex gap-2">
          <p>Already have an account?</p>
          <Link to="/login" className="text-blue-300">
            Login
          </Link>
        </div>
      </form>
    </main>
  );
}
