import { z } from "zod";

export const commonSchema = z.object({
  email: z
    .email("This is not a valid email.")
    .min(1, { message: "This field has to be filled." }),

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

export const profileSchema = z.object({
  email: z
    .email("This is not a valid email.")
    .min(1, { message: "This field has to be filled." }),

  name: z.string().min(1, "Name is required").optional(),
  university: z.string().optional(),
  phone: z.string().optional(),
  telegram_link: z.union([z.literal(""), z.url("Invalid URL")]).optional(),
  bio: z.string().optional(),
});
