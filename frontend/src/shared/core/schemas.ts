import { z } from "zod";

export const commonSchema = z.object({
  email: z
    .string()
    .min(5, { message: "Username must be at least 8 characters long" })
    .max(50, { message: "Username cannot exceed 50 characters" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(50, { message: "Password cannot exceed 50 characters" }),
  confirmPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(50, { message: "Password cannot exceed 50 characters" }),
});

export const registerSchema = commonSchema
  .pick({
    email: true,
    password: true,
    confirmPassword: true,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export const loginSchema = commonSchema.pick({
  email: true,
  password: true,
});
