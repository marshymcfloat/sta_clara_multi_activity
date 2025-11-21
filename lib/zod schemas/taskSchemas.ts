import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(255, { message: "Title must be less than 255 characters" }),
  description: z
    .string()
    .max(500, { message: "Description must be less than 500 characters" })
    .optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export type CreateTaskTypes = z.infer<typeof createTaskSchema>;
export type UpdateTaskTypes = z.infer<typeof updateTaskSchema>;
