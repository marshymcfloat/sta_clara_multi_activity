import { regex, z } from "zod";

export const authRegisterSchema = z
  .object({
    email: z
      .string()
      .email()
      .min(1, { message: "Email is required" })
      .max(255, { message: "Email must be less than 255 characters" }),
    fullname: z
      .string()
      .min(1, { message: "Full name is required" })
      .max(255, { message: "Full name must be less than 255 characters" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
        }
      )
      .max(50, { message: "Password must be less than 50 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" })
      .max(50, { message: "Confirm password must be less than 50 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const authLoginSchema = z.object({
  email: z
    .string()
    .email()
    .min(1, { message: "Email is required" })
    .max(255, { message: "Email must be less than 255 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(50, { message: "Password must be less than 50 characters" }),
});

export type AuthRegisterTypes = z.infer<typeof authRegisterSchema>;
export type AuthLoginTypes = z.infer<typeof authLoginSchema>;
