import { z } from "zod";

export const createNoteSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(255, { message: "Title must be less than 255 characters" }),
  content: z
    .string()
    .min(1, { message: "Content is required" })
    .max(10000, { message: "Content must be less than 10000 characters" }),
});

export const updateNoteSchema = createNoteSchema.partial();

export type CreateNoteTypes = z.infer<typeof createNoteSchema>;
export type UpdateNoteTypes = z.infer<typeof updateNoteSchema>;

