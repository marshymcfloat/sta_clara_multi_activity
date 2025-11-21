import { z } from "zod";

export const uploadPhotoClientSchema = z
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

export const uploadPhotoServerSchema = z.object({
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

export const updateUploadPhotoSchema = uploadPhotoClientSchema.partial();
export const updateUploadPhotoServerSchema = uploadPhotoServerSchema.partial();

export type UploadPhotoClientTypes = z.infer<typeof uploadPhotoClientSchema>;
export type UploadPhotoServerTypes = z.infer<typeof uploadPhotoServerSchema>;
export type UpdateUploadPhotoClientTypes = z.infer<
  typeof updateUploadPhotoSchema
>;
export type UpdateUploadPhotoServerTypes = z.infer<
  typeof updateUploadPhotoServerSchema
>;
