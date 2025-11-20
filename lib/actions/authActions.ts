"use server";

import { cookies } from "next/headers";
import { createClient } from "../supabase/server";
import {
  authLoginSchema,
  AuthLoginTypes,
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

export async function authLoginAction(types: AuthLoginTypes) {
  try {
    const supabase = await createClient(cookies());

    const validationResult = authLoginSchema.safeParse(types);

    if (!validationResult.success) {
      return {
        success: false,
        error: "Validation error",
      };
    }

    const { email, password } = validationResult.data;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return { success: false, error: error?.message || "Invalid credentials" };
    }

    return { success: true, message: "Login successful" };
  } catch (err) {
    console.error(err);
    return {
      sucess: false,
      error: "An unexpected error occurred",
    };
  }
}
