import { z } from "zod";
import { richTextDocSchema, emptyRichTextDoc } from "./richText.schema.js";

export const createTodoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters"),
  content: richTextDocSchema.default(emptyRichTextDoc),
  completed: z.boolean().optional(),
});

export const updateTodoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters")
    .optional(),
  content: richTextDocSchema.optional(),
  completed: z.boolean().optional(),
});

export const listTodosQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(10),
    completed: z
      .enum(["true", "false"])
      .transform((value) => value === "true")
      .optional(),
    sort: z.enum(["createdAt", "-createdAt"]).default("-createdAt"),
  })
  .strict();
