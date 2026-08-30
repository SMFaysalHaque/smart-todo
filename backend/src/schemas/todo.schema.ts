import { z } from "zod";

export const createTodoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters"),
  content: z.string().default(""),
  completed: z.boolean().optional(),
});
