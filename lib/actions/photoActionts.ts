"use server";

import { cookies } from "next/headers";
import { createClient } from "../supabase/server";
import {
  uploadPhotoServerSchema,
  updateUploadPhotoServerSchema,
} from "../zod schemas/photoSchema";

import { put, del } from "@vercel/blob";

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

export async function updatePhotoAction(photoId: number, formData: FormData) {
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

    // Get existing photo to check ownership
    const { data: existingPhoto, error: fetchError } = await supabase
      .from("Photo")
      .select("uploaded_by, url")
      .eq("id", photoId)
      .single();

    if (fetchError || !existingPhoto) {
      return {
        success: false,
        error: "Photo not found",
      };
    }

    if (existingPhoto.uploaded_by !== user.id) {
      return {
        success: false,
        error: "Unauthorized - You can only update your own photos",
      };
    }

    const title = formData.get("title");
    const file = formData.get("file");

    const dataObject: Record<string, unknown> = {};
    if (title) dataObject.title = title;
    if (file instanceof File && file.size > 0) dataObject.file = file;

    const validationResult =
      updateUploadPhotoServerSchema.safeParse(dataObject);

    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.message || "Validation error",
      };
    }

    const validatedData = validationResult.data;
    let newUrl = existingPhoto.url;
    let newName = existingPhoto.url;

    // If file is being updated, upload new file and delete old one
    if (validatedData.file) {
      const fileName = `${validatedData.title || "photo"}-${
        user.id
      }-${Date.now()}`;
      const { pathname, url } = await put(fileName, validatedData.file, {
        access: "public",
      });

      if (!pathname || !url) {
        return {
          success: false,
          error: "Failed to upload new photo",
        };
      }

      // Delete old file from Vercel Blob
      try {
        await del(existingPhoto.url);
      } catch (delError) {
        console.error("Error deleting old file:", delError);
        // Continue with upload even if old file deletion fails
      }

      newUrl = url;
      newName = fileName;
    }

    // Update photo in database
    const updateData: Record<string, unknown> = {};
    if (validatedData.title) {
      updateData.name = validatedData.title;
    }
    if (newUrl !== existingPhoto.url) {
      updateData.url = newUrl;
      if (validatedData.title) {
        updateData.name = validatedData.title;
      } else {
        updateData.name = newName;
      }
    }

    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabase
        .from("Photo")
        .update(updateData)
        .eq("id", photoId);

      if (updateError) {
        return {
          success: false,
          error: updateError.message || "Failed to update photo",
        };
      }
    }

    return { success: true, message: "Photo updated successfully" };
  } catch (err) {
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function deletePhotoAction(photoId: number) {
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

    // Get existing photo to check ownership and get URL
    const { data: existingPhoto, error: fetchError } = await supabase
      .from("Photo")
      .select("uploaded_by, url")
      .eq("id", photoId)
      .single();

    if (fetchError || !existingPhoto) {
      return {
        success: false,
        error: "Photo not found",
      };
    }

    if (existingPhoto.uploaded_by !== user.id) {
      return {
        success: false,
        error: "Unauthorized - You can only delete your own photos",
      };
    }

    // Delete from Vercel Blob
    try {
      await del(existingPhoto.url);
    } catch (delError) {
      console.error("Error deleting file from blob:", delError);
      // Continue with database deletion even if blob deletion fails
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from("Photo")
      .delete()
      .eq("id", photoId);

    if (deleteError) {
      return {
        success: false,
        error: deleteError.message || "Failed to delete photo",
      };
    }

    return { success: true, message: "Photo deleted successfully" };
  } catch (err) {
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
