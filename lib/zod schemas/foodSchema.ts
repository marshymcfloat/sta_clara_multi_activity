import { z } from "zod";

export const uploadFoodClientSchema = z
  .object({
    title: z
      .string()
      .min(1, { message: "Title is required" })
      .max(255, { message: "Title must be less than 255 characters" }),

    file: z.instanceof(File),
  })
  .refine((data) => data.file.size > 0, {
    message: "File is required",
    path: ["file"],
  })
  .refine(
    (data) =>
      data.file.type === "image/jpeg" ||
      data.file.type === "image/jpg" ||
      data.file.type === "image/png",
    {
      message: "File must be a JPEG or PNG image",
      path: ["file"],
    }
  )
  .refine((data) => data.file.size <= 5 * 1024 * 1024, {
    message: "File size must be less than 5MB",
    path: ["file"],
  });

export const uploadFoodServerSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(255, { message: "Title must be less than 255 characters" }),

  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, {
      message: "File is required",
    })
    .refine(
      (file) =>
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png",
      {
        message: "File must be a JPEG or PNG image",
      }
    )
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File size must be less than 5MB",
    }),
});

export const updateUploadFoodSchema = uploadFoodClientSchema.partial();
export const updateUploadFoodServerSchema = uploadFoodServerSchema.partial();

export type UploadFoodClientTypes = z.infer<typeof uploadFoodClientSchema>;
export type UploadFoodServerTypes = z.infer<typeof uploadFoodServerSchema>;
export type UpdateUploadFoodClientTypes = z.infer<
  typeof updateUploadFoodSchema
>;
export type UpdateUploadFoodServerTypes = z.infer<
  typeof updateUploadFoodServerSchema
>;

