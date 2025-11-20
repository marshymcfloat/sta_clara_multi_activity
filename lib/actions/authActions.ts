"use server";

import { cookies } from "next/headers";
import { createClient } from "../supabase/server";
import {
  authRegisterSchema,
  AuthRegisterTypes,
} from "../zod schemas/authSchemas";
import { stringCapitalizer } from "../utils";

export async function authRegisterAction(types: AuthRegisterTypes) {
  try {
    const supabase = await createClient(cookies());

    const validationResult = authRegisterSchema.safeParse(types);

    if (!validationResult.success) {
      return {
        success: false,
        error: "Validation error",
      };
    }

    const { email, fullname, password } = validationResult.data;

    const capitalizedName = stringCapitalizer(fullname);

    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          fullname: capitalizedName,
        },
      },
    });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, message: "Account created successfully" };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
