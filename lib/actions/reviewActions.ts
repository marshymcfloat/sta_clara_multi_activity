"use server";

import { cookies } from "next/headers";
import { createClient } from "../supabase/server";
import {
  createReviewServerSchema,
  updateReviewServerSchema,
} from "../zod schemas/reviewSchema";

export async function createReviewAction(foodId: number, formData: FormData) {
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

    const content = formData.get("content");
    const rating = formData.get("rating");

    const dataObject: Record<string, unknown> = {
      content,
    };
    if (rating) {
      dataObject.rating = Number(rating);
    }

    const validationResult = createReviewServerSchema.safeParse(dataObject);

    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.message || "Validation error",
      };
    }

    const { data: reviewData, error: reviewError } = await supabase
      .from("Review")
      .insert({
        food_id: foodId,
        content: validationResult.data.content,
        rating: validationResult.data.rating,
        created_by: user.id,
      });

    if (reviewError) {
      return {
        success: false,
        error: reviewError.message || "Failed to create review",
      };
    }

    return { success: true, message: "Review created successfully" };
  } catch (err) {
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function updateReviewAction(reviewId: number, formData: FormData) {
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

    const { data: existingReview, error: fetchError } = await supabase
      .from("Review")
      .select("created_by")
      .eq("id", reviewId)
      .single();

    if (fetchError || !existingReview) {
      return {
        success: false,
        error: "Review not found",
      };
    }

    if (existingReview.created_by !== user.id) {
      return {
        success: false,
        error: "Unauthorized - You can only update your own reviews",
      };
    }

    const content = formData.get("content");
    const rating = formData.get("rating");

    const dataObject: Record<string, unknown> = {};
    if (content) dataObject.content = content;
    if (rating) dataObject.rating = Number(rating);

    const validationResult = updateReviewServerSchema.safeParse(dataObject);

    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.message || "Validation error",
      };
    }

    const updateData: Record<string, unknown> = {};
    if (validationResult.data.content) {
      updateData.content = validationResult.data.content;
    }
    if (validationResult.data.rating !== undefined) {
      updateData.rating = validationResult.data.rating;
    }

    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabase
        .from("Review")
        .update(updateData)
        .eq("id", reviewId);

      if (updateError) {
        return {
          success: false,
          error: updateError.message || "Failed to update review",
        };
      }
    }

    return { success: true, message: "Review updated successfully" };
  } catch (err) {
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function deleteReviewAction(reviewId: number) {
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

    const { data: existingReview, error: fetchError } = await supabase
      .from("Review")
      .select("created_by")
      .eq("id", reviewId)
      .single();

    if (fetchError || !existingReview) {
      return {
        success: false,
        error: "Review not found",
      };
    }

    if (existingReview.created_by !== user.id) {
      return {
        success: false,
        error: "Unauthorized - You can only delete your own reviews",
      };
    }

    const { error: deleteError } = await supabase
      .from("Review")
      .delete()
      .eq("id", reviewId);

    if (deleteError) {
      return {
        success: false,
        error: deleteError.message || "Failed to delete review",
      };
    }

    return { success: true, message: "Review deleted successfully" };
  } catch (err) {
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
