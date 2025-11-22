"use server";

import { cookies } from "next/headers";
import { createClient } from "../supabase/server";
import { createClient as createServiceRoleClient } from "@supabase/supabase-js";
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

    return { success: true, message: "Login successful", data: data.user.id };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function deleteAccountAction() {
  try {
    const supabaseUser = await createClient(cookies());
    const {
      data: { user },
      error: userError,
    } = await supabaseUser.auth.getUser();

    if (userError || !user) {
      return { success: false, error: userError?.message || "Login first" };
    }

    const supabaseAdmin = createServiceRoleClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (error) {
      return {
        success: false,
        error: error.message || "Failed to delete account",
      };
    }

    return { success: true, message: "Account deleted successfully" };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function logoutAction() {
  try {
    const supabase = await createClient(cookies());

    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, error: error.message || "Failed to logout" };
    }
    return { success: true, message: "Logout successful" };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
