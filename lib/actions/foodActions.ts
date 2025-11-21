"use server";

import { cookies } from "next/headers";
import { createClient } from "../supabase/server";
import {
  uploadFoodServerSchema,
  updateUploadFoodServerSchema,
} from "../zod schemas/foodSchema";

import { put, del } from "@vercel/blob";

export async function uploadFoodAction(formData: FormData) {
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

    const validationResult = uploadFoodServerSchema.safeParse(dataObject);

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
        error: "Failed to upload food photo",
      };
    }

    const { data: foodData, error: foodError } = await supabase
      .from("Food")
      .insert({ name: fileName, url, uploaded_by: user.id });

    if (foodError) {
      return {
        success: false,
        error: foodError.message || "Failed to upload food photo",
      };
    }

    return { success: true, message: "Food photo uploaded successfully" };
  } catch (err) {
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function updateFoodAction(foodId: number, formData: FormData) {
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

    // Get existing food to check ownership
    const { data: existingFood, error: fetchError } = await supabase
      .from("Food")
      .select("uploaded_by, url")
      .eq("id", foodId)
      .single();

    if (fetchError || !existingFood) {
      return {
        success: false,
        error: "Food not found",
      };
    }

    if (existingFood.uploaded_by !== user.id) {
      return {
        success: false,
        error: "Unauthorized - You can only update your own food photos",
      };
    }

    const title = formData.get("title");
    const file = formData.get("file");

    const dataObject: Record<string, unknown> = {};
    if (title) dataObject.title = title;
    if (file instanceof File && file.size > 0) dataObject.file = file;

    const validationResult = updateUploadFoodServerSchema.safeParse(dataObject);

    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.message || "Validation error",
      };
    }

    const validatedData = validationResult.data;
    let newUrl = existingFood.url;
    let newName = existingFood.url;

    if (validatedData.file) {
      const fileName = `${validatedData.title || "food"}-${
        user.id
      }-${Date.now()}`;
      const { pathname, url } = await put(fileName, validatedData.file, {
        access: "public",
      });

      if (!pathname || !url) {
        return {
          success: false,
          error: "Failed to upload new food photo",
        };
      }

      try {
        await del(existingFood.url!);
      } catch (delError) {
        console.error("Error deleting old file:", delError);
      }

      newUrl = url;
      newName = fileName;
    }

    const updateData: Record<string, unknown> = {};
    if (validatedData.title) {
      updateData.name = validatedData.title;
    }
    if (newUrl !== existingFood.url) {
      updateData.url = newUrl;
      if (validatedData.title) {
        updateData.name = validatedData.title;
      } else {
        updateData.name = newName;
      }
    }

    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabase
        .from("Food")
        .update(updateData)
        .eq("id", foodId);

      if (updateError) {
        return {
          success: false,
          error: updateError.message || "Failed to update food photo",
        };
      }
    }

    return { success: true, message: "Food photo updated successfully" };
  } catch (err) {
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function deleteFoodAction(foodId: number) {
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

    const { data: existingFood, error: fetchError } = await supabase
      .from("Food")
      .select("uploaded_by, url")
      .eq("id", foodId)
      .single();

    if (fetchError || !existingFood) {
      return {
        success: false,
        error: "Food not found",
      };
    }

    if (existingFood.uploaded_by !== user.id) {
      return {
        success: false,
        error: "Unauthorized - You can only delete your own food photos",
      };
    }

    try {
      await del(existingFood.url!);
    } catch (delError) {
      console.error("Error deleting file from blob:", delError);
    }

    const { error: deleteError } = await supabase
      .from("Food")
      .delete()
      .eq("id", foodId);

    if (deleteError) {
      return {
        success: false,
        error: deleteError.message || "Failed to delete food photo",
      };
    }

    return { success: true, message: "Food photo deleted successfully" };
  } catch (err) {
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
