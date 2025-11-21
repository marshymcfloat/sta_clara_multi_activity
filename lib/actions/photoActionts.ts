"use server";

import { cookies } from "next/headers";
import { createClient } from "../supabase/server";
import { uploadPhotoServerSchema } from "../zod schemas/photoSchema";

import { put } from "@vercel/blob";

export async function uploadPhotoAction(formData: FormData) {
  try {
    const supabase = await createClient(cookies());

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const title = formData.get("title");
    const file = formData.get("file");

    const dataObject = {
      title,
      file,
    };

    const validationResult = uploadPhotoServerSchema.safeParse(dataObject);

    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.message || "Validation error",
      };
    }

    const validatedData = validationResult.data;
    const fileName = `${validatedData.title}-${user.id}-${Date.now()}`;

    const { pathname, url } = await put(fileName, file as File, {
      access: "public",
    });

    if (!pathname || !url) {
      return {
        success: false,
        error: "Failed to upload photo",
      };
    }

    const { data: photoData, error: photoError } = await supabase
      .from("Photo")
      .insert({ name: fileName, url, uploaded_by: user.id });

    if (photoError) {
      return {
        success: false,
        error: photoError.message || "Failed to upload photo",
      };
    }

    return { success: true, message: "Photo uploaded successfully" };
  } catch (err) {
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
