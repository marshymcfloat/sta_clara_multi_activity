"use server";

import { cookies } from "next/headers";
import { createClient } from "../supabase/server";
import {
  createReviewServerSchema,
  updateReviewServerSchema,
} from "../zod schemas/reviewSchema";

export async function createPokemonReviewAction(
  pokemonId: number,
  formData: FormData
) {
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
      .from("PokemonReview")
      .insert({
        pokemon_id: pokemonId,
        content: validationResult.data.content,
        rating: validationResult.data.rating,
        created_by: user.id,
      })
      .select()
      .single();

    if (reviewError) {
      return {
        success: false,
        error: reviewError.message || "Failed to create review",
      };
    }

    return {
      success: true,
      data: reviewData,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function updatePokemonReviewAction(
  reviewId: number,
  formData: FormData
) {
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
      .from("PokemonReview")
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
        error: "Unauthorized",
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

    const { data: updatedReview, error: updateError } = await supabase
      .from("PokemonReview")
      .update(validationResult.data)
      .eq("id", reviewId)
      .select()
      .single();

    if (updateError) {
      return {
        success: false,
        error: updateError.message || "Failed to update review",
      };
    }

    return {
      success: true,
      data: updatedReview,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function deletePokemonReviewAction(reviewId: number) {
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
      .from("PokemonReview")
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
        error: "Unauthorized",
      };
    }

    const { error: deleteError } = await supabase
      .from("PokemonReview")
      .delete()
      .eq("id", reviewId);

    if (deleteError) {
      return {
        success: false,
        error: deleteError.message || "Failed to delete review",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
