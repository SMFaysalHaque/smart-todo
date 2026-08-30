import { z } from "zod";

const email = z.string().trim().toLowerCase().pipe(z.email("Invalid email address"));

export const registerSchema = z.object({
  email,
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
});
