import { z } from "zod";

export const createReviewClientSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Review content is required" })
    .max(1000, { message: "Review must be less than 1000 characters" }),
  rating: z
    .number()
    .min(1, { message: "Rating must be at least 1" })
    .max(5, { message: "Rating must be at most 5" })
    .optional(),
});

export const createReviewServerSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Review content is required" })
    .max(1000, { message: "Review must be less than 1000 characters" }),
  rating: z
    .number()
    .min(1, { message: "Rating must be at least 1" })
    .max(5, { message: "Rating must be at most 5" })
    .optional(),
});

export const updateReviewSchema = createReviewClientSchema.partial();
export const updateReviewServerSchema = createReviewServerSchema.partial();

export type CreateReviewClientTypes = z.infer<typeof createReviewClientSchema>;
export type CreateReviewServerTypes = z.infer<typeof createReviewServerSchema>;
export type UpdateReviewClientTypes = z.infer<typeof updateReviewSchema>;
export type UpdateReviewServerTypes = z.infer<typeof updateReviewServerSchema>;

